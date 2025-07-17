import React, { useState } from 'react';
import { Zap, Bell, Settings, Wallet, Bot, Search, Filter, ChevronDown } from 'lucide-react';
import AIAgentPage from './AIAgentPage2';
import LendingProtocolsPage from './LendingProtocolsPage';
import BorrowersPage from './BorrowersPage';
import LendersPage from './LendersPage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('ai-agent');
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Bitcoin Lending', 'Ethereum Lending', 'Multi-Chain', 'Stablecoin'];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const toggleWalletConnection = () => {
    setIsWalletConnected(!isWalletConnected);
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
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Vishwa</h1>
                <p className="text-purple-300 text-sm">Liquidity Protocol</p>
              </div>
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
                onClick={toggleWalletConnection}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  isWalletConnected
                    ? 'wallet-button-connected'
                    : 'wallet-button-disconnected'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>{isWalletConnected ? 'Connected' : 'Connect Wallet'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

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
