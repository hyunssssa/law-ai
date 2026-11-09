import React from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, LogOut, FileSpreadsheet, Bot, Calculator, Scale, FileCheck } from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const navItems = [
    { id: 'transactions', label: '거래내역 AI 분석', icon: FileSpreadsheet },
    { id: 'pdf-extractor', label: 'PDF ➔ 엑셀 추출', icon: FileSpreadsheet },
    { id: 'vindication', label: '법원 소명표 자동작성', icon: FileCheck },
    { id: 'correction', label: '보정권고 솔루션', icon: Scale },
    { id: 'chat', label: 'AI 법률 상담관', icon: Bot },
    { id: 'calculator', label: '변제금 시뮬레이터', icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-black tracking-wider text-white shadow-md shadow-blue-500/20">
            LB
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="flex items-center gap-2 text-left group"
          >
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors whitespace-nowrap">
              LAWBOT
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-medium border border-blue-700/50 whitespace-nowrap">
              개인회생 AI
            </span>
          </button>
        </div>

        {/* Zone 2: 4–5 single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-white">{currentUser.name}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-400">{currentUser.firmName || '체험 모드'}</span>
          </div>

          <button
            onClick={onLogout}
            title="로그아웃 또는 다른 계정으로 전환"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>모드 전환</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 bg-slate-950 border-t border-slate-800 gap-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
