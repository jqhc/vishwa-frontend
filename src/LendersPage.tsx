import React from 'react';
import { DollarSign, Shield } from 'lucide-react';

const LendersPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Verified Lenders</h2>
        <p className="text-purple-300 text-lg max-w-2xl mx-auto">
          Deposit USDC/USDT into yield-generating pools with crypto-backed security
        </p>
      </div>
      
      <div className="card text-center py-20">
        <DollarSign className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
        <p className="text-purple-300">
          Verified lenders section is under development
        </p>
      </div>
    </div>
  );
};

export default LendersPage;
