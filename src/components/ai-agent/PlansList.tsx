import React from 'react';
import { Plus } from 'lucide-react';
import type { SpendingPlan } from '../../AIAgentPage';
import PlanCard from './PlanCard';

interface PlansListProps {
  plans: SpendingPlan[];
  expandedPlans: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  onApprove: (id: string) => void;
  onExecute: (id: string) => void;
  isExecuting: boolean;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactElement;
  onCreateNew: () => void;
}

const PlansList: React.FC<PlansListProps> = ({
  plans,
  expandedPlans,
  onToggleExpand,
  onApprove,
  onExecute,
  isExecuting,
  getStatusColor,
  getStatusIcon,
  onCreateNew,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Existing Plans ({plans.length})</h3>
        <button onClick={onCreateNew} className="gradient-button">
          <Plus className="w-5 h-5 mr-2" />
          Create New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="card text-center">
          <div className="w-16 h-16 bg-purple-900 bg-opacity-30 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <Plus className="w-8 h-8 text-purple-400" />
          </div>
          <h4 className="text-white font-semibold mb-2">No Plans Yet</h4>
          <p className="text-purple-300 text-sm mb-4">Create your first spending plan to get started</p>
          <button onClick={onCreateNew} className="gradient-button">
            <Plus className="w-5 h-5 mr-2" />
            Create First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.slice().reverse().map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isExpanded={!!expandedPlans[plan.id]}
              onToggleExpand={() => onToggleExpand(plan.id)}
              onApprove={() => onApprove(plan.id)}
              onExecute={() => onExecute(plan.id)}
              isExecuting={isExecuting}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlansList;