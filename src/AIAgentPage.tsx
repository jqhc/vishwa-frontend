import React, { useState, useEffect } from 'react';
import { Bot, User, Send, Plus, Eye, Play, CheckCircle, Clock, DollarSign, TrendingUp, Shield, Sparkles, RotateCcw, ExternalLink, Save, Zap, AlertCircle } from 'lucide-react';
import { createSpendingPlan, approveSpendingPlan, executeSpendingPlan, getSpendingPlans, getTransactions, getConnectedWallet, connectWallet } from './APIService';
import KitePassDialog from "./components/ui/KitePassDialog";
import KiteLogo from "./assets/KiteLogo.png";
import ChatSection from './components/ai-agent/ChatSection';
import CreatePlanForm from './components/ai-agent/CreatePlanForm';
import PlansList from './components/ai-agent/PlansList';
import { CreatePlanSuccessModal, AIOptimizationModal, ExecutePlanModal, DraftSavedModal } from './components/ai-agent/Modals';

// Updated interfaces to match backend
export interface SpendingPlan {
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
    chain?: string
  }>;
  total_allocated: number;
  explanation: string;
  priorities: Record<string, string[]>;
  constraints: Record<string, any>;
  approved_at?: string;
  execution_date?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface Transaction {
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

export interface PlanFormState {
  name: string;
  amount: number;
  priorities: Record<string, string[]>;
  description: string;
  constraints: Record<string, any>;
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
  
  const [planForm, setPlanForm] = useState<PlanFormState>({
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
          { category: 'equipment', amount: 5000, description: 'Procurement of new mining rigs and hardware upgrades.', chain: "SUI" },
          { category: 'utilities', amount: 2000, description: 'Electricity and cooling costs for 24/7 operation.', chain: "BSC" },
          { category: 'wages', amount: 2000, description: 'Monthly salaries for on-site staff and technicians.', chain: "Base" },
          { category: 'reserve', amount: 1000, description: 'Contingency fund for unexpected expenses.', chain: "Self-custody" }
        ],
        total_allocated: 10000,
        explanation: 'AI-optimized allocation for Q2 2024: Prioritizes equipment upgrades to maximize hash rate, ensures operational stability with dedicated utility and wage budgets, and maintains a reserve for risk mitigation.',
        priorities: { high: ['equipment'], medium: ['utilities'], low: ['reserve', 'wages'] },
        constraints: {},
        approved_at: undefined,
        execution_date: undefined,
      });

      plansToSet.push({
        id: 'plan-q3-2025',
        name: 'Q2 Mining Operations',
        amount: 100000,
        status: 'draft' as const,
        created_at: new Date().toISOString(),
        allocations: [
          { category: 'utilities', amount: 25000, description: 'Electricity and cooling costs for 24/7 operation.', chain: "SUI" },
          { category: 'maintenance', amount: 15000, description: 'Allocate funds for equipment maintenance and repairs.', chain: 'SUI' },
          { category: 'equipment', amount: 20000, description: 'Procurement of new mining rigs and hardware upgrades.', chain: "BSC" },
          { category: 'wages', amount: 20000, description: 'Monthly salaries for on-site staff and technicians.', chain: "Base" },
          { category: 'insurance', amount: 5000, description: 'Pay insurance premiums to protect assets and operations.', chain: "Avalanche" },
          { category: 'insurance', amount: 5000, description: 'Set aside funds for tax payments and provisions.', chain: "Avalanche" },
          { category: 'reserve', amount: 10000, description: 'Contingency fund for unexpected expenses.', chain: "Self-custody" }
        ],
        total_allocated: 100000,
        explanation: 'AI-optimized allocation for Q3 2025: Prioritize covering essential operational costs such as maintenance, utility, and wages. Investments in new equipment are made to enhance hash rate. Insurance and taxes are covered to ensure compliance and protection. Remaining funds are allocated to and emergency reserves for risk mitigation.',
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
          { category: 'equipment', amount: 5000, description: 'Procurement of new mining rigs and hardware upgrades.', chain: "SUI" },
          { category: 'utilities', amount: 2000, description: 'Electricity and cooling costs for 24/7 operation.', chain: "BSC" },
          { category: 'wages', amount: 2000, description: 'Monthly salaries for on-site staff and technicians.', chain: "Base" },
          { category: 'reserve', amount: 1000, description: 'Contingency fund for unexpected expenses.', chain: "Self-custody" }
        ],
        total_allocated: 10000,
        explanation: 'AI-optimized allocation for Q2 2024: Prioritizes equipment upgrades to maximize hash rate, ensures operational stability with dedicated utility and wage budgets, and maintains a reserve for risk mitigation.',
        priorities: { high: ['equipment'], medium: ['utilities'], low: ['reserve', 'wages'] },
        constraints: {},
        approved_at: undefined,
        execution_date: undefined,
      };
      setSpendingPlans([examplePlan]);
      // setSpendingPlans([]);
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
  const selectedPlan = selectedPlanId ? (spendingPlans.find(p => p.id === selectedPlanId) ?? null) : null;

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
        <ChatSection
          messages={messages}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          isCreatingPlan={isCreatingPlan}
          optimizedPlan={optimizedPlan}
          isExecutingPlan={isExecutingPlan}
          handleExecutePlan={handleExecutePlan}
          loadInitialData={loadInitialData}
        />
      )}

      {/* Create New Plan View */}
      {activeView === 'create' && (
        <CreatePlanForm
          planForm={planForm}
          setPlanForm={setPlanForm}
          handleCreatePlan={handleCreatePlan}
          isCreatingPlan={isCreatingPlan}
        />
      )}


      {/* Existing Plans View */}
      {activeView === 'plans' && (
        <PlansList
          plans={spendingPlans}
          expandedPlans={expandedPlans}
          onToggleExpand={(id) => setExpandedPlans(prev => ({ ...prev, [id]: !prev[id] }))}
          onApprove={handleApprovePlan}
          onExecute={handleExecutePlan}
          isExecuting={isExecutingPlan}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          onCreateNew={() => setActiveView('create')}
        />
      )}

      <CreatePlanSuccessModal
        open={showCreatePlanModal}
        onClose={() => setShowCreatePlanModal(false)}
        onViewPlans={() => {
          setShowCreatePlanModal(false);
          setActiveView('plans');
        }}
      />

      <AIOptimizationModal
        open={showAIOptimizationModal}
        onClose={() => setShowAIOptimizationModal(false)}
        onViewChat={() => {
          setShowAIOptimizationModal(false);
          setActiveView('chat');
        }}
      />

      <ExecutePlanModal
        open={showExecutePlanModal}
        plan={selectedPlan}
        onClose={() => {
          setShowExecutePlanModal(false);
          setSelectedPlanId(null);
        }}
        onViewAllPlans={() => {
          setShowExecutePlanModal(false);
          setSelectedPlanId(null);
          setActiveView('plans');
        }}
      />

      <DraftSavedModal
        open={showDraftSavedModal}
        onClose={() => setShowDraftSavedModal(false)}
        onReview={() => {
          setShowDraftSavedModal(false);
          setActiveView('plans');
        }}
      />

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