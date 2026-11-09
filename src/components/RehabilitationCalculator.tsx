import React, { useState } from 'react';
import { Calculator, ArrowRight, CheckCircle2, AlertCircle, Percent, DollarSign, Calendar } from 'lucide-react';

export const RehabilitationCalculator: React.FC = () => {
  // Input parameters
  const [monthlyIncome, setMonthlyIncome] = useState<number>(3200000);
  const [dependents, setDependents] = useState<number>(1);
  const [totalDebt, setTotalDebt] = useState<number>(85000000);
  const [liquidationValue, setLiquidationValue] = useState<number>(18000000);

  // 2026 Standard Korean Minimum Cost of Living (중위소득 60%)
  const LIVING_COST_TABLE: Record<number, number> = {
    1: 1387000,
    2: 2305000,
    3: 2945000,
    4: 3572000,
    5: 4166000,
  };

  const livingCost = LIVING_COST_TABLE[dependents] || LIVING_COST_TABLE[5];
  const monthlyAvailableIncome = Math.max(0, monthlyIncome - livingCost);

  // Standard 36 months vs Extension up to 60 months for liquidation guarantee
  let planMonths = 36;
  let totalPayment = monthlyAvailableIncome * planMonths;
  let liquidationSatisfied = totalPayment >= liquidationValue;

  if (!liquidationSatisfied && monthlyAvailableIncome > 0) {
    // If 36 months doesn't cover liquidation value, check up to 60 months
    const neededMonths = Math.ceil(liquidationValue / monthlyAvailableIncome);
    if (neededMonths <= 60) {
      planMonths = neededMonths;
      totalPayment = monthlyAvailableIncome * planMonths;
      liquidationSatisfied = true;
    } else {
      planMonths = 60;
      totalPayment = monthlyAvailableIncome * planMonths;
      liquidationSatisfied = false;
    }
  }

  const dischargeAmount = Math.max(0, totalDebt - totalPayment);
  const dischargeRate = totalDebt > 0 ? Math.min(100, Math.max(0, (dischargeAmount / totalDebt) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Calculator className="w-3.5 h-3.5 text-blue-600" />
          <span>2026년 기준 중위소득 60% 반영</span>
          <span aria-hidden="true">·</span>
          <span className="text-blue-600 font-medium">청산가치 보장의 원칙 자동 검증</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          개인회생 월 변제금 & 채무 탕감률 정밀 시뮬레이터
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          월 소득, 부양가족, 채무액 및 재산을 입력하면 법원 인가 기준에 맞춘 월 변제금과 탕감 예상액을 즉시 계산합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            신청인 소득 및 재산 정보 입력
          </h3>

          <div className="space-y-4 text-xs">
            {/* Monthly Income */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-700">월 평균 세후 소득</label>
                <span className="text-blue-600 font-bold font-mono-numbers">
                  {monthlyIncome.toLocaleString()}원
                </span>
              </div>
              <input
                type="range"
                min={1500000}
                max={8000000}
                step={100000}
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>150만</span>
                <span>320만 (기본값)</span>
                <span>800만</span>
              </div>
            </div>

            {/* Dependents */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                부양가족 수 (본인 포함)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setDependents(cnt)}
                    className={`py-2 rounded-lg font-medium text-xs transition ${
                      dependents === cnt
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cnt}인 가구
                  </button>
                ))}
              </div>
              <div className="mt-2 p-2.5 bg-slate-50 rounded-lg text-slate-600 flex justify-between">
                <span>2026 법정 인정 생계비:</span>
                <span className="font-bold text-slate-900 font-mono-numbers">
                  {livingCost.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Total Debt */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-700">총 채무액 (원금 + 이자)</label>
                <span className="text-slate-900 font-bold font-mono-numbers">
                  {totalDebt.toLocaleString()}원
                </span>
              </div>
              <input
                type="range"
                min={10000000}
                max={300000000}
                step={5000000}
                value={totalDebt}
                onChange={(e) => setTotalDebt(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>1,000만</span>
                <span>8,500만</span>
                <span>3억</span>
              </div>
            </div>

            {/* Liquidation Value (Property) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-700">
                  신청인 보유 재산 (청산가치)
                </label>
                <span className="text-slate-900 font-bold font-mono-numbers">
                  {liquidationValue.toLocaleString()}원
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100000000}
                step={1000000}
                value={liquidationValue}
                onChange={(e) => setLiquidationValue(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                * 전세보증금 중 압류금지(서울 5,500만) 제외분 + 차량 + 예금 등
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Results & Visualization */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Result Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-blue-400 font-medium">개인회생 인가 예상 결과</span>
                <h3 className="text-xl font-bold text-white mt-0.5">변제계획안 분석</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">원금 탕감률</span>
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 font-mono-numbers">
                  {dischargeRate.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 block mb-1">예상 월 변제금</span>
                <span className="text-xl font-bold text-white font-mono-numbers">
                  {monthlyAvailableIncome.toLocaleString()}원
                </span>
                <span className="text-[11px] text-blue-400 block mt-1">가용소득 전액 투입</span>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 block mb-1">변제 기간</span>
                <span className="text-xl font-bold text-white font-mono-numbers">
                  {planMonths}개월
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {planMonths === 36 ? '원칙적 3년 변제' : '청산가치 보장 연장'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-400 block mb-1">총 탕감 예정액</span>
                <span className="text-xl font-bold text-emerald-400 font-mono-numbers">
                  {dischargeAmount.toLocaleString()}원
                </span>
                <span className="text-[11px] text-emerald-300 block mt-1">채권자 강제 면책</span>
              </div>
            </div>

            {/* Principle of Liquidation Value Guarantee Check */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
                liquidationSatisfied
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                  : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
              }`}
            >
              {liquidationSatisfied ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="block text-sm font-semibold mb-1">
                  {liquidationSatisfied
                    ? '청산가치 보장의 원칙 충족'
                    : '청산가치 보장 추가 소명 필요'}
                </strong>
                <p className="leading-relaxed opacity-90">
                  {liquidationSatisfied
                    ? `총 변제액(${totalPayment.toLocaleString()}원)이 신청인의 청산가치(${liquidationValue.toLocaleString()}원)를 초과하여 법원 인가 요건을 완전히 만족합니다.`
                    : `총 변제액이 청산가치에 미달할 위험이 있습니다. 배우자 재산 분할 비율을 낮추거나 추가 소명자료(손실금 제408호 적용)를 통해 청산가치를 낮추어야 합니다.`}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Calculations breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <h4 className="font-bold text-slate-900">산출 상세 명세서</h4>
            <div className="space-y-2 text-slate-600 divide-y divide-slate-100">
              <div className="flex justify-between py-1.5">
                <span>월 소득 - 최저생계비 ({dependents}인 가구)</span>
                <span className="font-mono-numbers font-medium text-slate-900">
                  {monthlyIncome.toLocaleString()} - {livingCost.toLocaleString()} = {monthlyAvailableIncome.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>총 변제금 ({planMonths}개월간 누적 변제액)</span>
                <span className="font-mono-numbers font-medium text-blue-600">
                  {totalPayment.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>이자 탕감률 (법원 개시결정 시 이자 100% 면책)</span>
                <span className="font-mono-numbers font-bold text-emerald-600">100.0% 면책</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>원금 탕감률 (총 채무 대비 순수 탕감 비율)</span>
                <span className="font-mono-numbers font-bold text-emerald-600">
                  {dischargeRate.toFixed(1)}% ({dischargeAmount.toLocaleString()}원 탕감)
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
