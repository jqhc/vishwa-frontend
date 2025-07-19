import React, { useState, useEffect } from 'react';
import { Bot, User, Send, Plus, Eye, Play, CheckCircle, Clock, DollarSign, TrendingUp, Shield, Sparkles, RotateCcw, ExternalLink, Save, Zap, AlertCircle } from 'lucide-react';
import { createSpendingPlan, approveSpendingPlan, executeSpendingPlan, getSpendingPlans, getTransactions, getConnectedWallet, connectWallet } from './APIService';
import KitePassDialog from "./components/ui/KitePassDialog";
import KiteLogo from "./assets/KiteLogo.png";

// Updated interfaces to match backend
interface SpendingPlan {
  id: string;
  name: string;
  amount: number;
  status: 'draft' | 'approved' | 'executed';
  created_at: string;
  allocations: Array<{
    category: string;
    amount: number;
    description: string;
    is_executed?: boolean;
    execution_date?: string;
    transaction_id?: string;
  }>;
  total_allocated: number;
  explanation: string;
  priorities: Record<string, string[]>;
  constraints: Record<string, any>;
  approved_at?: string;
  execution_date?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface Transaction {
  id: string;
  plan_id: string;
  amount: number;
  category: string;
  description: string;
  source_wallet: string;
  destination_wallet: string;
  timestamp: string;
  status: string;
  tx_hash: string;
  error_message?: string;
}

const AIAgentPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'chat' | 'create' | 'plans'>('chat');
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I can help you create and optimize spending plans for your mining operations. What would you like to do today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // API-connected state
  const [spendingPlans, setSpendingPlans] = useState<SpendingPlan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [isExecutingPlan, setIsExecutingPlan] = useState(false);
  
  const [planForm, setPlanForm] = useState({
    name: 'Q4 Mining Strategy',
    amount: 50000,
    priorities: {
      'high': ['equipment'],
      'medium': ['utilities'],
      'low': ['reserve']
    } as Record<string, string[]>,
    description: '',
    constraints: {} as Record<string, any>
  });


