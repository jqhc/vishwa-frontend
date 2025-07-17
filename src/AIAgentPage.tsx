import React, { useState } from 'react';
import { Bot, User, Send, Plus, Eye, Play, CheckCircle, Clock, DollarSign, TrendingUp, Shield, Sparkles, RotateCcw, ExternalLink, Save, Zap, AlertCircle } from 'lucide-react';

interface SpendingPlan {
  id: string;
  name: string;
  amount: number;
  status: 'draft' | 'optimized' | 'approved' | 'executed';
  allocations: Array<{
    category: string;
    amount: number;
    percentage: number;
    description: string;
  }>;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const AIAgentPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'chat' | 'create' | 'plans'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'user',
      content: 'I need help optimizing my mining budget for Q4. I have $50,000 to allocate.',
      timestamp: '2025-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'ai',
      content: 'I can help you optimize your mining budget. Based on current market conditions, I recommend allocating 40% to equipment, 25% to utilities, 15% to wages, and 20% to reserves. Would you like me to create a detailed plan?',
      timestamp: '2025-01-15T10:30:30Z'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [planForm, setPlanForm] = useState({
    name: 'Q4 Mining Strategy',
    amount: 50000,
    priorities: {
      equipment: 'High',
      utilities: 'High',
      wages: 'Medium',
      reserve: 'Medium',
      maintenance: 'Medium',
      taxes: 'Low',
      insurance: 'Low'
    }
  });

  const [spendingPlans] = useState<SpendingPlan[]>([
    {
      id: '1',
      name: 'Q4 Mining Strategy',
      amount: 50000,
      status: 'optimized',
      allocations: [
        { category: 'equipment', amount: 20000, percentage: 40, description: 'New ASIC miners and cooling systems' },
        { category: 'utilities', amount: 12500, percentage: 25, description: 'Electricity and facility costs' },
        { category: 'wages', amount: 7500, percentage: 15, description: 'Team salaries and benefits' },
        { category: 'reserve', amount: 10000, percentage: 20, description: 'Emergency fund and market hedge' }
      ],
      createdAt: '2025-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Q3 Maintenance Plan',
      amount: 25000,
      status: 'executed',
      allocations: [
        { category: 'maintenance', amount: 15000, percentage: 60, description: 'Equipment servicing and repairs' },
        { category: 'reserve', amount: 10000, percentage: 40, description: 'Emergency buffer' }
      ],
      createdAt: '2025-01-10T09:15:00Z'
    }
  ]);

