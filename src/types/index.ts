export interface Transaction {
  id: string;
  date: string;
  bank: string;
  accountNo: string;
  counterpart: string;
  type: '입금' | '출금';
  amount: number;
  balance: number;
  category: '대출금유입' | '생활비' | '계좌간이체' | '가상자산/주식' | '채무상환' | '고액현금출금' | '급여' | '기타';
  memo: string;
  needsExplanation: boolean;
  explanationNote: string;
  riskLevel: 'low' | 'medium' | 'high';
  supportingDocRequired?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'lawyer' | 'guest';
  firmName?: string;
  caseNumber?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface CorrectionAnalysis {
  courtDemandSummary: string;
  requiredDocuments: string[];
  responseStrategy: string;
  draftResponse: string;
}

export interface BatchAnalysisResult {
  summary: string;
  highRiskItems: {
    id: string;
    riskType: string;
    issue: string;
    recommendedVindication: string;
  }[];
  liquidationValueEstimate: string;
  courtAdvice: string;
}
