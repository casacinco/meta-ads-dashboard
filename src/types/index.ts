export interface KPIs {
  valorUsado: number;
  alcance: number;
  ctr: number;
  cpm: number;
  frequencia: number;
}

export interface TimeseriesPoint {
  date: string;
  valorUsado: number;
}

export interface Campaign {
  campaignId: string;
  campaignName: string;
  valorUsado: number;
  alcance: number;
  cpm: number;
  ctr: number;
  resultados: number;
  custoPorResultado: number;
  conversoes: number;
  receita: number;
}

export interface Ad {
  adId: string;
  adName: string;
  valorUsado: number;
  alcance: number;
  cpm: number;
  ctr: number;
  impressions: number;
  resultados: number;
  custoPorResultado: number;
  conversoes: number;
  receita: number;
}

export interface AccountInfo {
  name: string;
  accountId: string;
  currency: string;
  timezone: string;
}

export interface FinanceiroMonth {
  monthStart: string;
  spend: number;
  tax: number;
  total: number;
}

export interface FinanceiroData {
  account: AccountInfo;
  months: FinanceiroMonth[];
  updatedAt: string;
}

export type TimeWindow = 'today' | 'yesterday' | '7d' | '14d' | '30d' | 'this_month' | 'last_month';
