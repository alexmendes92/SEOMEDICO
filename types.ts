export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  VISION = 'VISION',
  LANGUAGE = 'LANGUAGE',
  BUSINESS = 'BUSINESS',
  MARKET = 'MARKET',
  TEST_LAB = 'TEST_LAB',
  SITE_AUDITOR = 'SITE_AUDITOR'
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  type?: 'text' | 'image' | 'chart';
  chartData?: any[];
  timestamp: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  category?: string;
}

export interface AnalysisResult {
  title: string;
  summary: string;
  details: string[];
  metrics?: { label: string; value: string }[];
}

// Enums for UI state
export enum ProcessingState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AuditReport {
  domain: string;
  overallScore: number;
  summary: string;
  resources: {
    title: string;
    score: number; // 0-100
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    details: string;
    recommendation: string;
  }[];
}
