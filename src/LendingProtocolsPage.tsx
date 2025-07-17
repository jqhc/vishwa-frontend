import React, { useState } from 'react';
import {
  Search,
  Filter,
  Star,
  TrendingUp,
  Shield,
  DollarSign,
  PieChart,
  Activity,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

interface LendingProtocol {
  id: number;
  name: string;
  category: string;
  poolSize: string;
  allocationRemaining: string;
  rating: number;
  apy: string;
  liquidityType: string;
  minDeposit: string;
  collateralType: string;
  collateralRatio: string;
  duration: string;
  description: string;
  verified: boolean;
  trending: boolean;
}

const LendingProtocolsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<LendingProtocol | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const lendingProtocols: LendingProtocol[] = [
    {
      id: 1,
      name: 'BTC Collateral Pool',
      category: 'Bitcoin Backed',
      poolSize: '$12.4M',
      allocationRemaining: '$2.1M',
      rating: 4.8,
      apy: '12.5%',
      liquidityType: 'USDC',
      minDeposit: '$1,000',
      collateralType: 'Bitcoin (BTC)',
      collateralRatio: '150%',
      duration: '30-90 days',
      description: 'Deposit USDC, earn yield backed by Bitcoin collateral',
      verified: true,
      trending: true
    },
    {
      id: 2,
      name: 'ETH Secured Vault',
      category: 'Ethereum Backed',
      poolSize: '$8.7M',
      allocationRemaining: '$1.5M',
      rating: 4.9,
      apy: '10.2%',
      liquidityType: 'USDT',
      minDeposit: '$500',
      collateralType: 'Ethereum (ETH)',
      collateralRatio: '140%',
      duration: '14-60 days',
      description: 'Deposit USDT, secured by Ethereum collateral',
      verified: true,
      trending: false
    },
    {
      id: 3,
      name: 'Multi-Asset Vault',
      category: 'Diversified',
      poolSize: '$5.2M',
      allocationRemaining: '$890K',
      rating: 4.6,
      apy: '15.8%',
      liquidityType: 'USDC',
      minDeposit: '$2,000',
      collateralType: 'BTC + ETH + SOL',
      collateralRatio: '160%',
      duration: '7-180 days',
      description: 'Deposit USDC, backed by diversified crypto portfolio',
      verified: true,
      trending: true
    },
    {
      id: 4,
      name: 'Blue Chip Collateral',
      category: 'Premium Assets',
      poolSize: '$15.1M',
      allocationRemaining: '$3.2M',
      rating: 4.7,
      apy: '8.5%',
      liquidityType: 'USDC/USDT',
      minDeposit: '$10,000',
      collateralType: 'BTC + ETH Only',
      collateralRatio: '200%',
      duration: '1-365 days',
      description: 'Premium pool accepting USDC/USDT, ultra-safe BTC+ETH backing',
      verified: true,
      trending: false
    }
  ];

  const categories = ['all', 'Bitcoin Lending', 'Ethereum Lending', 'Multi-Chain', 'Stablecoin'];

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
      />
    ));
  };

  const handleDeposit = (protocol: LendingProtocol) => {
    setSelectedProtocol(protocol);
    setShowDepositModal(true);
  };

  const handleDepositConfirm = () => {
    // Close deposit flow & open success confirmation
    setShowDepositModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Lending Protocols</h2>
        <p className="text-purple-300 text-lg max-w-2xl mx-auto">
          Discover USDC/USDT deposit opportunities backed by crypto collateral
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-4 gap-8 mb-12">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm mb-1">Total Pool Size</p>
              <p className="text-3xl font-bold text-white">$41.4M</p>
              <p className="text-green-400 text-sm mt-1">+12.3% this month</p>
            </div>
            <PieChart className="w-10 h-10 text-purple-400" />
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm mb-1">Active Loans</p>
              <p className="text-3xl font-bold text-white">156</p>
              <p className="text-yellow-400 text-sm mt-1">23 pending</p>
            </div>
            <Activity className="w-10 h-10 text-purple-400" />
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm mb-1">Average APY</p>
              <p className="text-3xl font-bold text-white">13.1%</p>
              <p className="text-green-400 text-sm mt-1">Industry leading</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-400" />
          </div>
        </div>
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm mb-1">Success Rate</p>
              <p className="text-3xl font-bold text-white">96.8%</p>
              <p className="text-green-400 text-sm mt-1">Loan recovery</p>
            </div>
            <Shield className="w-10 h-10 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="flex items-center gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search lending protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select-field px-6 py-4"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-purple-900">
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <button className="px-6 py-4 bg-purple-600 bg-opacity-30 border border-purple-500 border-opacity-30 rounded-xl hover:bg-purple-600 bg-opacity-50 transition-colors text-white flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Advanced Filters</span>
          </button>
        </div>
      </div>

      {/* Lending Protocols Grid */}
      <div className="grid grid-cols-2 gap-8">
        {lendingProtocols.map(protocol => (
          <div key={protocol.id} className="card hover:border-purple-500 hover:border-opacity-30 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <span>{protocol.name}</span>
                    {protocol.verified && <Shield className="w-5 h-5 text-green-400" />}
                    {protocol.trending && <TrendingUp className="w-5 h-5 text-orange-400" />}
                  </h3>
                  <p className="text-purple-300">{protocol.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {getRatingStars(protocol.rating)}
                <span className="text-white ml-2 font-medium">{protocol.rating}</span>
              </div>
            </div>
            
            <p className="text-purple-300 mb-6">{protocol.description}</p>
            
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-purple-400 text-sm mb-1">Pool Size</p>
                <p className="text-white font-semibold text-lg">{protocol.poolSize}</p>
              </div>
              <div>
                <p className="text-purple-400 text-sm mb-1">Available</p>
                <p className="text-green-400 font-semibold text-lg">{protocol.allocationRemaining}</p>
              </div>
              <div>
                <p className="text-purple-400 text-sm mb-1">APY</p>
                <p className="text-yellow-400 font-semibold text-lg">{protocol.apy}</p>
              </div>
              <div>
                <p className="text-purple-400 text-sm mb-1">Liquidity Type</p>
                <p className="text-blue-400 font-semibold text-lg">{protocol.liquidityType}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-purple-400 text-sm mb-1">Collateral</p>
                <p className="text-white">{protocol.collateralType}</p>
                <p className="text-green-400 text-sm">Ratio: {protocol.collateralRatio}</p>
              </div>
              <div>
                <p className="text-purple-400 text-sm mb-1">Min Deposit</p>
                <p className="text-white">{protocol.minDeposit}</p>
              </div>
              <div>
                <p className="text-purple-400 text-sm mb-1">Duration</p>
                <p className="text-white">{protocol.duration}</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => handleDeposit(protocol)}
                className="inline-flex items-center justify-center flex-1 bg-gradient-to-r from-purple-700 to-violet-700 text-white py-3 px-6 rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all font-medium shadow-lg shadow-purple"
              >
                Deposit {protocol.liquidityType}
              </button>
              <button className="px-4 py-3 border border-purple-500 border-opacity-30 rounded-xl hover:bg-purple-500/20 transition-colors">
                <ExternalLink className="w-5 h-5 text-purple-300" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Deposit Modal */}
      {showDepositModal && selectedProtocol && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 className="text-xl font-semibold text-white mb-4">
              Deposit to {selectedProtocol.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-purple-300 text-sm mb-2">Amount ({selectedProtocol.liquidityType})</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="input-field"
                />
              </div>
              <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-300">APY</span>
                  <span className="text-yellow-400 font-semibold">{selectedProtocol.apy}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-300">Duration</span>
                  <span className="text-white">{selectedProtocol.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">Collateral Ratio</span>
                  <span className="text-green-400">{selectedProtocol.collateralRatio}</span>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="inline-flex items-center justify-center flex-1 px-4 py-3 border border-purple-600 border-opacity-30 rounded-xl hover:bg-purple-600 bg-opacity-20 transition-colors text-purple-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDepositConfirm}
                  className="inline-flex items-center justify-center flex-1 bg-gradient-to-r from-purple-700 to-violet-700 text-white py-3 px-6 rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all font-medium shadow-lg shadow-purple"
                >
                  Confirm Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedProtocol && (
        <div className="modal-backdrop">
          <div className="modal-content max-w-md text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">Deposit Confirmed!</h3>
            <p className="text-purple-300 mb-6">
              Your deposit to <span className="font-medium text-white">{selectedProtocol.name}</span> was
              successful.
            </p>

            <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">APY</span>
                <span className="text-yellow-400 font-semibold">{selectedProtocol.apy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Duration</span>
                <span className="text-white">{selectedProtocol.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">Collateral Ratio</span>
                <span className="text-green-400">{selectedProtocol.collateralRatio}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                setSelectedProtocol(null);
              }}
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-purple-700 to-violet-700 text-white py-3 px-6 rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all font-medium shadow-lg shadow-purple"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LendingProtocolsPage;
