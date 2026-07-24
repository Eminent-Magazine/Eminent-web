// Client for the Pageant Voting API, routed through our same-origin proxy
// at /api/public/pageant/* to avoid CORS restrictions.

const BASE = "/api/public/pageant";
const TOKEN_KEY = "pageant_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
export function setAdminToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}
export function clearAdminToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

type Opts = { method?: string; body?: unknown; query?: Record<string, string | number | undefined>; form?: FormData };

export async function api<T = any>(path: string, opts: Opts = {}): Promise<T> {
  const qs = opts.query
    ? "?" +
    Object.entries(opts.query)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join("&")
    : "";
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = getAdminToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (opts.form) {
    body = opts.form;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(`${BASE}${path}${qs}`, { method: opts.method ?? (body ? "POST" : "GET"), headers, body });
  const ct = res.headers.get("content-type") ?? "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    if (res.status === 401) clearAdminToken();
    const msg = (data && typeof data === "object" && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(String(msg));
  }
  return data as T;
}

// ---------- Types ----------
export type Candidate = {
  _id: string;
  name: string;
  age?: number;
  photo?: string;
  bio?: string;
  category?: string;
  votes?: number;
};

export type VotePackage = { name: string; numberOfVotes: number; price: number; currency: string };

export type RegistrationSettings = {
  requirePaymentBeforeRegistration: boolean;
  registrationFee: number;
  registrationEnabled: boolean;
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  category?: string;
  bio?: string;
  status?: string;
  paymentStatus?: string;
  adminNotes?: string;
  createdAt?: string;
};

export type Transaction = {
  _id?: string;
  reference: string;
  email?: string;
  fullName?: string;
  phone?: string;
  amount?: number;
  numberOfVotes?: number;
  status?: string;
  candidateId?: string | { _id: string; name: string };
  type?: string;
  createdAt?: string;
};

// ---------- Public ----------
export const Public = {
  candidates: () => api<{ candidates: Candidate[] }>("/candidates"),
  candidatesByCategory: (category: string) => api<{ candidates: Candidate[] }>(`/candidates/category/${encodeURIComponent(category)}`),
  candidate: (id: string) => api<{ candidate: Candidate }>(`/candidates/${id}`),
  results: () => api<{ results: any[] }>("/votes/results"),
  statistics: () => api<{ statistics: any }>("/votes/statistics"),
  packages: () => api<{ packages: VotePackage[] }>("/payments/packages"),
  initVote: (body: { fullName: string; email: string; phone: string; candidateId: string; numberOfVotes: number; paymentMethod: string }) =>
    api<{ data: { authorization_url: string; reference: string } }>("/payments/initialize", { body }),
  verifyVote: (reference: string) => api<{ data: any }>("/payments/verify", { query: { reference } }),
  registrationSettings: () => api<{ data: RegistrationSettings }>("/users/registration/settings"),
  initRegistration: (body: { fullName: string; email: string; phone: string; paymentMethod: string }) =>
    api<{ data: { authorization_url: string; reference: string } }>("/payments/registration/initialize", { body }),
  verifyRegistration: (reference: string) => api<{ data: any }>("/payments/registration/verify", { query: { reference } }),
  register: (body: { name: string; email: string; phone: string; age: number; category: string; bio: string; socialMedia?: any; transactionReference?: string }) =>
    api<{ user: AdminUser }>("/users/register", { body }),
  user: (id: string) => api<{ user: AdminUser }>(`/users/${id}`),
};

// ---------- Admin ----------
export const Admin = {
  login: (email: string, password: string) => api<{ token: string; admin?: any }>("/admin/login", { body: { email, password } }),
  stats: () => api<{ stats: any }>("/admin/stats"),
  getSettings: () => api<{ settings: any }>("/admin/settings"),
  updateSettings: (settings: any) => api<{ settings: any }>("/admin/settings", { method: "PUT", body: settings }),
  users: (q: { status?: string; paymentStatus?: string; category?: string; search?: string } = {}) =>
    api<{ users: AdminUser[] }>("/admin/users", { query: q }),
  user: (id: string) => api<{ user: AdminUser }>(`/admin/users/${id}`),
  updateUser: (id: string, body: any) => api<{ user: AdminUser }>(`/admin/users/${id}`, { method: "PUT", body }),
  deleteUser: (id: string) => api<{ success: boolean }>(`/admin/users/${id}`, { method: "DELETE" }),
  approveUser: (id: string) => api<{ user: AdminUser }>(`/admin/users/${id}/approve`, { method: "POST", body: {} }),
  rejectUser: (id: string, adminNotes: string) => api<{ user: AdminUser }>(`/admin/users/${id}/reject`, { method: "POST", body: { adminNotes } }),
  bulkUpload: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api<{ success: boolean; imported?: number; errors?: any[] }>("/admin/users/bulk-upload", { method: "POST", form: fd });
  },
  addVotes: (candidateId: string, votes: number, reason: string) =>
    api<{ candidate: Candidate }>("/admin/votes/add", { body: { candidateId, votes, reason } }),
  transactions: () => api<{ transactions: Transaction[] }>("/payments/transactions"),
  transaction: (reference: string) => api<{ transaction: Transaction }>(`/payments/transaction/${encodeURIComponent(reference)}`),
  candidates: () => Public.candidates(),
  createCandidate: (body: { name: string; age: number; photo: string; bio: string; category: string }) =>
    api<{ candidate: Candidate }>("/candidates", { body }),
  updateCandidate: (id: string, body: any) => api<{ candidate: Candidate }>(`/candidates/${id}`, { method: "PUT", body }),
  deleteCandidate: (id: string) => api<{ success: boolean }>(`/candidates/${id}`, { method: "DELETE" }),
};
