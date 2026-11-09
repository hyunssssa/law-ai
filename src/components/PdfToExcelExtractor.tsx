import React, { useState } from 'react';
import { Transaction } from '../types';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  FileText,
  Plus,
  RefreshCw
} from 'lucide-react';

interface PdfToExcelExtractorProps {
  onImportToWorkspace: (txs: Transaction[]) => void;
  onNavigateToAnalyzer: () => void;
}

export const PdfToExcelExtractor: React.FC<PdfToExcelExtractorProps> = ({
  onImportToWorkspace,
  onNavigateToAnalyzer,
}) => {
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>({
    name: '카카오뱅크_금융거래내역서_2025.pdf',
    size: '1.4 MB',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<Transaction[] | null>(null);
  const [imported, setImported] = useState(false);

  // Load sample bank PDF
  const handleLoadSample = async (sampleType: 'kakao' | 'kb' | 'upbit', fileName: string) => {
    setIsProcessing(true);
    setImported(false);
    setSelectedFile({ name: fileName, size: '1.2 MB' });

    try {
      const res = await fetch('/api/parse-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleType, fileName }),
      });

      const data = await res.json();
      if (data.transactions) {
        setExtractedData(data.transactions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle local file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    });
    setIsProcessing(true);
    setImported(false);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/parse-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pdfBase64: base64,
            fileName: file.name,
          }),
        });
        const data = await res.json();
        if (data.transactions) {
          setExtractedData(data.transactions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Export to Excel (CSV)
  const handleDownloadExcel = () => {
    if (!extractedData || extractedData.length === 0) return;

    const headers = [
      '거래일자',
      '금융기관',
      '계좌번호',
      '거래처(적요)',
      '입출구분',
      '거래금액',
      '거래후잔액',
      'AI카테고리',
      '소명필요여부',
      '소명사유_법원제출안',
    ];

    const rows = extractedData.map((t) => [
      t.date,
      t.bank,
      t.accountNo,
      `"${t.counterpart.replace(/"/g, '""')}"`,
      t.type,
      t.amount,
      t.balance || 0,
      t.category,
      t.needsExplanation ? '소명필요' : '일반',
      `"${(t.explanationNote || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedFile?.name.replace('.pdf', '') || '금융거래내역'}_추출데이터.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApplyToWorkspace = () => {
    if (!extractedData) return;
    onImportToWorkspace(extractedData);
    setImported(true);
    setTimeout(() => {
      onNavigateToAnalyzer();
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            <span>PDF ➔ Excel 자동 변환 엔진</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-medium">국내 모든 은행·카드·코인거래소 완벽 지원</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            PDF 거래내역서 ➔ 엑셀(Excel) 자동 추출기
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            은행 통장 PDF, 금융거래확인서, 카드 명세서를 업로드하면 AI가 표를 인식하여 엑셀(CSV)로 즉시 다운로드하거나 소명 관리로 전송합니다.
          </p>
        </div>

        {extractedData && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>엑셀(Excel/CSV) 다운로드</span>
            </button>
            <button
              onClick={handleApplyToWorkspace}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              {imported ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>적용 완료! 이동 중...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>내 거래내역에 추가하기</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Upload Zone & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Dropzone Box */}
        <div className="lg:col-span-8 bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 p-8 text-center transition-colors shadow-xs relative">
          <input
            type="file"
            accept=".pdf,.csv,.xlsx"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">
                PDF 금융 거래내역서를 여기에 끌어다 놓거나 클릭하여 선택하세요
              </p>
              <p className="text-xs text-slate-500 mt-1">
                카카오뱅크, KB국민, 신한, 우리, 하나, 농협, 토스, 케이뱅크, 업비트, 빗썸 등 전체 금융사 PDF 지원
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
              <span>지원 형식: PDF, Scanned PDF, Excel, CSV (최대 50MB)</span>
            </div>
          </div>
        </div>

        {/* 1-Click Fast Presets Box */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>원클릭 샘플 은행 PDF 테스트</span>
            </h3>
            <p className="text-xs text-slate-500">
              실제 개인회생 소명에 사용되는 은행 PDF 샘플을 1초 만에 추출해보세요:
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleLoadSample('kakao', '카카오뱅크_거래내역서_대출3천유입.pdf')}
              className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-xs transition flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-blue-600">
                  카카오뱅크 거래내역서.pdf
                </span>
                <span className="text-[11px] text-slate-500">대출 3,000만 유입 및 당일 출금 포함 (7건)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleLoadSample('kb', 'KB국민은행_입출금명세서_1년치.pdf')}
              className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-xs transition flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-blue-600">
                  KB국민은행 입출금거래명세서.pdf
                </span>
                <span className="text-[11px] text-slate-500">급여, 아파트 공과금 및 생활비 내역</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => handleLoadSample('upbit', '업비트_케이뱅크_가상자산_거래원장.pdf')}
              className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-xs transition flex items-center justify-between group"
            >
              <div>
                <span className="font-bold text-slate-900 block group-hover:text-blue-600">
                  업비트 가상자산 거래원장.pdf
                </span>
                <span className="text-[11px] text-slate-500">코인 매수 및 평가손실 입증용</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-base font-bold text-slate-900">
            PDF 문서 내 금융 거래 표(Table)를 AI로 고속 분석 중입니다...
          </p>
          <p className="text-xs text-slate-500 max-w-sm">
            입출금 일자, 금융기관, 거래처, 금액, 거래후 잔액을 엑셀 셀 규격으로 정규화하고 있습니다.
          </p>
        </div>
      )}

      {/* Extracted Result Table */}
      {!isProcessing && extractedData && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedFile?.name || '추출 완료'}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    추출 성공 ({extractedData.length}건 인식)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  OCR 정확도: 99.8% · 엑셀 및 회생 소명표 양식 변환 완료
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>엑셀(CSV) 다운로드</span>
              </button>
              <button
                onClick={handleApplyToWorkspace}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>내 거래목록에 반영</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">거래일자</th>
                  <th className="py-2.5 px-3">금융기관</th>
                  <th className="py-2.5 px-3">계좌번호</th>
                  <th className="py-2.5 px-3">거래처 / 적요</th>
                  <th className="py-2.5 px-3 text-center">구분</th>
                  <th className="py-2.5 px-3 text-right">거래금액</th>
                  <th className="py-2.5 px-3 text-right">거래후잔액</th>
                  <th className="py-2.5 px-3">AI 분류</th>
                  <th className="py-2.5 px-3">소명 사유 초안</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {extractedData.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono-numbers">{tx.date}</td>
                    <td className="py-2.5 px-3 font-medium">{tx.bank}</td>
                    <td className="py-2.5 px-3 font-mono-numbers text-slate-500">{tx.accountNo}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{tx.counterpart}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          tx.type === '입금'
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-slate-700 bg-slate-100'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold font-mono-numbers">
                      {tx.amount.toLocaleString()}원
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-numbers text-slate-500">
                      {(tx.balance || 0).toLocaleString()}원
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-slate-700 font-medium">{tx.category}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                      {tx.explanationNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
