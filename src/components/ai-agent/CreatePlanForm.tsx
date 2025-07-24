import React from 'react';
import { Zap } from 'lucide-react';
import type { PlanFormState } from '../../AIAgentPage';

interface CreatePlanFormProps {
  planForm: PlanFormState;
  setPlanForm: (value: PlanFormState) => void;
  handleCreatePlan: () => void;
  isCreatingPlan: boolean;
}

const categories = ['equipment', 'utilities', 'wages', 'reserve', 'maintenance', 'taxes', 'insurance'];

const CreatePlanForm: React.FC<CreatePlanFormProps> = ({ planForm, setPlanForm, handleCreatePlan, isCreatingPlan }) => {
  return (
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
          {categories.map((category) => {
            const currentLevel = Object.entries(planForm.priorities).find(([_, cats]) => cats.includes(category))?.[0] || 'none';
            return (
              <div
                key={category}
                className="bg-gradient-to-br from-purple-800/30 to-purple-900/20 p-3 rounded-xl border border-purple-500/20 shadow-sm"
              >
                <label className="block text-sm font-medium text-white mb-1 capitalize">{category}</label>
                <select
                  value={currentLevel}
                  onChange={(e) => {
                    const newLevel = e.target.value;
                    const updated: Record<string, string[]> = { high: [], medium: [], low: [] };
                    Object.entries(planForm.priorities).forEach(([level, list]) => {
                      updated[level as 'high' | 'medium' | 'low'] = list.filter((cat) => cat !== category);
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
          <button onClick={handleCreatePlan} disabled={isCreatingPlan} className="gradient-button disabled:opacity-50">
            <Zap className="w-5 h-5 mr-2" />
            {isCreatingPlan ? 'Creating...' : 'Optimize with AI'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlanForm;