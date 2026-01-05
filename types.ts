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
  doctorName: string;
  specialty: string;
  overallHealth: number; // 0-100
  clinicalSummary: string;
  
  // SEÇÃO 1: A TRIAGEM
  triage: {
    score: number;
    status: 'CRITICAL' | 'STABLE' | 'HEALTHY';
    diagnosis: string; // Metaphorical description (e.g., "Joint Stiffness")
    details: string;
  };

  // SEÇÃO 2: EXAME DE IMAGEM
  imaging: {
    score: number;
    status: 'AMATEUR' | 'PROFESSIONAL' | 'AUTHORITY';
    observation: string; // Analysis of visual trust
    detectedTags: string[]; // e.g., "Generic", "Doctor"
  };

  // SEÇÃO 3: COMPETITIVIDADE (Raio-X)
  marketXray: {
    competitorComparison: string; // "Dr. X is taking your patients"
    lostTerritory: string; // Description of market share loss
  };

  // SEÇÃO 4: A PRESCRIÇÃO
  prescription: {
    immediateAction: string;
    adHeadlines: string[];
    prognosis: string; // Final impact phrase
  };
}