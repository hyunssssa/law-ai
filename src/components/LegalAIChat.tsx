import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Bot, User, Sparkles, Loader2, RefreshCw } from 'lucide-react';

export const LegalAIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      text: `안녕하세요. 대한민국 개인회생 및 금융 거래내역 소명 전문 AI 상담관 **로봇(LAWBOT)**입니다.

채무자 회생 및 파산에 관한 법률, 서울회생법원 실무준칙(가상자산·주식 손실금 등), 대출금 사용처 소명 및 법원 보정권고 대처 방안에 대해 무엇이든 편안하게 질문해주세요.`,
      timestamp: '방금 전',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '코인·주식 투자 손실금은 청산가치에 무조건 반영되나요?',
    '대출받은 직후 배우자 계좌로 이체한 내역 소명 방법은?',
    'ATM 현금 인출 400만원 영수증이 없는데 어떻게 소명하나요?',
    '배우자 명의 아파트 임대차 보증금도 제 청산가치에 잡히나요?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      timestamp: '방금 전',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error('AI 법률 상담 응답 생성에 실패했습니다.');
      }

      const data = await res.json();
      const modelMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        text: data.reply || '답변을 생성하지 못했습니다.',
        timestamp: '방금 전',
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        text: '죄송합니다. 법률 자문 처리 중 일시적인 네트워크 장애가 발생했습니다. 잠시 후 다시 질문해주세요.',
        timestamp: '방금 전',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-welcome',
        role: 'model',
        text: `안녕하세요. 대한민국 개인회생 및 금융 거래내역 소명 전문 AI 상담관 **로봇(LAWBOT)**입니다.

채무자 회생 및 파산에 관한 법률, 서울회생법원 실무준칙, 금융 거래내역 소명에 대해 무엇이든 질문해주세요.`,
        timestamp: '방금 전',
      },
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[580px]">
      
      {/* Left Sidebar: Lawyer Profile & Quick Prompt Cards */}
      <div className="lg:col-span-4 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-5 shadow-xs overflow-y-auto">
        <div className="space-y-4">
          
          {/* Lawyer Counselor Profile */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <img
              src="/src/assets/images/lawbot_avatar_lawyer_1794211346861.jpg"
              alt="LAWBOT 수석 법률상담관"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm">김수현 법률 상담관</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  AI 어드바이저
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">서울회생법원 개인회생·파산 전담</p>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-800 block mb-2">
              자주 묻는 법률 질문
            </span>
            <div className="space-y-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-200 text-xs text-slate-700 hover:text-blue-900 transition leading-snug group"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span>{prompt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <span className="font-bold text-slate-800 block">적용 주요 법령 및 준칙</span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
              <li>채무자 회생 및 파산에 관한 법률</li>
              <li>서울회생법원 실무준칙 제408호</li>
              <li>민사집행법 제246조 (압류금지채권)</li>
              <li>주택임대차보호법 시행령 (소액보증금)</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="mt-4 w-full py-2 px-3 flex items-center justify-center gap-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>대화 내용 초기화</span>
        </button>
      </div>

      {/* Right Column: Chat Window */}
      <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Chat Messages Viewport */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {!isUser ? (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      isUser ? 'text-blue-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-md">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-slate-500 shadow-xs flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>법령 및 회생 실무준칙 검토 중...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="법률 질문을 입력하세요 (예: 코인 손실금 소명서 작성 요령)"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              <span>전송</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Powered by Gemini 3.8 Flash AI 법률 모델</span>
            <span>최신 2026년 기준 법률 준칙 반영</span>
          </div>
        </div>
      </div>
    </div>
  );
};
