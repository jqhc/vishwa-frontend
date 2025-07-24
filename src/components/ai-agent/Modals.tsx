import React from 'react';
import { CheckCircle, Sparkles, Zap, DollarSign, AlertCircle, Save } from 'lucide-react';
import type { SpendingPlan } from '../../AIAgentPage';

export interface CreatePlanSuccessModalProps {
  open: boolean;
  onClose: () => void;
  onViewPlans: () => void;
}

export const CreatePlanSuccessModal: React.FC<CreatePlanSuccessModalProps> = ({ open, onClose, onViewPlans }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-900 to-black rounded-xl p-6 max-w-md w-full mx-4 border border-purple-500 border-opacity-30">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Plan Created Successfully!</h3>
          <p className="text-purple-300 text-sm mb-6">Your spending plan has been created and is ready for review</p>
          <div className="flex space-x-3">
            <button onClick={onViewPlans} className="flex-1 outline-button">View Plans</button>
            <button onClick={onClose} className="flex-1 gradient-button">Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface AIOptimizationModalProps {
  open: boolean;
  onClose: () => void;
  onViewChat: () => void;
}

export const AIOptimizationModal: React.FC<AIOptimizationModalProps> = ({ open, onClose, onViewChat }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-900 to-black rounded-xl p-6 max-w-lg w-full mx-4 border border-purple-500 border-opacity-30">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">AI Optimization Complete!</h3>
          <p className="text-purple-300 text-sm mb-6">The AI has analyzed your requirements and created an optimized spending plan</p>
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
            <button onClick={onViewChat} className="flex-1 outline-button">View in Chat</button>
            <button onClick={onClose} className="flex-1 gradient-button">Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface ExecutePlanModalProps {
  open: boolean;
  plan: SpendingPlan | null;
  onClose: () => void;
  onViewAllPlans: () => void;
}

export const ExecutePlanModal: React.FC<ExecutePlanModalProps> = ({ open, plan, onClose, onViewAllPlans }) => {
  if (!open || !plan) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-900 to-black rounded-xl p-6 max-w-lg w-full mx-4 border border-purple-500 border-opacity-30">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Plan Executed Successfully!</h3>
          <p className="text-purple-300 text-sm mb-4">Your spending plan has been executed and all transactions have been processed</p>

          <div className="bg-purple-900 bg-opacity-20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Execution Summary</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-purple-300 text-sm">Total Amount:</span>
                <span className="text-white font-medium">${plan.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300 text-sm">Transactions:</span>
                <span className="text-white font-medium">{plan.allocations.length}</span>
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
            <p className="text-yellow-300 text-sm">Check your wallet for transaction confirmations. All PyUSD transfers have been initiated.</p>
          </div>

          <div className="flex space-x-3">
            <button onClick={onClose} className="flex-1 outline-button">Close</button>
            <button onClick={onViewAllPlans} className="flex-1 gradient-button">View All Plans</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface DraftSavedModalProps {
  open: boolean;
  onClose: () => void;
  onReview: () => void;
}

export const DraftSavedModal: React.FC<DraftSavedModalProps> = ({ open, onClose, onReview }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-900 to-black rounded-xl p-6 max-w-md w-full mx-4 border border-purple-500 border-opacity-30">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Save className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Draft Saved!</h3>
          <p className="text-purple-300 text-sm mb-6">Your spending plan has been saved as a draft. You can review and approve it later.</p>
          <div className="flex space-x-3">
            <button onClick={onClose} className="flex-1 outline-button">Continue Editing</button>
            <button onClick={onReview} className="flex-1 gradient-button">Review Draft</button>
          </div>
        </div>
      </div>
    </div>
  );
};