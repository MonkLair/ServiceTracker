

export type ServiceStatus = 'up' | 'down' | 'degraded'
export interface Check {
  id: string;
  ts: number;
  status: ServiceStatus;
  responseMs: number | null;
  httpStatus: number | null;
  error?: string;
}