import React, { useState } from 'react';
import { Transaction, BatchAnalysisResult } from '../types';
import { 
  Sparkles, 
  Search, 
  Plus, 
  RefreshCw, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Loader2,
  X,
  CreditCard,
  Edit2,
  Save,
  FileSpreadsheet
} from 'lucide-react';

interface TransactionAnalyzerProps {
  transactions: Transaction[];
  onUpdateTransactions: (txs: Transaction[]) => void;
  onNavigateToVindication: () => void;
  onNavigateToPdfExtractor: () => void;
}

export const TransactionAnalyzer: React.FC<TransactionAnalyzerProps> = ({
  transactions,
  onUpdateTransactions,
  onNavigateToVindication,
  onNavigateToPdfExtractor,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [editExplanation, setEditExplanation] = useState('');
  
  // AI Batch Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BatchAnalysisResult | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // New Transaction Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    date: new Date().toISOString().slice(0, 10),
    bank: '국민은행',
    accountNo: '110-384-912***',
    counterpart: '',
    type: '출금',
    amount: 1000000,
    category: '기타',
    memo: '',
    needsExplanation: true,
    explanationNote: '',
    riskLevel: 'medium',
  });

  // Calculate Metrics
  const totalIn = transactions.filter((t) => t.type === '입금').reduce((acc, t) => acc + t.amount, 0);
  const totalOut = transactions.filter((t) => t.type === '출금').reduce((acc, t) => acc + t.amount, 0);
  const explanationItems = transactions.filter((t) => t.needsExplanation);
  const explanationSum = explanationItems.reduce((acc, t) => acc + t.amount, 0);
  const highRiskCount = transactions.filter((t) => t.riskLevel === 'high').length;

  // Filtered transactions
  const filtered = transactions.filter((tx) => {
    if (filterCategory === 'explanation' && !tx.needsExplanation) return false;
    if (filterCategory === 'loan' && tx.category !== '대출금유입') return false;
    if (filterCategory === 'crypto' && tx.category !== '가상자산/주식') return false;
    if (filterCategory === 'transfer' && tx.category !== '계좌간이체') return false;
    if (filterCategory === 'cash' && tx.category !== '고액현금출금') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCounterpart = tx.counterpart.toLowerCase().includes(q);
      const matchMemo = tx.memo.toLowerCase().includes(q);
      const matchBank = tx.bank.toLowerCase().includes(q);
      const matchExplanation = tx.explanationNote.toLowerCase().includes(q);
      return matchCounterpart || matchMemo || matchBank || matchExplanation;
    }

    return true;
  });

  // Execute Gemini AI analysis
  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch('/api/analyze-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          clientContext: '개인회생 신청인(박준혁, 38세), 대출금 3천만원 유입 및 당일/익일 가상자산/배우자 이체 소명 건',
        }),
      });

      if (!res.ok) {
        throw new Error('AI 분석 요청에 실패했습니다.');
      }

      const data: BatchAnalysisResult = await res.json();
      setAnalysisResult(data);
      setShowAnalysisModal(true);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'AI 분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save inline explanation
  const handleSaveExplanation = (id: string) => {
    const updated = transactions.map((t) =>
      t.id === id ? { ...t, explanationNote: editExplanation, needsExplanation: true } : t
    );
    onUpdateTransactions(updated);
    setEditingTxId(null);
  };

  // Handle Add Transaction
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.counterpart || !newTx.amount) return;

    const created: Transaction = {
      id: `tx-${Date.now()}`,
      date: newTx.date || '2025-11-01',
      bank: newTx.bank || '국민은행',
      accountNo: newTx.accountNo || '110-384-912***',
      counterpart: newTx.counterpart,
      type: newTx.type as '입금' | '출금',
      amount: Number(newTx.amount),
      balance: 1000000,
      category: newTx.category as any,
      memo: newTx.memo || '',
      needsExplanation: Boolean(newTx.needsExplanation),
      explanationNote: newTx.explanationNote || '법원 제출용 사용처 소명 기재 필요',
      riskLevel: newTx.riskLevel as 'low' | 'medium' | 'high',
      supportingDocRequired: '금융거래확인서 또는 영수증',
    };

    onUpdateTransactions([created, ...transactions]);
    setShowAddModal(false);
    setNewTx({
      date: new Date().toISOString().slice(0, 10),
      bank: '국민은행',
      accountNo: '110-384-912***',
      counterpart: '',
      type: '출금',
      amount: 1000000,
      category: '기타',
      memo: '',
      needsExplanation: true,
      explanationNote: '',
      riskLevel: 'medium',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>사건관리</span>
            <span aria-hidden="true">·</span>
            <span>2026개회 10492</span>
            <span aria-hidden="true">·</span>
            <span className="text-blue-600 font-medium">서울회생법원 제31단독</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            금융 거래내역 AI 분석 및 소명 관리
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            은행 통장 입출금 내역을 자동 분석하여 대출금 사용처와 소명 필요 항목을 분류합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onNavigateToPdfExtractor}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>📄 PDF 넣고 엑셀 추출하기</span>
          </button>

          <button
            onClick={handleRunAiAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI 정밀 분석 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Gemini AI 거래 분석 리포트</span>
              </>
            )}
          </button>

          <button
            onClick={onNavigateToVindication}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <FileText className="w-4 h-4" />
            <span>법원 소명표 생성</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">전체 분석 거래</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-mono-numbers">{transactions.length}</span>
            <span className="text-xs text-slate-500">건</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">최근 1년 치 통장 합산</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">총 입금 합계</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-emerald-600 font-mono-numbers">
              {totalIn.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">원</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">대출금 3,000만 포함</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block mb-1">총 출금 합계</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-slate-800 font-mono-numbers">
              {totalOut.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">원</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">생활비 및 투자 송금</span>
        </div>

        <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 shadow-xs">
          <span className="text-xs text-amber-800 font-medium block mb-1">법원 소명 필요 대상</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-amber-700 font-mono-numbers">
              {explanationSum.toLocaleString()}
            </span>
            <span className="text-xs text-amber-800">원</span>
          </div>
          <span className="text-[11px] text-amber-700 mt-1 block font-medium">
            총 {explanationItems.length}건 소명서 작성 필요
          </span>
        </div>

        <div className="p-4 bg-red-50/70 rounded-xl border border-red-200/80 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-xs text-red-800 font-medium block mb-1">고위험(보정권고) 항목</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-red-600 font-mono-numbers">{highRiskCount}</span>
            <span className="text-xs text-red-700">건</span>
          </div>
          <span className="text-[11px] text-red-600 mt-1 block font-medium">코인, 배우자이체, 현금출금</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {[
            { id: 'all', label: '전체 거래' },
            { id: 'explanation', label: '⚠️ 소명 필요 건만' },
            { id: 'loan', label: '대출금 유입' },
            { id: 'crypto', label: '가상자산/주식' },
            { id: 'transfer', label: '계좌간 이체' },
            { id: 'cash', label: '고액 현금인출' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                filterCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="거래처, 메모, 사유 검색..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>직접 추가</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4 w-28 whitespace-nowrap">거래일자</th>
                <th className="py-3 px-4 w-32 whitespace-nowrap">금융기관 / 계좌</th>
                <th className="py-3 px-4 w-44 whitespace-nowrap">거래처 / 적요</th>
                <th className="py-3 px-4 w-24 whitespace-nowrap text-center">구분</th>
                <th className="py-3 px-4 w-36 whitespace-nowrap text-right">거래금액</th>
                <th className="py-3 px-4 w-28 whitespace-nowrap">AI 자동분류</th>
                <th className="py-3 px-4 whitespace-nowrap">소명 사유 (법원 제출안)</th>
                <th className="py-3 px-4 w-20 whitespace-nowrap text-center">위험도</th>
                <th className="py-3 px-4 w-20 whitespace-nowrap text-center">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    조건에 해당하는 거래내역이 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isEditing = editingTxId === tx.id;
                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        tx.needsExplanation ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono-numbers text-slate-600 whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{tx.bank}</div>
                        <div className="text-[11px] text-slate-400 font-mono-numbers">{tx.accountNo}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{tx.counterpart}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{tx.memo}</div>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {tx.type === '입금' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-700 bg-emerald-50">
                            <ArrowDownLeft className="w-3 h-3" /> 입금
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700 bg-slate-100">
                            <ArrowUpRight className="w-3 h-3" /> 출금
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-numbers whitespace-nowrap">
                        <span
                          className={`font-bold ${
                            tx.type === '입금' ? 'text-emerald-600' : 'text-slate-900'
                          }`}
                        >
                          {tx.amount.toLocaleString()}
                        </span>
                        <span className="text-slate-400 ml-0.5">원</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-xs text-slate-700 font-medium">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editExplanation}
                              onChange={(e) => setEditExplanation(e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-blue-400 rounded text-xs text-slate-900 focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveExplanation(tx.id)}
                              className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded shrink-0"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingTxId(null)}
                              className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="group flex items-start justify-between gap-2">
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                              {tx.explanationNote || (
                                <span className="text-slate-400 italic">소명 사유 미작성</span>
                              )}
                            </p>
                            <button
                              onClick={() => {
                                setEditingTxId(tx.id);
                                setEditExplanation(tx.explanationNote);
                              }}
                              title="소명 사유 편집"
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded text-slate-500 transition shrink-0"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {tx.riskLevel === 'high' && (
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200">
                            고위험
                          </span>
                        )}
                        {tx.riskLevel === 'medium' && (
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200">
                            주의
                          </span>
                        )}
                        {tx.riskLevel === 'low' && (
                          <span className="text-[11px] text-slate-400">일반</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="px-2 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded font-medium text-xs transition"
                        >
                          보기
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Drawer / Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-900 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">거래 상세 정보 및 소명 가이드</h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block">거래 일자</span>
                  <span className="font-semibold text-slate-800 font-mono-numbers">{selectedTx.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">금융기관</span>
                  <span className="font-semibold text-slate-800">{selectedTx.bank} ({selectedTx.accountNo})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">거래처 / 적요</span>
                  <span className="font-semibold text-slate-800">{selectedTx.counterpart}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">금액 ({selectedTx.type})</span>
                  <span className="font-bold text-base text-slate-900 font-mono-numbers">
                    {selectedTx.amount.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-800 block mb-1">회생위원 예상 질문 및 지적 사항:</span>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/80 text-amber-900 leading-relaxed">
                  {selectedTx.category === '가상자산/주식' && (
                    <p>
                      "가상자산 및 주식 매수를 위해 출금된 금원의 현재 잔존가치와 손실 내역을 입증하고, 최근 1년 내 투자인 경우 청산가치 반영 여부를 밝히시오."
                    </p>
                  )}
                  {selectedTx.category === '계좌간이체' && (
                    <p>
                      "가족(배우자) 명의 계좌로 이체된 금원이 재산 은닉 또는 증여에 해당하는지, 아니면 실질적인 가계 공동생활비 지출인지 증빙자료를 첨부하여 소명하시오."
                    </p>
                  )}
                  {selectedTx.category === '고액현금출금' && (
                    <p>
                      "ATM 등을 통해 현금으로 인출된 자금의 최종 도달처와 실사용 영수증을 제출하고, 특정 채권자에게만 임의 변제(편파변제)한 것인지 소명하시오."
                    </p>
                  )}
                  {selectedTx.category === '대출금유입' && (
                    <p>
                      "신청 직전 발생한 대출금의 전액에 대하여 각 출금 계좌와 1:1로 대조하여 사용처 소명표를 작성 제출하시오."
                    </p>
                  )}
                  {['생활비', '급여', '채무상환', '기타'].includes(selectedTx.category) && (
                    <p>통상적인 생활비 또는 급여 거래로 법원 소명 부담이 낮습니다.</p>
                  )}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-800 block mb-1">법원 제출용 권장 소명 문구:</span>
                <textarea
                  rows={3}
                  defaultValue={selectedTx.explanationNote}
                  onChange={(e) => {
                    selectedTx.explanationNote = e.target.value;
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              {selectedTx.supportingDocRequired && (
                <div className="p-2.5 bg-blue-50/80 rounded-lg border border-blue-200 text-blue-900">
                  <span className="font-semibold block mb-0.5">필수 준비 서류(증빙):</span>
                  <span>{selectedTx.supportingDocRequired}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  handleSaveExplanation(selectedTx.id);
                  setSelectedTx(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                소명 사유 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gemini AI Batch Analysis Result Modal */}
      {showAnalysisModal && analysisResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 text-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Gemini AI 법률 거래내역 정밀 분석 리포트
                </h3>
              </div>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">1. 종합 분석 요약</h4>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed text-slate-700">
                  {analysisResult.summary}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">
                  2. 법원 회생위원 집중 소명 요구 대상 (고위험 항목)
                </h4>
                <div className="space-y-2">
                  {analysisResult.highRiskItems?.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-red-200 bg-red-50/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-red-800">{item.riskType}</span>
                      </div>
                      <p className="text-slate-700 mb-1.5"><strong className="text-slate-900">문제점:</strong> {item.issue}</p>
                      <p className="text-blue-900 bg-blue-50/70 p-2 rounded border border-blue-200/60 leading-normal">
                        <strong className="text-blue-950">추천 소명문:</strong> {item.recommendedVindication}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">3. 청산가치 산입 위험 및 법리적 의견</h4>
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-amber-950 leading-relaxed">
                  {analysisResult.liquidationValueEstimate}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">4. 법원 보정권고 대비 필수 증빙 서류 가이드</h4>
                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-blue-950 leading-relaxed">
                  {analysisResult.courtAdvice}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  setShowAnalysisModal(false);
                  onNavigateToVindication();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                소명표 자동 작성하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900">거래내역 직접 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">거래 일자</label>
                  <input
                    type="date"
                    required
                    value={newTx.date}
                    onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">금융기관</label>
                  <input
                    type="text"
                    required
                    value={newTx.bank}
                    onChange={(e) => setNewTx({ ...newTx, bank: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">거래처 / 상대방 성명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 케이뱅크, 홍길동, 쿠팡"
                  value={newTx.counterpart}
                  onChange={(e) => setNewTx({ ...newTx, counterpart: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">입/출금</label>
                  <select
                    value={newTx.type}
                    onChange={(e) => setNewTx({ ...newTx, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="출금">출금</option>
                    <option value="입금">입금</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">금액 (원)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono-numbers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">분류 카테고리</label>
                <select
                  value={newTx.category}
                  onChange={(e) => setNewTx({ ...newTx, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="가상자산/주식">가상자산/주식</option>
                  <option value="계좌간이체">계좌간이체</option>
                  <option value="고액현금출금">고액현금출금</option>
                  <option value="대출금유입">대출금유입</option>
                  <option value="채무상환">채무상환</option>
                  <option value="생활비">생활비</option>
                  <option value="급여">급여</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">소명 사유</label>
                <textarea
                  rows={2}
                  placeholder="법원에 제출할 사용처 소명 내용을 입력하세요"
                  value={newTx.explanationNote}
                  onChange={(e) => setNewTx({ ...newTx, explanationNote: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
