/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, Transaction } from './types';
import { DEMO_USERS, INITIAL_TRANSACTIONS } from './data/sampleData';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { TransactionAnalyzer } from './components/TransactionAnalyzer';
import { VindicationTable } from './components/VindicationTable';
import { CorrectionOrderHelper } from './components/CorrectionOrderHelper';
import { LegalAIChat } from './components/LegalAIChat';
import { RehabilitationCalculator } from './components/RehabilitationCalculator';
import { PdfToExcelExtractor } from './components/PdfToExcelExtractor';

export default function App() {
  // Current user state (null means displaying law-bot.kr/login portal)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    // Check if previously logged in
    const saved = localStorage.getItem('lawbot_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<string>('transactions');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('lawbot_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('lawbot_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lawbot_user');
  };

  const handleUpdateTransactions = (newTxs: Transaction[]) => {
    setTransactions(newTxs);
    localStorage.setItem('lawbot_transactions', JSON.stringify(newTxs));
  };

  // If user is not logged in, show the exact replicated, fully open law-bot.kr login portal!
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'transactions' && (
          <TransactionAnalyzer
            transactions={transactions}
            onUpdateTransactions={handleUpdateTransactions}
            onNavigateToVindication={() => setActiveTab('vindication')}
            onNavigateToPdfExtractor={() => setActiveTab('pdf-extractor')}
          />
        )}

        {activeTab === 'pdf-extractor' && (
          <PdfToExcelExtractor
            onImportToWorkspace={(newTxs) => {
              handleUpdateTransactions([...newTxs, ...transactions]);
            }}
            onNavigateToAnalyzer={() => setActiveTab('transactions')}
          />
        )}

        {activeTab === 'vindication' && (
          <VindicationTable transactions={transactions} />
        )}

        {activeTab === 'correction' && (
          <CorrectionOrderHelper />
        )}

        {activeTab === 'chat' && (
          <LegalAIChat />
        )}

        {activeTab === 'calculator' && (
          <RehabilitationCalculator />
        )}
      </main>

      {/* Quiet Corporate Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">LAWBOT AI</span>
            <span>·</span>
            <span>주식회사 로봇에이아이 (law-bot.kr 오픈 플랫폼)</span>
            <span>·</span>
            <span className="text-slate-400">서울회생법원 실무준칙 제408호 엔진 탑재</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>개인정보보호 및 금융 데이터 256비트 암호화</span>
            <span>·</span>
            <button
              onClick={handleLogout}
              className="hover:text-blue-600 transition"
            >
              로그인 포털로 이동
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
