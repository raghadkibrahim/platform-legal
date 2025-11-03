import { api } from "./client";

export type CasePayload = { title: string; reference?: string; notes?: string; };
export type CaseRead = { id: number; title: string; reference?: string | null; notes?: string | null; };

export async function listCases(): Promise<CaseRead[]> {
  const { data } = await api.get("/cases");
  return data;
}
export async function getCase(id: number): Promise<CaseRead> {
  const { data } = await api.get(`/cases/${id}`);
  return data;
}
export async function createCase(payload: CasePayload): Promise<CaseRead> {
  const { data } = await api.post("/cases", payload);
  return data;
}
export async function updateCase(id: number, payload: CasePayload): Promise<CaseRead> {
  const { data } = await api.put(`/cases/${id}`, payload);
  return data;
}
export async function deleteCase(id: number): Promise<void> {
  await api.delete(`/cases/${id}`);
}
