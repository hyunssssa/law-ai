import React, { useState } from 'react';
import { Transaction } from '../types';
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Scale, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface VindicationTableProps {
  transactions: Transaction[];
}

export const VindicationTable: React.FC<VindicationTableProps> = ({ transactions }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'loan' | 'crypto' | 'family'>('all');

  // Filter specific sections
  const loanTxs = transactions.filter((t) => t.category === '대출금유입');
  const cryptoTxs = transactions.filter((t) => t.category === '가상자산/주식');
  const familyAndCashTxs = transactions.filter(
    (t) => t.category === '계좌간이체' || t.category === '고액현금출금'
  );
  const allNeedingExplanation = transactions.filter((t) => t.needsExplanation);

  // Copy full legal text representation
  const handleCopyText = () => {
    let doc = `금융거래내역 사용처 소명서\n\n`;
    doc += `사건번호: 2026개회 10492 개인회생\n`;
    doc += `신청인(채무자): 박준혁\n`;
    doc += `관할법원: 서울회생법원 제31단독 귀중\n\n`;
    doc += `[1. 대출금 유입 및 사용처 대조표]\n`;
    loanTxs.forEach((l) => {
      doc += `- 대출일자: ${l.date} | 금융사: ${l.bank} | 금액: ${l.amount.toLocaleString()}원\n`;
      doc += `  소명내용: ${l.explanationNote}\n\n`;
    });
    doc += `[2. 가상자산 및 주식 투자 손실 소명표 (실무준칙 제408호 적용)]\n`;
    cryptoTxs.forEach((c) => {
      doc += `- 송금일자: ${c.date} | 거래처: ${c.counterpart} | 금액: ${c.amount.toLocaleString()}원\n`;
      doc += `  소명내용: ${c.explanationNote}\n  증빙자료: ${c.supportingDocRequired || '거래원장'}\n\n`;
    });
    doc += `[3. 계좌 간 이동 및 고액 현금 인출 소명표]\n`;
    familyAndCashTxs.forEach((f) => {
      doc += `- 출금일자: ${f.date} | 수취인/처: ${f.counterpart} | 금액: ${f.amount.toLocaleString()}원\n`;
      doc += `  소명내용: ${f.explanationNote}\n  증빙자료: ${f.supportingDocRequired || '영수증'}\n\n`;
    });
    doc += `위 기재 내용은 신청인의 실제 금융거래 내역과 부합하며, 허위가 없음을 소명합니다.\n`;
    doc += `2026년 11월 09일\n신청인 박준혁 (인)`;

    navigator.clipboard.writeText(doc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download CSV
  const handleDownloadCsv = () => {
    const headers = ['거래일자', '금융기관', '계좌번호', '거래처', '구분', '금액', '분류', '소명내용', '증빙서류'];
    const rows = allNeedingExplanation.map((t) => [
      t.date,
      t.bank,
      t.accountNo,
      `"${t.counterpart.replace(/"/g, '""')}"`,
      t.type,
      t.amount,
      t.category,
      `"${t.explanationNote.replace(/"/g, '""')}"`,
      `"${(t.supportingDocRequired || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '개인회생_금융거래내역_사용처_소명표.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>법원 제출용 공문서 생성기</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-medium">서울회생법원 표준양식 호환</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            금융거래내역 사용처 소명표 자동 작성
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            법원 회생위원 보정권고에 즉시 제출할 수 있는 규격화된 소명표 및 증빙자료 첨부 목록입니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '복사 완료!' : '전문 텍스트 복사'}</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>엑셀 다운로드</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>법원 제출용 인쇄</span>
          </button>
        </div>
      </div>

      {/* Legal Sheet Document Container (Court Paper Look & Feel) */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-10 text-slate-900 max-w-5xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-900 pb-6 space-y-3">
          <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded">
            보정권고 제출용 별지 제1호
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
            금융거래내역 사용처 소명서
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-3 font-medium text-slate-700">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-400 block text-[11px]">사건번호</span>
              <span className="font-bold text-slate-900">2026개회 10492 개인회생</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-400 block text-[11px]">신청인 (채무자)</span>
              <span className="font-bold text-slate-900">박 준 혁</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-400 block text-[11px]">관할법원</span>
              <span className="font-bold text-slate-900">서울회생법원 제31단독</span>
            </div>
          </div>
        </div>

        {/* Section 1: 대출금 유입 및 사용처 대조표 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
              <span>대출금 유입 및 사용처 1:1 대조 소명표</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono-numbers">대출 유입 합계: 30,000,000원</span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">대출일자</th>
                  <th className="py-2.5 px-3">금융기관 / 계좌</th>
                  <th className="py-2.5 px-3 text-right">대출금액</th>
                  <th className="py-2.5 px-3">구체적 자금 사용처 및 귀속 내역</th>
                  <th className="py-2.5 px-3">입증방법(증빙)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loanTxs.map((t) => (
                  <tr key={t.id} className="bg-white">
                    <td className="py-2.5 px-3 font-mono-numbers">{t.date}</td>
                    <td className="py-2.5 px-3 font-medium">{t.bank} ({t.accountNo})</td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600 font-mono-numbers">
                      {t.amount.toLocaleString()}원
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 leading-relaxed max-w-md">
                      {t.explanationNote}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-medium">
                      {t.supportingDocRequired}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: 가상자산 및 주식 투자 손실 소명표 (서울회생법원 실무준칙 제408호) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
              <span>가상자산·주식 투자 손실 소명표 (서울회생법원 실무준칙 제408호)</span>
            </h3>
            <span className="text-xs text-indigo-700 font-medium bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              손실금 청산가치 제외 소명
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">송금일자</th>
                  <th className="py-2.5 px-3">거래소 / 증권사</th>
                  <th className="py-2.5 px-3 text-right">송금액</th>
                  <th className="py-2.5 px-3 text-right">현재 잔존가치</th>
                  <th className="py-2.5 px-3">실무준칙 적용 소명 의견</th>
                  <th className="py-2.5 px-3">증빙 서류</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cryptoTxs.map((t) => (
                  <tr key={t.id} className="bg-white">
                    <td className="py-2.5 px-3 font-mono-numbers">{t.date}</td>
                    <td className="py-2.5 px-3 font-medium">{t.counterpart}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800 font-mono-numbers">
                      {t.amount.toLocaleString()}원
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-red-600 font-mono-numbers">
                      {t.amount === 12000000 ? '1,400,000원' : '480,000원'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 leading-relaxed max-w-sm">
                      {t.explanationNote}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {t.supportingDocRequired}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-indigo-50/60 border border-indigo-200/80 rounded-lg text-xs text-indigo-900 leading-relaxed">
            <strong>법리적 소명 요지:</strong> 서울회생법원 실무준칙 제408호에 따라 가상자산 및 주식 투자로 인하여 발생한 실제 손실금은 '현재 채무자가 보유한 재산'이 아니므로 청산가치에 반영하지 않아야 합니다. 첨부된 거래소 원장 및 잔고증명서와 같이 현재 잔존가치(약 188만원)만을 청산가치로 산입하여 주시기 바랍니다.
          </div>
        </div>

        {/* Section 3: 계좌 간 이동 및 고액 현금 인출 소명표 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-amber-600 text-white flex items-center justify-center text-xs">3</span>
              <span>배우자 계좌 이체 및 고액 현금 인출 소명표</span>
            </h3>
            <span className="text-xs text-slate-500">재산 은닉 부인 및 실지 생활비 입증</span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">출금일자</th>
                  <th className="py-2.5 px-3">수취인 (관계)</th>
                  <th className="py-2.5 px-3 text-right">출금금액</th>
                  <th className="py-2.5 px-3">실제 사용 내역 및 은닉 부인 사유</th>
                  <th className="py-2.5 px-3">첨부 영수증 증빙</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {familyAndCashTxs.map((t) => (
                  <tr key={t.id} className="bg-white">
                    <td className="py-2.5 px-3 font-mono-numbers">{t.date}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{t.counterpart}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono-numbers">
                      {t.amount.toLocaleString()}원
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 leading-relaxed max-w-sm">
                      {t.explanationNote}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-medium">
                      {t.supportingDocRequired || '진료비 영수증 / 이체확인증'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: 증빙자료 첨부 목록 */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-800">첨 부 서 류</h4>
          <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1 pl-1">
            <li>카카오뱅크 대출거래약정서 및 입금 확인증 1부</li>
            <li>케이뱅크 및 업비트 거래내역서, 계좌 잔고증명서(평가손실 입증) 1부</li>
            <li>키움증권 거래원장 사본 1부</li>
            <li>배우자 이선영 명의 계좌 거래내역서 및 병원 수술비 납부 영수증 1부</li>
            <li>직장동료 차용증 사본 및 상환 확인서 1부</li>
          </ol>
        </div>

        {/* Sign-off */}
        <div className="text-center pt-6 space-y-2 text-xs">
          <p className="text-slate-600">
            위와 같이 금융거래내역에 대한 구체적인 사용처와 근거 자료를 성실히 소명하며,
            <br />
            본 소명서에 기재된 내용은 객관적 사실에 부합함을 서약합니다.
          </p>
          <p className="font-bold text-slate-800 pt-3">
            2026년 11월 09일
          </p>
          <p className="font-bold text-base text-slate-950">
            신청인(채무자) : 박 준 혁 &nbsp; (인)
          </p>
          <p className="text-sm font-semibold text-slate-800 pt-2">
            서울회생법원 제31단독 귀중
          </p>
        </div>
      </div>
    </div>
  );
};
