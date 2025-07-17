import React from 'react';
import { Users, Shield } from 'lucide-react';

const BorrowersPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Active Borrowers</h2>
        <p className="text-purple-300 text-lg max-w-2xl mx-auto">
          Browse borrower requests seeking USDC/USDT liquidity with crypto collateral
        </p>
      </div>
      
      <div className="card text-center py-20">
        <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
        <p className="text-purple-300">
          Borrower marketplace is under development
        </p>
      </div>
    </div>
  );
};

export default BorrowersPage;