  // Modal states
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showAIOptimizationModal, setShowAIOptimizationModal] = useState(false);
  const [showExecutePlanModal, setShowExecutePlanModal] = useState(false);
  const [showDraftSavedModal, setShowDraftSavedModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load spending plans
      const plans = await getSpendingPlans();
      let plansToSet = Array.isArray(plans) ? plans : [];
      // Always add a dummy example plan for UI testing
      plansToSet.push({
        id: 'plan-q2-2024',
        name: 'Q2 Mining Operations',
        amount: 10000,
        status: 'draft' as const,
        created_at: new Date().toISOString(),
        allocations: [
          { category: 'equipment', amount: 5000, description: 'Procurement of new mining rigs and hardware upgrades.' },
          { category: 'utilities', amount: 2000, description: 'Electricity and cooling costs for 24/7 operation.' },
          { category: 'wages', amount: 2000, description: 'Monthly salaries for on-site staff and technicians.' },
          { category: 'reserve', amount: 1000, description: 'Contingency fund for unexpected expenses.' }
        ],
        total_allocated: 10000,
        explanation: 'AI-optimized allocation for Q2 2024: Prioritizes equipment upgrades to maximize hash rate, ensures operational stability with dedicated utility and wage budgets, and maintains a reserve for risk mitigation.',
        priorities: { high: ['equipment'], medium: ['utilities'], low: ['reserve', 'wages'] },
        constraints: {},
        approved_at: undefined,
        execution_date: undefined,
      });
      console.log('Spending plans after loading:', plansToSet);
      setSpendingPlans(plansToSet);

      // Load transactions
      const txs = await getTransactions();
      if (Array.isArray(txs)) {
        setTransactions(txs);
      }
    } catch (error) {
      // Fallback: show example plan even if API fails
      const examplePlan = {
        id: 'plan-q2-2024',
        name: 'Q2 Mining Operations',
        amount: 10000,
        status: 'draft' as const,
        created_at: new Date().toISOString(),
        allocations: [
          { category: 'equipment', amount: 5000, description: 'Procurement of new mining rigs and hardware upgrades.' },
          { category: 'utilities', amount: 2000, description: 'Electricity and cooling costs for 24/7 operation.' },
          { category: 'wages', amount: 2000, description: 'Monthly salaries for on-site staff and technicians.' },
          { category: 'reserve', amount: 1000, description: 'Contingency fund for unexpected expenses.' }
        ],
        total_allocated: 10000,
        explanation: 'AI-optimized allocation for Q2 2024: Prioritizes equipment upgrades to maximize hash rate, ensures operational stability with dedicated utility and wage budgets, and maintains a reserve for risk mitigation.',
        priorities: { high: ['equipment'], medium: ['utilities'], low: ['reserve', 'wages'] },
        constraints: {},
        approved_at: undefined,
        execution_date: undefined,
      };
      setSpendingPlans([examplePlan]);
      console.log('API failed, showing only example plan');
      // Optionally, setTransactions([]) or handle transaction fallback
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    
    try {
      const lowerMessage = currentMessage.toLowerCase();
      
      if (lowerMessage.includes('create') && lowerMessage.includes('plan')) {
        // Extract budget amount if mentioned
        const budgetMatch = currentMessage.match(/\$?([\d,]+)/);
        if (budgetMatch) {
          const amount = parseInt(budgetMatch[1].replace(',', ''));
          setPlanForm(prev => ({ ...prev, amount }));
        }
        
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I'll help you create a spending plan. Based on your message, I understand you want to allocate ${budgetMatch ? `$${budgetMatch[1]}` : 'your budget'}. Let me create an optimized plan for you.`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
        
        // Auto-create plan
        if (budgetMatch) {
          await handleCreatePlanFromChat(parseInt(budgetMatch[1].replace(',', '')));
        }
      } else {
        // Generic response
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'I can help you create spending plans, optimize allocations, and execute transactions. Would you like me to create a new plan or analyze your existing ones?',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlanFromChat = async (amount: number) => {
    try {
      setIsCreatingPlan(true);
      
      const planData = {
        amount,
        priorities: planForm.priorities,
        constraints: planForm.constraints,
        description: currentMessage.trim()
      };
      
      const newPlan = await createSpendingPlan(planData);
      
      if (newPlan.id) {
        setSpendingPlans(prev => [...prev, newPlan]);
        
        const successMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'ai',
          content: `✅ I've created an optimized spending plan for $${amount.toLocaleString()}! The plan allocates funds across ${newPlan.allocations.length} categories. ${newPlan.explanation}`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, successMessage]);
      }
    } catch (error) {
      console.error('Error creating plan from chat:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error creating the spending plan. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsCreatingPlan(false);
    }
  };

  const handleCreatePlan = async () => {
    try {
      setIsCreatingPlan(true);
      
      const planData = {
        name: planForm.name,
        amount: planForm.amount,
        priorities: planForm.priorities,
        constraints: planForm.constraints,
        description: planForm.description
      };
      
      const newPlan = await createSpendingPlan(planData);
      
      if (newPlan.id) {
        setSpendingPlans(prev => [...prev, newPlan]);
        setShowCreatePlanModal(true);
      }
    } catch (error) {
      console.error('Error creating plan:', error);
    } finally {
      setIsCreatingPlan(false);
    }
  };

  const handleApprovePlan = async (planId: string) => {
    try {
      const approvedPlan = await approveSpendingPlan(planId);
      setSpendingPlans(prev => prev.map(p => p.id === planId ? approvedPlan : p));
    } catch (error) {
      console.error('Error approving plan:', error);
    }
  };

  const handleExecutePlan = async (planId: string) => {
    // if (!connectedWallet) {
    //   setShowWalletModal(true);
    //   return;
    // }

    try {
      setIsExecutingPlan(true);
      setSelectedPlanId(planId);
      
      // First approve the plan if it's not already approved
      const plan = spendingPlans.find(p => p.id === planId);
      if (plan?.status === 'draft') {
        await handleApprovePlan(planId);
      }
      
      // Execute the plan
      const result = await executeSpendingPlan(planId);
      
      if (result.transactions) {
        // Update transactions
        setTransactions(prev => [...prev, ...result.transactions]);
        
        // Update plan status
        setSpendingPlans(prev => prev.map(p => 
          p.id === planId ? { ...p, status: 'executed' as const, execution_date: new Date().toISOString() } : p
        ));
        
        setShowExecutePlanModal(true);
      }
    } catch (error) {
      console.error('Error executing plan:', error);
    } finally {
      setIsExecutingPlan(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-400';
      case 'approved': return 'text-blue-400';
      case 'executed': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'executed': return <Play className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const optimizedPlan = spendingPlans[spendingPlans.length - 1];
  const selectedPlan = selectedPlanId ? spendingPlans.find(p => p.id === selectedPlanId) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <Sparkles className="w-10 h-10 text-purple-400" />
          <span>AI Strategy Agent</span>
        </h2>
        <p className="text-purple-300 text-lg max-w-3xl mx-auto">
          Get AI-powered spending optimization for your mining operations
        </p>
        
        {/* Wallet Connection Status */}
        {/* <div className="mt-4 flex items-center justify-center space-x-4">
          {connectedWallet ? (
            <div className="flex items-center space-x-2 bg-green-900 bg-opacity-30 px-4 py-2 rounded-lg border border-green-500 border-opacity-30">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-sm">Wallet: {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}</span>
            </div>
          ) : (
            <button
              onClick={() => setShowWalletModal(true)}
              className="bg-yellow-900 bg-opacity-30 px-4 py-2 rounded-lg border border-yellow-500 border-opacity-30 text-yellow-400 text-sm hover:bg-yellow-600 hover:bg-opacity-20 transition-colors cursor-pointer"
            >
              Connect Wallet
            </button>
          )}
        </div> */}
      </div>

      {/* View Toggle */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveView('chat')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeView === 'chat' ? 'bg-purple-600 text-white' : 'bg-purple-900 bg-opacity-30 text-purple-300 hover:bg-purple-600 hover:bg-opacity-50'
          }`}
        >
          <Bot className="w-5 h-5 mr-2 inline" />
          Chat with AI
        </button>
        <button
          onClick={() => setActiveView('create')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeView === 'create' ? 'bg-purple-600 text-white' : 'bg-purple-900 bg-opacity-30 text-purple-300 hover:bg-purple-600 hover:bg-opacity-50'
          }`}
        >
          <Plus className="w-5 h-5 mr-2 inline" />
          Create New Plan
        </button>
        <button
          onClick={() => setActiveView('plans')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeView === 'plans' ? 'bg-purple-600 text-white' : 'bg-purple-900 bg-opacity-30 text-purple-300 hover:bg-purple-600 hover:bg-opacity-50'
          }`}
        >
          <Eye className="w-5 h-5 mr-2 inline" />
          Existing Plans ({spendingPlans.length})
        </button>
      </div>

      {/* Chat View */}
      {activeView === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chat Interface */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">AI Strategy Agent</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Online</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-3 max-w-sm ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                        : 'bg-gradient-to-r from-purple-500 to-violet-600'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={message.type === 'user' ? 'user-message' : 'ai-message'}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {(isLoading || isCreatingPlan) && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-sm">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="ai-message">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask about spending optimization..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 input-field"
                disabled={isLoading || isCreatingPlan}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || isCreatingPlan}
                className="gradient-button px-4 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* AI Spending Plan Results */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">AI Spending Plan Results</h3>
            </div>
            
            {!optimizedPlan && (
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-purple-900 bg-opacity-30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Bot className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-purple-300 text-sm">
                  Share your budget and priorities to get AI-powered spending recommendations
                </p>
              </div>
            )}
            
            {optimizedPlan && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Strategy Analysis Complete</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-xl p-4 border border-green-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 font-medium text-sm">Budget</span>
                    </div>
                    <p className="text-2xl font-bold text-white">${optimizedPlan.amount.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 rounded-xl p-4 border border-yellow-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-300 font-medium text-sm">Allocated</span>
                    </div>
                    <p className="text-2xl font-bold text-white">${optimizedPlan.total_allocated.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-300 font-medium text-sm">Status</span>
                    </div>
                    <p className="text-2xl font-bold text-white capitalize">{optimizedPlan.status}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-white font-semibold">Allocation Breakdown</h4>
                  {optimizedPlan.allocations.map((allocation, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-500 border-opacity-20">
                      <div>
                        <span className="text-white font-medium capitalize">{allocation.category}</span>
                        <p className="text-purple-300 text-sm">{allocation.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-green-400 font-semibold">${allocation.amount.toLocaleString()}</span>
                        <p className="text-purple-300 text-sm">{((allocation.amount / optimizedPlan.amount) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-purple-900 bg-opacity-20 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">AI Explanation</h4>
                  <p className="text-purple-300 text-sm">{optimizedPlan.explanation}</p>
                </div>
                
                <div className="flex space-x-3">
                  {optimizedPlan.status !== 'executed' && (
                    <button
                      onClick={() => handleExecutePlan(optimizedPlan.id)}
                      disabled={isExecutingPlan}
                      className="flex-1 gradient-button disabled:opacity-50"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      {isExecutingPlan ? 'Executing...' : 'Execute Strategy'}
                    </button>
                  )}
                  <button 
                    onClick={() => loadInitialData()}
                    className="outline-button"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create New Plan View */}
      {activeView === 'create' && (
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-6">Create New Spending Plan</h3>

            {/* Plan Name & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white font-medium mb-2">Plan Name</label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Q4 Mining Strategy"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Budget Amount (PyUSD)</label>
                <input
                  type="number"
                  value={planForm.amount}
                  onChange={(e) => setPlanForm({ ...planForm, amount: Number(e.target.value) })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Plan Description */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Plan Description</label>
              <input
                type="text"
                value={planForm.description}
                onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                className="input-field"
                placeholder="Optional description"
              />
            </div>

            {/* Priority Categories with Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {['equipment', 'utilities', 'wages', 'reserve', 'maintenance', 'taxes', 'insurance'].map((category) => {
                const currentLevel = Object.entries(planForm.priorities).find(([_, cats]) => cats.includes(category))?.[0] || 'none';

                return (
                  <div
                    key={category}
                    className="bg-gradient-to-br from-purple-800/30 to-purple-900/20 p-3 rounded-xl border border-purple-500/20 shadow-sm"
                  >
                    <label className="block text-sm font-medium text-white mb-1 capitalize">
                      {category}
                    </label>
                    <select
                      value={currentLevel}
                      onChange={(e) => {
                        const newLevel = e.target.value;
                        const updated: Record<string, string[]> = { high: [], medium: [], low: [] };
                        Object.entries(planForm.priorities).forEach(([level, list]) => {
                          updated[level as 'high' | 'medium' | 'low'] = list.filter(cat => cat !== category);
                        });
                        if (newLevel !== 'none') {
                          updated[newLevel as 'high' | 'medium' | 'low'].push(category);
                        }
                        setPlanForm({ ...planForm, priorities: updated });
                      }}
                      className="w-full mt-1 px-3 py-2 bg-purple-950 text-white text-sm rounded-lg border border-purple-500/40 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                    >
                      <option value="none">None</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                );
              })}
            </div>



            {/* Create Button */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCreatePlan}
                disabled={isCreatingPlan}
                className="gradient-button disabled:opacity-50"
              >
                <Zap className="w-5 h-5 mr-2" />
                {isCreatingPlan ? 'Creating...' : 'Optimize with AI'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Existing Plans View */}
      {activeView === 'plans' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Existing Plans ({spendingPlans.length})</h3>
            <button
              onClick={() => setActiveView('create')}
              className="gradient-button"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Plan
            </button>
          </div>
          
          {spendingPlans.length === 0 ? (
            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-900 bg-opacity-30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Eye className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">No Plans Yet</h4>
              <p className="text-purple-300 text-sm mb-4">
                Create your first spending plan to get started
              </p>
              <button
                onClick={() => setActiveView('create')}
                className="gradient-button"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Plan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spendingPlans.map((plan) => {
                const isExpanded = expandedPlans[plan.id];
                const allocationsToShow = isExpanded ? plan.allocations : plan.allocations.slice(0, 4);
                return (
                  <div key={plan.id} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`${getStatusColor(plan.status)}`}>
                          {getStatusIcon(plan.status)}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{plan.name}</h4>
                        <p className="text-purple-300 text-sm">
                          Created {new Date(plan.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 font-bold text-lg">
                        ${plan.amount.toLocaleString()}
                      </span>
                      <p className={`text-xs capitalize ${getStatusColor(plan.status)}`}>
                        {plan.status}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <h5 className="text-white font-medium">Allocations</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {allocationsToShow.map((allocation, index) => (
                        <div key={index} className="bg-purple-900 bg-opacity-20 rounded-lg p-2">
                          <div className="flex justify-between items-center">
                            <span className="text-purple-300 text-sm capitalize">
                              {allocation.category}
                            </span>
                            <span className="text-white font-medium text-sm">
                              ${allocation.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-purple-900 bg-opacity-30 rounded-full h-1 mt-1">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-violet-600 h-1 rounded-full"
                              style={{ width: `${(allocation.amount / plan.amount) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {plan.allocations.length > 4 && (
                      <button
                        onClick={() => setExpandedPlans(prev => ({
                          ...prev,
                          [plan.id]: !prev[plan.id]
                        }))}
                        className="text-purple-300 text-sm mt-2 hover:underline"
                      >
                        {isExpanded
                          ? 'Show Less'
                          : `+${plan.allocations.length - 4} more allocations`}
                      </button>
                    )}
                  </div>
                  
                  <div className="bg-purple-900 bg-opacity-20 rounded-lg p-3 mb-4">
                    <p className="text-purple-300 text-sm">
                      {plan.explanation.length > 100 
                        ? `${plan.explanation.substring(0, 100)}...` 
                        : plan.explanation}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    {plan.status === 'draft' && (
                      <button
                        onClick={() => handleApprovePlan(plan.id)}
                        className="flex-1 bg-blue-600 bg-opacity-20 border border-blue-500 border-opacity-30 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600 hover:bg-opacity-30 transition-colors text-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2 inline" />
                        Approve
                      </button>
                    )}
                    {(plan.status === 'approved' || plan.status === 'draft') && (
                      <button
                        onClick={() => handleExecutePlan(plan.id)}
                        disabled={isExecutingPlan}
                        className="flex-1 gradient-button text-sm disabled:opacity-50"
                      >
                        <Play className="w-4 h-4 mr-2 inline" />
                        Execute
                      </button>
                    )}
                    {plan.status === 'executed' && (
                      <button className="flex-1 bg-green-600 bg-opacity-20 border border-green-500 border-opacity-30 text-green-400 px-4 py-2 rounded-lg text-sm cursor-not-allowed">
                        <CheckCircle className="w-4 h-4 mr-2 inline" />
                        Executed
                      </button>
                    )}
                    {/* KitePass Dialog Button */}
                    <KitePassDialog 
                      kitePass={{
                        passId: 'kitepass-123',
                        monthlyLimit: '10000',
                        usedThisMonth: '2962.67',
                        createdAt: new Date().toISOString(),
                      }}
                      transactions={[
                        {
                          id: 'tx-1',
                          amount: 1200,
                          description: 'Maintenance service',
                          status: 'pending',
                          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
                        },
                        {
                          id: 'tx-2',
                          amount: 2500,
                          description: 'Mining Equipment',
                          status: 'completed',
                          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
                        },
                        {
                          id: 'tx-3',
                          amount: 462.67,
                          description: 'Electricity Bill',
                          status: 'completed',
                          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                        },
                      ]}
                    >
                      <button className="flex-1 flex items-center justify-center space-x-2 bg-transparent hover:bg-purple-900/10 border border-purple-400/30 rounded-lg py-2 px-3 transition-colors">
                        <img src={KiteLogo} alt="Kite Logo" className="w-6 h-6" style={{ background: 'transparent' }} />
                        <span>Protected by Kite</span>
                      </button>
                    </KitePassDialog>
                  </div>
                </div>
              );})}
            </div>
          )}
        </div>
      )}

      {/* Modals */}

      {/* Create Plan Success Modal */}
      {showCreatePlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-900 to-black rounded-xl p-6 max-w-md w-full mx-4 border border-purple-500 border-opacity-30">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Plan Created Successfully!</h3>
              <p className="text-purple-300 text-sm mb-6">
                Your spending plan has been created and is ready for review
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowCreatePlanModal(false);
                    setActiveView('plans');
                  }}
                  className="flex-1 outline-button"
                >
                  View Plans
                </button>
                <button
                  onClick={() => setShowCreatePlanModal(false)}
                  className="flex-1 gradient-button"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Optimization Modal */}
      {showAIOptimizationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-900 to-black rounded-xl p-6 max-w-lg w-full mx-4 border border-purple-500 border-opacity-30">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Optimization Complete!</h3>
              <p className="text-purple-300 text-sm mb-6">
                The AI has analyzed your requirements and created an optimized spending plan
              </p>
              <div className="bg-purple-900 bg-opacity-20 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Optimization Highlights</span>
                </div>
                <ul className="text-purple-300 text-sm space-y-1">
                  <li>• Balanced allocation across priority categories</li>
                  <li>• Risk-adjusted reserve allocation</li>
                  <li>• Operational efficiency optimization</li>
                </ul>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAIOptimizationModal(false);
                    setActiveView('chat');
                  }}
                  className="flex-1 outline-button"
                >
                  View in Chat
                </button>
                <button
                  onClick={() => setShowAIOptimizationModal(false)}
                  className="flex-1 gradient-button"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Execute Plan Modal */}
      {showExecutePlanModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-900 to-black rounded-xl p-6 max-w-lg w-full mx-4 border border-purple-500 border-opacity-30">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Plan Executed Successfully!</h3>
              <p className="text-purple-300 text-sm mb-4">
                Your spending plan has been executed and all transactions have been processed
              </p>
              
              <div className="bg-purple-900 bg-opacity-20 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Execution Summary</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-300 text-sm">Total Amount:</span>
                    <span className="text-white font-medium">${selectedPlan.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300 text-sm">Transactions:</span>
                    <span className="text-white font-medium">{selectedPlan.allocations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-300 text-sm">Status:</span>
                    <span className="text-green-400 font-medium">Completed</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900 bg-opacity-20 rounded-lg p-4 mb-6 border border-yellow-500 border-opacity-30">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Transaction Details</span>
                </div>
                <p className="text-yellow-300 text-sm">
                  Check your wallet for transaction confirmations. All PyUSD transfers have been initiated.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowExecutePlanModal(false);
                    setSelectedPlanId(null);
                  }}
                  className="flex-1 outline-button"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowExecutePlanModal(false);
                    setSelectedPlanId(null);
                    setActiveView('plans');
                  }}
                  className="flex-1 gradient-button"
                >
                  View All Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Draft Saved Modal */}
      {showDraftSavedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-900 to-black rounded-xl p-6 max-w-md w-full mx-4 border border-purple-500 border-opacity-30">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Save className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Draft Saved!</h3>
              <p className="text-purple-300 text-sm mb-6">
                Your spending plan has been saved as a draft. You can review and approve it later.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDraftSavedModal(false)}
                  className="flex-1 outline-button"
                >
                  Continue Editing
                </button>
                <button
                  onClick={() => {
                    setShowDraftSavedModal(false);
                    setActiveView('plans');
                  }}
                  className="flex-1 gradient-button"
                >
                  Review Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Section */}
      {transactions.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <ExternalLink className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
          </div>
          
          <div className="card">
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-purple-900 bg-opacity-20 rounded-lg border border-purple-500 border-opacity-20">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium capitalize">{transaction.category}</span>
                        <span className="text-green-400 text-sm">• {transaction.status}</span>
                      </div>
                      <p className="text-purple-300 text-sm">{transaction.description}</p>
                      <p className="text-purple-400 text-xs">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-green-400 font-bold">${transaction.amount.toLocaleString()}</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-purple-400 text-xs">
                        {transaction.tx_hash.slice(0, 6)}...{transaction.tx_hash.slice(-4)}
                      </span>
                      <button className="text-purple-400 hover:text-purple-300">
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {transactions.length > 5 && (
              <div className="text-center mt-4">
                <button className="outline-button">
                  View All Transactions ({transactions.length})
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgentPage;