import api from "./api";

export type QuoteStatus = "pending" | "accepted" | "declined" | "expired";

export interface Quote {
  id: number;
  job_id: number;
  tradesperson_id: number;
  amount: number;
  scope_notes: string | null;
  timeline_days: number | null;
  inclusions: string[];
  exclusions: string[];
  terms: string | null;
  status: QuoteStatus;
  customer_message: string | null;
  created_at: string;
}

export async function getMyQuotes(): Promise<Quote[]> {
  const { data } = await api.get<Quote[]>("/quotes/my");
  return data;
}

export async function getJobQuotes(jobId: number): Promise<Quote[]> {
  const { data } = await api.get<Quote[]>(`/quotes/job/${jobId}`);
  return data;
}

export async function respondToQuote(
  quoteId: number,
  status: "accepted" | "declined",
  message?: string
): Promise<Quote> {
  const { data } = await api.patch<Quote>(`/quotes/${quoteId}/respond`, {
    status,
    customer_message: message,
  });
  return data;
}
