import React, { useState, useEffect } from 'react';
import { Zap, Bell, Settings, Wallet, Bot, Search, Filter, ChevronDown } from 'lucide-react';
import AIAgentPage from './AIAgentPage';
import LendingProtocolsPage from './LendingProtocolsPage';
import BorrowersPage from './BorrowersPage';
import LendersPage from './LendersPage';
import { connectWallet, getConnectedWallet } from './APIService';
import VishwaLogo from './assets/VishwaLogo.png';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('ai-agent');
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Bitcoin Lending', 'Ethereum Lending', 'Multi-Chain', 'Stablecoin'];

  // Check for existing wallet connection on component mount
  // useEffect(() => {
  //   const checkWalletConnection = async () => {
  //     try {
  //       const walletData = await getConnectedWallet();
  //       if (walletData && walletData.wallet_address) {
  //         setWalletAddress(walletData.wallet_address);
  //         setIsWalletConnected(true);
  //       }
  //     } catch (error) {
  //       console.error('Error checking wallet connection:', error);
  //     }
  //   };

  //   checkWalletConnection();
  // }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleConnectWallet = async () => {
    if (!walletAddress.trim()) {
      alert("Please enter a wallet address");
      return;
    }
    
    try {
      const result = await connectWallet(walletAddress);
      console.log(result);
      setIsWalletConnected(true);
      setShowWalletModal(false);
      
      console.log(`Wallet connected successfully! Address: ${walletAddress}`);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const handleWalletButtonClick = () => {
    if (isWalletConnected) {
      // If connected, show disconnect option or wallet info
      const shouldDisconnect = window.confirm(`Connected to: ${walletAddress}\n\nWould you like to disconnect?`);
      if (shouldDisconnect) {
        setIsWalletConnected(false);
        setWalletAddress('');
      }
    } else {
      // If not connected, show connection modal
      setShowWalletModal(true);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'ai-agent':
        return <AIAgentPage />;
      case 'lending-protocols':
        return <LendingProtocolsPage />;
      case 'borrowers':
        return <BorrowersPage />;
      case 'lenders':
        return <LendersPage />;
      default:
        return <AIAgentPage />;
    }
  };

  return (
    <>
      {/* Darker Apollo-style page gradient */}
      <div className="min-h-screen bg-gradient-to-br from-[#0e0e13] via-[#1d1233] to-[#321c6a]">
        {/* Header */}
        <header className="bg-purple-900 bg-opacity-40 backdrop-blur-sm border-b border-purple-600 border-opacity-20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-8 lg:px-20">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center">
                <img src={VishwaLogo} alt="Vishwa Logo" className="h-12 w-auto" />
              </div>
              
              {/* Navigation */}
              <nav className="flex space-x-8">
                <button
                  onClick={() => handleTabChange('ai-agent')}
                  className={`tab-button ${
                    activeTab === 'ai-agent' ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <span>AI Agent</span>
                  </div>
                </button>
                <button
                  onClick={() => handleTabChange('lending-protocols')}
                  className={`tab-button ${
                    activeTab === 'lending-protocols' ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  Lending Protocols
                </button>
                <button
                  onClick={() => handleTabChange('borrowers')}
                  className={`tab-button ${
                    activeTab === 'borrowers' ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  Borrowers
                </button>
                <button
                  onClick={() => handleTabChange('lenders')}
                  className={`tab-button ${
                    activeTab === 'lenders' ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  Lenders
                </button>
              </nav>
              
              {/* Right side actions */}
              <div className="flex items-center space-x-6">
                <Bell className="w-6 h-6 text-purple-300 cursor-pointer hover:text-white transition-colors" />
                <Settings className="w-6 h-6 text-purple-300 cursor-pointer hover:text-white transition-colors" />
                <button
                  onClick={handleWalletButtonClick}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                    isWalletConnected
                      ? 'wallet-button-connected'
                      : 'wallet-button-disconnected'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-5 h-5" />
                    <span>
                      {isWalletConnected 
                        ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                        : 'Connect Wallet'
                      }
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Wallet Connection Modal */}
        {showWalletModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-purple-900 to-black rounded-xl p-6 max-w-md w-full mx-4 border border-purple-500 border-opacity-30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Connect Wallet</h3>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="text-purple-300 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <p className="text-purple-300 text-sm mb-4">
                Enter your wallet address to execute spending plans
              </p>
              <input
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full px-4 py-3 bg-purple-900 bg-opacity-30 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="flex-1 px-4 py-3 border border-purple-500 border-opacity-30 rounded-lg text-purple-300 hover:text-white hover:border-purple-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnectWallet}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg text-white hover:from-purple-600 hover:to-violet-700 transition-all"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="bg-purple-900 bg-opacity-40 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-purple-300 text-sm">
              © 2025 Vishwa LTD. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;