  // Modal states
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showAIOptimizationModal, setShowAIOptimizationModal] = useState(false);
  const [showExecutePlanModal, setShowExecutePlanModal] = useState(false);
  const [showDraftSavedModal, setShowDraftSavedModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const optimizedPlan = spendingPlans.find(p => p.status === 'optimized');
  const selectedPlan = selectedPlanId ? spendingPlans.find(p => p.id === selectedPlanId) : null;

  const handleSendMessage = () => {
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
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand your request. Let me analyze your requirements and create an optimized spending plan based on current market conditions and your priorities.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleCreatePlan = () => {
    setShowCreatePlanModal(true);
  };

  const handleGetAIOptimization = () => {
    setShowAIOptimizationModal(true);
  };

  const handleExecutePlan = (planId: string) => {
    setSelectedPlanId(planId);
    setShowExecutePlanModal(true);
  };

  const handleSaveDraft = () => {
    setShowDraftSavedModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-400';
      case 'optimized': return 'text-green-400';
      case 'approved': return 'text-blue-400';
      case 'executed': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'optimized': return <CheckCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'executed': return <Play className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

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
      </div>

      {/* View Toggle */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveView('chat')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeView === 'chat' ? 'bg-purple-600 text-white' : 'bg-purple-900 bg-opacity-30 text-purple-300 hover:bg-purple-600 bg-opacity-50'
          }`}
        >
          <Bot className="w-5 h-5 mr-2 inline" />
          Chat with AI
        </button>
        <button
          onClick={() => setActiveView('create')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeView === 'create' ? 'bg-purple-600 text-white' : 'bg-purple-900 bg-opacity-30 text-purple-300 hover:bg-purple-600 bg-opacity-50'
          }`}
        >
          <Plus className="w-5 h-5 mr-2 inline" />
          Create New Plan
        </button>
        <button
          onClick={() => setActiveView('plans')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeView === 'plans' ? 'bg-purple-600 text-white' : 'bg-purple-900 bg-opacity-30 text-purple-300 hover:bg-purple-600 bg-opacity-50'
          }`}
        >
          <Eye className="w-5 h-5 mr-2 inline" />
          Existing Plans
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
              {isLoading && (
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
              />
              <button
                onClick={handleSendMessage}
                className="gradient-button px-4"
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
                      <span className="text-yellow-300 font-medium text-sm">ROI</span>
                    </div>
                    <p className="text-2xl font-bold text-white">15.2%</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-xl p-4 border border-blue-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-300 font-medium text-sm">Risk</span>
                    </div>
                    <p className="text-2xl font-bold text-white">Low</p>
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
                        <p className="text-purple-300 text-sm">{allocation.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleExecutePlan(optimizedPlan.id)}
                    className="flex-1 gradient-button"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Execute Strategy
                  </button>
                  <button className="outline-button">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Re-calculate
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white font-medium mb-2">Monthly Budget</label>
                <input
                  type="number"
                  value={planForm.amount}
                  onChange={(e) => setPlanForm({...planForm, amount: Number(e.target.value)})}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Plan Name</label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({...planForm, name: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {Object.entries(planForm.priorities).map(([category, priority]) => (
                <div key={category}>
                  <label className="block text-white font-medium mb-2 capitalize">{category} Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPlanForm({
                      ...planForm,
                      priorities: {...planForm.priorities, [category]: e.target.value}
                    })}
                    className="select-field w-full"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleGetAIOptimization}
                className="outline-button"
              >
                <Zap className="w-5 h-5 mr-2" />
                Get AI Optimization
              </button>
              <button
                onClick={handleSaveDraft}
                className="outline-button"
              >
                <Save className="w-5 h-5 mr-2" />
                Save as Draft
              </button>
              <button
                onClick={handleCreatePlan}
                className="gradient-button"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Plans View */}
      {activeView === 'plans' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Existing Plans</h3>
            <button
              onClick={() => setActiveView('create')}
              className="gradient-button"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Plan
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spendingPlans.map((plan) => (
              <div key={plan.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{plan.name}</h4>
                    <p className="text-purple-300 text-sm">${plan.amount.toLocaleString()} budget</p>
                  </div>
                  <div className={`flex items-center space-x-2 ${getStatusColor(plan.status)}`}>
                    {getStatusIcon(plan.status)}
                    <span className="capitalize text-sm">{plan.status}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {plan.allocations.slice(0, 3).map((allocation, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-purple-300 capitalize">{allocation.category}</span>
                      <span className="text-white">${allocation.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  {plan.allocations.length > 3 && (
                    <div className="text-purple-300 text-sm">+{plan.allocations.length - 3} more...</div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 outline-button">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                  {plan.status === 'optimized' && (
                    <button
                      onClick={() => handleExecutePlan(plan.id)}
                      className="flex-1 gradient-button"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Execute
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Plan Success Modal */}
      {showCreatePlanModal && (
        <div className="modal-backdrop">
          <div className="modal-content max-w-md text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">Plan Created Successfully!</h3>
            <p className="text-purple-300 mb-6">
              Your spending plan <span className="font-medium text-white">{planForm.name}</span> has been created.
            </p>

            <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Budget</span>
                <span className="text-green-400 font-semibold">${planForm.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Status</span>
                <span className="text-white">Draft</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Created</span>
                <span className="text-white">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowCreatePlanModal(false);
                  setActiveView('plans');
                }}
                className="flex-1 outline-button"
              >
                <Eye className="w-5 h-5 mr-2" />
                View All Plans
              </button>
              <button
                onClick={() => setShowCreatePlanModal(false)}
                className="flex-1 gradient-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Optimization Modal */}
      {showAIOptimizationModal && (
        <div className="modal-backdrop">
          <div className="modal-content max-w-md text-center">
            <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">AI Optimization Started</h3>
            <p className="text-purple-300 mb-6">
              Our AI is analyzing market conditions and optimizing your spending plan for maximum efficiency.
            </p>

            <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Plan</span>
                <span className="text-white font-semibold">{planForm.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Budget</span>
                <span className="text-green-400">${planForm.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Estimated Time</span>
                <span className="text-yellow-400">~2 minutes</span>
              </div>
            </div>

            <button
              onClick={() => setShowAIOptimizationModal(false)}
              className="w-full gradient-button"
            >
              <Zap className="w-5 h-5 mr-2" />
              View Results
            </button>
          </div>
        </div>
      )}

      {/* Execute Plan Modal */}
      {showExecutePlanModal && selectedPlan && (
        <div className="modal-backdrop">
          <div className="modal-content max-w-md text-center">
            <Play className="w-16 h-16 text-green-400 mx-auto mb-4 p-2 bg-green-400 bg-opacity-20 rounded-full" />
            <h3 className="text-2xl font-semibold text-white mb-2">Strategy Executed!</h3>
            <p className="text-purple-300 mb-6">
              Your strategy <span className="font-medium text-white">{selectedPlan.name}</span> has been executed successfully.
            </p>

            <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Budget</span>
                <span className="text-green-400 font-semibold">${selectedPlan.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Status</span>
                <span className="text-green-400">Executed</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Execution Date</span>
                <span className="text-white">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowExecutePlanModal(false);
                  setSelectedPlanId(null);
                }}
                className="flex-1 outline-button"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Details
              </button>
              <button
                onClick={() => {
                  setShowExecutePlanModal(false);
                  setSelectedPlanId(null);
                }}
                className="flex-1 gradient-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draft Saved Modal */}
      {showDraftSavedModal && (
        <div className="modal-backdrop">
          <div className="modal-content max-w-md text-center">
            <Save className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">Draft Saved</h3>
            <p className="text-purple-300 mb-6">
              Your draft for <span className="font-medium text-white">{planForm.name}</span> has been saved successfully.
            </p>

            <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Budget</span>
                <span className="text-blue-400 font-semibold">${planForm.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Status</span>
                <span className="text-white">Draft</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Saved</span>
                <span className="text-white">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowDraftSavedModal(false);
                  setActiveView('plans');
                }}
                className="flex-1 outline-button"
              >
                <Eye className="w-5 h-5 mr-2" />
                View All Plans
              </button>
              <button
                onClick={() => setShowDraftSavedModal(false)}
                className="flex-1 gradient-button"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgentPage;
