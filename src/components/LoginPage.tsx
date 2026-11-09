import React, { useState } from 'react';
import { UserProfile } from '../types';
import { DEMO_USERS } from '../data/sampleData';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  UserCheck, 
  Lock, 
  Mail,
  Zap,
  TrendingDown,
  Scale
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'instant' | 'lawyer' | 'client'>('instant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Custom login submit handler
  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: email ? email.split('@')[0] : '체험 이용자',
      email: email || 'user@law-bot.kr',
      role: activeTab === 'lawyer' ? 'lawyer' : 'client',
      firmName: activeTab === 'lawyer' ? '법무법인 파트너' : '개인회생 신청인',
      caseNumber: '2026개회 10492',
    };
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Background with subtle luxury dusk Seoul office overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/lawbot_login_bg_1794211345802.jpg"
          alt="LAWBOT 법률 오피스 배경"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70" />
      </div>

      {/* Top Simple Header */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-black tracking-wider text-white shadow-lg shadow-blue-500/25">
              LB
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">LAWBOT</span>
              <span className="ml-2 text-xs text-blue-400 font-medium hidden sm:inline-block">로봇에이아이 법률 AI</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 hidden md:inline">누구나 자유롭게 이용 가능한 공개 오픈 플랫폼</span>
            <button
              onClick={() => onLogin(DEMO_USERS.guest)}
              className="px-3.5 py-1.5 rounded-md bg-blue-600/90 hover:bg-blue-600 text-white font-medium transition shadow-sm flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>1초 빠른 입장</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 my-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Brand, Value Proposition & Legal Features */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/60 text-blue-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>대한민국 1위 개인회생 거래내역 자동화 엔진</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              복잡한 개인회생 계좌 소명,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                인공지능 로봇(LAWBOT)
              </span>으로<br />
              1분 만에 완벽 정리합니다.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              수백 장의 통장 거래내역, 대출금 전후 사용처 추적, 가상자산·코인 손실금 소명까지. 
              법원 보정권고 양식에 맞춘 <strong>금융거래내역 사용처 소명표</strong>를 AI가 즉시 자동 생성합니다.
            </p>

            {/* Visual Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">PDF ➔ 엑셀 자동 추출</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  은행 통장·카드사 PDF를 올리면 AI가 표를 인식하여 정규화된 엑셀(CSV)로 1초 만에 추출
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                  <Scale className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">대출금 & 코인 사용처 소명</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  실무준칙 제408호 가상자산 손실금, 배우자 이체 및 현금인출 자금흐름 자동 추적
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">법원 소명표 자동 작성</h4>
                <p className="text-xs text-slate-400 leading-normal">
                  법원 보정권고 양식과 100% 일치하는 [금융거래내역 사용처 소명표] 및 서면 즉시 출력
                </p>
              </div>
            </div>

            {/* Quick Demo Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>회원가입 없이 누구나 무료 이용 가능</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>국내 모든 시중은행 엑셀 포맷 호환</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Gemini 3.8 Flash AI 실시간 법률 자문 탑재</span>
              </div>
            </div>
          </div>

          {/* Right Column: Replicated & Open Access Login Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              
              {/* Card Header */}
              <div className="text-center pb-6 border-b border-slate-800">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">LAWBOT 포털 로그인</h2>
                <p className="text-xs text-slate-400 mt-1">
                  체험자, 신청인, 변호사 누구나 클릭 한 번으로 즉시 시작할 수 있습니다.
                </p>
              </div>

              {/* Mode Select Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-xl my-5 border border-slate-800 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('instant')}
                  className={`py-2 px-2 rounded-lg transition-all text-center whitespace-nowrap ${
                    activeTab === 'instant'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ 즉시 시작
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('client')}
                  className={`py-2 px-2 rounded-lg transition-all text-center whitespace-nowrap ${
                    activeTab === 'client'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  👤 신청인 계정
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('lawyer')}
                  className={`py-2 px-2 rounded-lg transition-all text-center whitespace-nowrap ${
                    activeTab === 'lawyer'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💼 법무법인
                </button>
              </div>

              {/* Tab 1: Instant 1-Click Access for ANYONE */}
              {activeTab === 'instant' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 text-slate-200">
                    <p className="text-xs font-semibold text-blue-300 mb-1 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      누구나 즉시 무료 체험 모드
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      아이디/비밀번호 입력 없이 즉시 로봇(LawBot)의 모든 AI 거래내역 분석, 소명서 작성, 법률 챗봇 기능을 체험해보세요.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => onLogin(DEMO_USERS.guest)}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group text-sm"
                    >
                      <span>1초 게스트 입장 (모든 기능 개방)</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onLogin(DEMO_USERS.client)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 font-medium text-slate-200 transition text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-white">신청인 박준혁 데모</span>
                        <span className="text-slate-400">(대출 3천만 + 코인 손실 13건 샘플)</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onLogin(DEMO_USERS.lawyer)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 font-medium text-slate-200 transition text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        <span className="font-semibold text-white">김수현 변호사 관리자 데모</span>
                        <span className="text-slate-400">(법무법인 한울 회생전담팀)</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2 & 3: Standard Login Credentials Form */}
              {(activeTab === 'client' || activeTab === 'lawyer') && (
                <form onSubmit={handleCustomLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {activeTab === 'lawyer' ? '법무법인 이메일 / 계정' : '신청인 아이디 또는 이메일'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          activeTab === 'lawyer'
                            ? 'lawyer@hanul-law.co.kr (또는 아무 이메일)'
                            : 'client@example.com (또는 아무 아이디)'
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-slate-300">비밀번호</label>
                      <button
                        type="button"
                        onClick={() => alert('누구나 이용할 수 있도록 비밀번호 없이도 즉시 로그인이 가능합니다.')}
                        className="text-xs text-blue-400 hover:text-blue-300 transition"
                      >
                        비밀번호 찾기
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력하세요 (임의 입력 가능)"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                      />
                      <span>로그인 상태 유지</span>
                    </label>
                    <span className="text-slate-500">256-bit SSL 보안</span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <span>{activeTab === 'lawyer' ? '법무법인 계정으로 로그인' : '신청인 로그인'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onLogin(activeTab === 'lawyer' ? DEMO_USERS.lawyer : DEMO_USERS.client)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
                    >
                      ⚡ {activeTab === 'lawyer' ? '김수현 변호사' : '박준혁 신청인'} 프로필로 1초 자동 완성 입장
                    </button>
                  </div>
                </form>
              )}

              {/* Bottom Footer Info inside Card */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>계정이 없으신가요?</span>
                <button
                  type="button"
                  onClick={() => setShowSignUpModal(true)}
                  className="font-semibold text-blue-400 hover:text-blue-300 transition"
                >
                  무료 계정 생성하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-5 bg-slate-950/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span>주식회사 로봇에이아이 (LAWBOT AI)</span>
            <span>·</span>
            <span>개인회생 거래내역 자동화 플랫폼</span>
            <span>·</span>
            <span className="text-slate-400">law-bot.kr 포털 오픈 에디션</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>이용약관</span>
            <span>개인정보처리방침</span>
            <span>고객센터: 1544-0000</span>
          </div>
        </div>
      </footer>

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">LAWBOT 신규 계정 등록</h3>
            <p className="text-xs text-slate-400 mb-4">
              누구나 무료로 3초 만에 계정을 생성하고 개인회생 거래내역 자동화를 시작할 수 있습니다.
            </p>

            {signUpSuccess ? (
              <div className="p-4 bg-emerald-950/50 border border-emerald-800 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-semibold text-emerald-200">계정이 성공적으로 생성되었습니다!</p>
                <p className="text-xs text-slate-300">지금 바로 생성된 계정으로 입장합니다.</p>
                <button
                  onClick={() => {
                    setShowSignUpModal(false);
                    onLogin({
                      id: `user_${Date.now()}`,
                      name: '신규 이용자',
                      email: 'newuser@law-bot.kr',
                      role: 'client',
                      firmName: '개인회생 신청인',
                      caseNumber: '2026개회 10492',
                    });
                  }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg"
                >
                  워크스페이스로 바로 이동
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSignUpSuccess(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs text-slate-300 mb-1">성명 또는 법무법인명</label>
                  <input
                    required
                    type="text"
                    defaultValue="홍길동"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">이메일 (아이디)</label>
                  <input
                    required
                    type="email"
                    defaultValue="user@law-bot.kr"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">비밀번호</label>
                  <input
                    required
                    type="password"
                    defaultValue="12345678"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSignUpModal(false)}
                    className="w-1/2 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-xs font-semibold"
                  >
                    가입 및 시작
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
