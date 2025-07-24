import React from 'react';
import { Bot, User, Send, CheckCircle, Play, RotateCcw, Shield, DollarSign } from 'lucide-react';
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
                  <DollarSign className="w-5 h-5 text-yellow-400" />
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
                <div
                  key={index}
                  className={`flex justify-between items-start p-3 rounded-lg border ${
                    allocation.chain === 'Self-custody'
                      ? 'bg-green-900/30 border-green-500/30'
                      : 'bg-purple-700 bg-opacity-30 border-purple-500 border-opacity-20'
                  }`}
                >
                  {/* Left: Category + Description */}
                  <div className="flex flex-col">
                    <span className="text-white font-medium capitalize">{allocation.category}</span>
                    <p className={`${allocation.chain === 'Self-custody' ? 'text-green-300/80 text-sm' : 'text-purple-200 text-sm'}`}>{allocation.description}</p>
                  </div>

                  {/* Right: Amount + Chain */}
                  <div className="flex flex-col items-end">
                    <span className="text-white font-medium">${allocation.amount.toLocaleString()}</span>
                    {allocation.chain && (
                      <span
                        className={`mt-1 px-2 py-0.5 text-xs rounded-full ${
                          allocation.chain === 'Self-custody' ? 'bg-green-800/50 text-green-200' : 'bg-purple-800 text-purple-200'
                        }`}
                      >
                        {allocation.chain === 'Self-custody' ? 'Self-Custody' : `USDC on ${allocation.chain}`}
                      </span>
                    )}
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
                <button onClick={() => handleExecutePlan(optimizedPlan.id)} disabled={isExecutingPlan} className="flex-1 gradient-button disabled:opacity-50">
                  <Play className="w-5 h-5 mr-2" />
                  {isExecutingPlan ? 'Executing...' : 'Execute Strategy'}
                </button>
              )}
              <button onClick={loadInitialData} className="outline-button">
                <RotateCcw className="w-5 h-5 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSection;