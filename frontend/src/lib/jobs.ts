import api from "./api";

export type JobStatus = "open" | "quoted" | "hired" | "completed" | "cancelled";
export type JobUrgency = "standard" | "urgent" | "flexible";

export interface Job {
  id: number;
  customer_id: number;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  budget_min: number | null;
  budget_max: number | null;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  preferred_date: string | null;
  urgency: JobUrgency;
  status: JobStatus;
  image_urls: string[];
  created_at: string;
}

export interface JobListOut {
  items: Job[];
  total: number;
  page: number;
  size: number;
}

export async function getMyJobs(page = 1, size = 10): Promise<JobListOut> {
  const { data } = await api.get<JobListOut>("/jobs/my", { params: { page, size } });
  return data;
}

export async function getOpenJobs(params?: {
  category?: string;
  suburb?: string;
  page?: number;
  size?: number;
}): Promise<JobListOut> {
  const { data } = await api.get<JobListOut>("/jobs", {
    params: { status: "open", ...params },
  });
  return data;
}

export async function getJob(id: number): Promise<Job> {
  const { data } = await api.get<Job>(`/jobs/${id}`);
  return data;
}
