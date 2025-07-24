import React from 'react';
import { CheckCircle, Play } from 'lucide-react';
import KitePassDialog from '../ui/KitePassDialog';
import KiteLogo from '../../assets/KiteLogo.png';
import type { SpendingPlan } from '../../AIAgentPage';

interface PlanCardProps {
  plan: SpendingPlan;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onApprove: () => void;
  onExecute: () => void;
  isExecuting: boolean;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactElement;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isExpanded,
  onToggleExpand,
  onApprove,
  onExecute,
  isExecuting,
  getStatusColor,
  getStatusIcon,
}) => {
  const allocationsToShow = isExpanded ? plan.allocations : plan.allocations.slice(0, 4);
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`${getStatusColor(plan.status)}`}>{getStatusIcon(plan.status)}</div>
          <div>
            <h4 className="text-white font-semibold">{plan.name}</h4>
            <p className="text-purple-300 text-sm">Created {new Date(plan.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-green-400 font-bold text-lg">${plan.amount.toLocaleString()}</span>
          <p className={`text-xs capitalize ${getStatusColor(plan.status)}`}>{plan.status}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <h5 className="text-white font-medium">Allocations</h5>
        <div className="grid grid-cols-2 gap-2">
          {allocationsToShow.map((allocation, index) => (
            <div key={index} className="bg-purple-900 bg-opacity-20 rounded-lg p-2">
              <div className="flex justify-between items-center">
                <span className="text-purple-300 text-sm capitalize">{allocation.category}</span>
                <span className="text-white font-medium text-sm">${allocation.amount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-purple-900 bg-opacity-30 rounded-full h-1 mt-1">
                <div className="bg-gradient-to-r from-purple-500 to-violet-600 h-1 rounded-full" style={{ width: `${(allocation.amount / plan.amount) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        {plan.allocations.length > 4 && (
          <button onClick={onToggleExpand} className="text-purple-300 text-sm mt-2 hover:underline">
            {isExpanded ? 'Show Less' : `+${plan.allocations.length - 4} more allocations`}
          </button>
        )}
      </div>

      <div className="bg-purple-900 bg-opacity-20 rounded-lg p-3 mb-4">
        <p className="text-purple-300 text-sm">
          {plan.explanation.length > 100 ? `${plan.explanation.substring(0, 100)}...` : plan.explanation}
        </p>
      </div>

      <div className="flex space-x-2">
        {plan.status === 'draft' && (
          <button onClick={onApprove} className="flex-1 bg-blue-600 bg-opacity-20 border border-blue-500 border-opacity-30 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-600 hover:bg-opacity-30 transition-colors text-sm">
            <CheckCircle className="w-4 h-4 mr-2 inline" />
            Approve
          </button>
        )}
        {(plan.status === 'approved' || plan.status === 'draft') && (
          <button onClick={onExecute} disabled={isExecuting} className="flex-1 gradient-button text-sm disabled:opacity-50">
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
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'tx-2',
              amount: 2500,
              description: 'Mining Equipment',
              status: 'completed',
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'tx-3',
              amount: 462.67,
              description: 'Electricity Bill',
              status: 'completed',
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
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
  );
};

export default PlanCard;