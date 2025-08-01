import React from 'react';
import { Bot, User, Send, CheckCircle, Play, RotateCcw, Shield, DollarSign, Info, ArrowRight } from 'lucide-react';
import type { SpendingPlan, ChatMessage } from '../../AIAgentPage';

interface ChatSectionProps {
  messages: ChatMessage[];
  currentMessage: string;
  setCurrentMessage: (value: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  isCreatingPlan: boolean;
  optimizedPlan?: SpendingPlan;
  isExecutingPlan: boolean;
  handleExecutePlan: (id: string) => void;
  loadInitialData: () => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  messages,
  currentMessage,
  setCurrentMessage,
  handleSendMessage,
  isLoading,
  isCreatingPlan,
  optimizedPlan,
  isExecutingPlan,
  handleExecutePlan,
  loadInitialData,
}) => {
  // Helper function to generate strategy summary from allocations
  const generateStrategySummary = (plan: SpendingPlan) => {
    const chainAllocations: Record<string, {total: number, categories: string[]}> = {};
    
    // Group allocations by chain
    plan.allocations.forEach(allocation => {
      const chain = allocation.chain || 'Unknown';
      if (!chainAllocations[chain]) {
        chainAllocations[chain] = {total: 0, categories: []};
      }
      chainAllocations[chain].total += allocation.amount;
      if (!chainAllocations[chain].categories.includes(allocation.category)) {
        chainAllocations[chain].categories.push(allocation.category);
      }
    });
    
    // Generate summary points
    return Object.entries(chainAllocations).map(([chain, data], index) => {
      const formattedAmount = (data.total / 1000).toFixed(1) + 'K';
      const categories = data.categories.join(', ');
      return {
        key: index,
        text: `${formattedAmount} USDC allocation on ${chain === 'Self-custody' ? 'self-custodial' : chain} for ${categories}`
      };
    });
  };
  
  // Helper to calculate interest rate based on allocations
  const calculateInterestRate = (plan: SpendingPlan) => {
    // Count how many different chains are used
    const uniqueChains = new Set(plan.allocations.map(a => a.chain));
    const chainCount = uniqueChains.size;
    
    // Base rate plus bonus for diversification
    const baseRate = 5.5;
    const diversificationBonus = chainCount * 0.5;
    
    // Higher rate for larger allocations
    const sizeBonus = plan.amount > 50000 ? 0.5 : 0;
    
    return (baseRate + diversificationBonus + sizeBonus).toFixed(1);
  };
  
  // Helper to determine risk level
  const determineRiskLevel = (plan: SpendingPlan) => {
    const selfCustodyAllocation = plan.allocations
      .filter(a => a.chain === 'Self-custody' || a.category === "reserve")
      .reduce((sum, a) => sum + a.amount, 0);
    
    const selfCustodyPercentage = (selfCustodyAllocation / plan.total_allocated) * 100;
    
    if (selfCustodyPercentage > 50) {
      return { level: 'Low', description: 'Majority self-custodial' };
    } else if (selfCustodyPercentage > 20) {
      return { level: 'Managed', description: 'Balanced custody approach' };
    } else {
      return { level: 'Moderate', description: 'Protocol-focused strategy' };
    }
  };

  return (
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
          <textarea
            rows={1}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask about spending optimization..."
            className="flex-1 input-field resize-none overflow-auto max-h-40 min-h-[40px] py-2 px-3 rounded-lg bg-purple-950 text-white border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm leading-relaxed"
            style={{ lineHeight: '1.5rem' }}
          />
          <button onClick={handleSendMessage} disabled={isLoading || isCreatingPlan} className="gradient-button px-4 disabled:opacity-50">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* AI Spending Plan Results */}
      <div className="card">
        {!optimizedPlan && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">AI Spending Plan Results</h3>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-purple-900 bg-opacity-30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Bot className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-purple-300 text-sm">
                Share your budget and priorities to get AI-powered spending recommendations
              </p>
            </div>
          </>
        )}

        {optimizedPlan && (
          <div className="space-y-6">
            {/* Header with checkmark */}
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium text-xl">Optimal Strategy Found</span>
            </div>

            {/* Strategy summary */}
            <div className="space-y-2 bg-purple-900/30 p-4 rounded-lg">
              <h4 className="text-white font-medium">Strategy:</h4>
              {generateStrategySummary(optimizedPlan).map(strategy => (
                <div key={strategy.key} className="flex items-start space-x-2 text-sm text-purple-200">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{strategy.text}</span>
                </div>
              ))}
            </div>

            {/* Key metrics cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-xl p-4 border border-green-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium text-sm">Result</span>
                </div>
                <p className="text-xl font-bold text-white">{optimizedPlan.total_allocated.toLocaleString()}</p>
                <p className="text-sm text-green-200">USDC</p>
                <p className="text-xs text-green-300 mt-1">
                  {optimizedPlan.total_allocated >= optimizedPlan.amount 
                    ? 'Full funding achieved' 
                    : `${((optimizedPlan.total_allocated / optimizedPlan.amount) * 100).toFixed(0)}% of target`}
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 rounded-xl p-4 border border-yellow-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-300 font-medium text-sm">Interest</span>
                </div>
                <p className="text-xl font-bold text-white">{calculateInterestRate(optimizedPlan)}%</p>
                <p className="text-xs text-yellow-300 mt-1">
                  {parseFloat(calculateInterestRate(optimizedPlan)) > 6.5 
                    ? 'Competitive rate' 
                    : 'Standard rate'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-xl p-4 border border-blue-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-medium text-sm">Risk</span>
                </div>
                <p className="text-xl font-bold text-white">{determineRiskLevel(optimizedPlan).level}</p>
                <p className="text-xs text-blue-300 mt-1">{determineRiskLevel(optimizedPlan).description}</p>
              </div>
            </div>

            {/* Allocation breakdown */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Allocation Breakdown</h4>
              {optimizedPlan.allocations.map((allocation, idx) => {
                const isSelf = allocation.chain === 'Self-custody' || allocation.category === "reserve";
                return (
                  <div
                    key={idx}
                    className={`rounded-lg p-4 border ${
                      isSelf
                        ? 'bg-green-900/30 border-green-500/30'
                        : 'bg-purple-800/30 border-purple-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-white font-medium capitalize">
                        {allocation.category}
                      </span>
                      <span className="text-green-300 font-bold">
                        {allocation.amount.toLocaleString()} USDC
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className={`${isSelf ? 'text-green-200' : 'text-purple-200'}`}>
                        {allocation.description}
                      </span>
                      {allocation.chain && (
                        <span
                          className={`text-xs ${
                            isSelf ? 'text-green-300' : 'text-purple-300'
                          }`}
                        >
                          {isSelf ? 'Self-custody' : `on ${allocation.chain}`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Explanation */}
            {optimizedPlan.explanation && (
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-white font-semibold mb-1">AI Explanation</h4>
                <p className="text-purple-300 text-sm">{optimizedPlan.explanation}</p>
              </div>
            )}

            {/* Collateral summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-sm text-purple-300 mb-2">Collateral Used</h4>
                <p className="text-xl font-bold text-white">
                  {optimizedPlan.total_allocated.toLocaleString()} USDC
                </p>
                <p className="text-xs text-purple-300 mt-1">
                  {((optimizedPlan.total_allocated / optimizedPlan.amount) * 100).toFixed(2)}% of budget
                </p>
              </div>
              
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                <h4 className="text-sm text-purple-300 mb-2">Collateral Remaining</h4>
                <p className="text-xl font-bold text-white">
                  {(optimizedPlan.amount - optimizedPlan.total_allocated).toLocaleString()} USDC
                </p>
                <p className="text-xs text-purple-300 mt-1">
                  {(((optimizedPlan.amount - optimizedPlan.total_allocated) / optimizedPlan.amount) * 100).toFixed(2)}% available
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button 
                onClick={() => handleExecutePlan(optimizedPlan.id)} 
                disabled={isExecutingPlan || optimizedPlan.status === 'executed'} 
                className="flex-1 gradient-button disabled:opacity-50"
              >
                <Play className="w-5 h-5 mr-2" />
                {isExecutingPlan ? 'Executing...' : 'Execute Strategy'}
              </button>
              
              <button onClick={loadInitialData} className="outline-button">
                <RotateCcw className="w-5 h-5 mr-2" />
                Re-calculate
              </button>

              <button className="outline-button">
                <Info className="w-5 h-5" />
                <span className="sr-only">Details</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSection;
