/**
 * GemmaService — HTTP client for the local Gemma 2 9B FastAPI server.
 *
 * This service acts as the bridge between the React Native mobile app
 * and the locally running Gemma model. All AI analysis flows through
 * this service.
 *
 * Architecture:
 *   Mobile App → GemmaService (HTTP) → FastAPI Server → mlx-lm (Gemma 2 9B)
 */

import { GEMMA_CONFIG } from '@/config/gemma';

// ─── Types ─────────────────────────────────────────────────────────────

export interface WaterQualityAnalysis {
  overallQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'unsafe';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  issues: string[];
  recommendations: string[];
  anomalyScore: number;
  riskPrediction: {
    outbreakRisk: number;
    contaminationRisk: number;
    seasonalRisk: number;
  };
  parameterAnalysis?: Array<{
    parameter: string;
    value: number;
    status: string;
    explanation: string;
  }>;
}

export interface SymptomAnalysis {
  extractedSymptoms: string[];
  suggestedSeverity: 'low' | 'medium' | 'high' | 'critical';
  possibleConditions: Array<{
    condition: string;
    likelihood: string;
    reasoning: string;
  }>;
  recommendations: string[];
  followUpRequired: boolean;
  followUpTimeframe: string;
  referralNeeded: boolean;
  referralType: string;
  alertTrigger: boolean;
  alertReason: string;
}

export interface DashboardNarrative {
  trendAnalysis: string;
  riskAssessment: string;
  keyFindings: string[];
  computedStats: {
    totalReports: number;
    activeOutbreaks: number;
    criticalCases: number;
    avgResponseTime: string;
    topSymptoms: string[];
    hotspotAreas: string[];
  };
  predictiveInsights: {
    expectedTrend: string;
    riskAreas: string[];
    seasonalWarning: string;
  };
  actionItems: string[];
}

export interface FieldSummary {
  summary: string;
  stats: {
    totalVisits: number;
    completedVisits: number;
    pendingVisits: number;
    householdsSurveyed: number;
    symptomsReported: number;
  };
  priorityItems: Array<{
    title: string;
    urgency: string;
    description: string;
    action: string;
  }>;
  patterns: string[];
  recommendations: string[];
}

export interface OutbreakDetection {
  outbreakRisk: number;
  alerts: Array<{
    title: string;
    message: string;
    severity: string;
    type: string;
    location: {
      district: string;
      block: string;
      village: string;
    };
    isActionRequired: boolean;
    recommendedAction: string;
  }>;
  clusters: Array<{
    symptoms: string[];
    location: string;
    caseCount: number;
    possibleCause: string;
    confidence: number;
  }>;
  correlations: string[];
  earlyWarnings: string[];
}

// ─── Service ───────────────────────────────────────────────────────────

class GemmaServiceClass {
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;

  constructor() {
    this.baseUrl = GEMMA_CONFIG.baseUrl;
    this.timeout = GEMMA_CONFIG.timeout;
    this.maxRetries = GEMMA_CONFIG.maxRetries;
    this.retryDelay = GEMMA_CONFIG.retryDelay;
  }

  /**
   * Check if the Gemma server is reachable.
   */
  async isAvailable(): Promise<boolean> {
    if (!GEMMA_CONFIG.enabled) return false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.baseUrl}/api/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Make a request to the Gemma server with retry logic.
   */
  private async request<T>(endpoint: string, body: any): Promise<T | null> {
    if (!GEMMA_CONFIG.enabled) return null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`Gemma server returned ${response.status}`);
          return null;
        }

        const data = await response.json();
        return data.analysis as T;
      } catch (error) {
        console.warn(
          `Gemma request failed (attempt ${attempt + 1}/${this.maxRetries + 1}):`,
          error
        );

        if (attempt < this.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    console.warn('Gemma server unreachable — falling back to local logic');
    return null;
  }

  // ─── Public API ────────────────────────────────────────────────────

  /**
   * Analyze water quality parameters.
   * Called by: water-quality.tsx / waterQualitySlice.ts
   */
  async analyzeWaterQuality(
    parameters: Record<string, number>,
    sourceType: string,
    location: string
  ): Promise<WaterQualityAnalysis | null> {
    return this.request<WaterQualityAnalysis>('/api/analyze/water-quality', {
      parameters,
      source_type: sourceType,
      location,
    });
  }

  /**
   * Analyze health symptoms and generate assessment.
   * Called by: report.tsx / healthDataSlice.ts
   */
  async analyzeSymptoms(
    symptoms: string[],
    severity: string,
    description: string,
    reporterName: string = 'Unknown',
    reporterRole: string = 'villager',
    location: string = 'Unknown'
  ): Promise<SymptomAnalysis | null> {
    return this.request<SymptomAnalysis>('/api/analyze/symptoms', {
      symptoms,
      severity,
      description,
      reporter_name: reporterName,
      reporter_role: reporterRole,
      location,
    });
  }

  /**
   * Generate dashboard narrative and trend analysis.
   * Called by: dashboard.tsx
   */
  async generateDashboardNarrative(
    reports: any[],
    outbreaks: any[],
    timeRange: string = '7d'
  ): Promise<DashboardNarrative | null> {
    return this.request<DashboardNarrative>('/api/generate/dashboard-narrative', {
      reports,
      outbreaks,
      time_range: timeRange,
    });
  }

  /**
   * Summarize field data activities.
   * Called by: fielddata.tsx
   */
  async summarizeFieldData(
    activities: any[],
    workerName: string,
    workerRole: string = 'asha_worker',
    date: string = '',
    location: string = 'Unknown',
    collectedData: any[] = []
  ): Promise<FieldSummary | null> {
    return this.request<FieldSummary>('/api/generate/field-summary', {
      activities,
      worker_name: workerName,
      worker_role: workerRole,
      date,
      location,
      collected_data: collectedData,
    });
  }

  /**
   * Detect outbreak patterns from health and water data.
   * Called by: alertsSlice.ts
   */
  async detectOutbreakPatterns(
    healthReports: any[],
    waterReadings: any[],
    region: string = 'Assam',
    season: string = ''
  ): Promise<OutbreakDetection | null> {
    return this.request<OutbreakDetection>('/api/detect/outbreak', {
      health_reports: healthReports,
      water_readings: waterReadings,
      region,
      season,
    });
  }
}

// Export singleton instance
export const GemmaService = new GemmaServiceClass();
