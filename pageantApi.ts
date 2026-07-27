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
  // return data as T;
  return (data && typeof data === "object" && "data" in data ? data.data : data) as T;
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
  userId: string;
  createdAt: string;
  __v: number;
  isActive: boolean;
};

export type VotePackage = { name: string; numberOfVotes: number; price: number; currency: string };

export type RegistrationSettings = {
  requirePaymentBeforeRegistration: boolean;
  registrationFee: number;
  registrationEnabled: boolean;
};

type Category = "Miss" | "Mister" | "Teen";
type ContestantStatus = "pending" | "approved" | "rejected";
type PaymentStatus = "paid" | "not_required" | "pending";

interface SocialMedia {
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
}

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  photo: string | null;
  bio: string;
  category: Category;
  paymentStatus: PaymentStatus;
  contestantStatus: ContestantStatus;
  transactionReference: string;
  approvedAt: string | null; // ISO date string, or null if not yet approved
  rejectedAt: string | null; // ISO date string, or null if not rejected
  registeredAt: string; // ISO date string
  __v: number;
  socialMedia: SocialMedia;
}

// export type AdminUser = {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   age?: number;
//   category?: string;
//   bio?: string;
//   status?: string;
//   paymentStatus?: string;
//   adminNotes?: string;
//   createdAt?: string;
// };

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

// ---------- Results ----------
export type ResultCandidate = {
  name: string;
  votes: number;
  photo: string;
  bio: string;
  age: number;
  candidateId: string;
  rank: number;
  isWinner: boolean;
};

export type CategoryResult = {
  _id: Category; // category name, e.g. "Face of Eminent"
  candidates: ResultCandidate[];
  totalVotes: number;
};

export type ResultsResponse = {
  results: CategoryResult[];
};

// ---------- Public ----------
export const Public = {
  candidates: () => api<{ candidates: Candidate[] }>("/candidates"),
  candidatesByCategory: (category: string) => api<{ candidates: Candidate[] }>(`/candidates/category/${encodeURIComponent(category)}`),
  candidate: (id: string) => api<{ candidate: Candidate }>(`/candidates/${id}`),
  results: () => api<ResultsResponse>("/votes/results"),
  statistics: () => api<{ statistics: any }>("/votes/statistics"),
  packages: () => api<{ packages: VotePackage[] }>("/payments/packages"),
  initVote: (body: { fullName: string; email: string; phone: string; candidateId: string; numberOfVotes: number; paymentMethod: string }) =>
    api<{ data: { authorization_url: string; reference: string } }>("/payments/initialize", { body }),
  verifyVote: (reference: string) => api<{ data: any }>("/payments/verify", { query: { reference } }),
  registrationSettings: () => api<RegistrationSettings>("/users/registration/settings"),
  initRegistration: (body: { fullName: string; email: string; phone: string; paymentMethod: string }) =>
    api<{ data: { authorization_url: string; reference: string } }>("/payments/registration/initialize", { body }),
  verifyRegistration: (reference: string) => api<{ data: any }>("/payments/registration/verify", { query: { reference } }),
  register: (body: { name: string; email: string; phone: string; age: number; category: string; bio: string; socialMedia?: any; transactionReference?: string }) =>
    api<{ user: AdminUser }>("/users/register", { body }),
  user: (id: string) => api<{ user: AdminUser }>(`/users/${id}`),
  contact: (body: { name: string; email: string; subject: ContactSubject; message: string }) =>
    api<{ success: boolean; message: string }>("/users/contact", { body }),
  quote: (body: { name: string; email: string; phone: string; service: QuoteService; message: string }) =>
    api<{ success: boolean; message: string }>("/users/quote", { body }),
};

export type ContactSubject =
  | "Booking / Quote"
  | "Press / Media"
  | "Modeling Academy"
  | "Pageant enquiry"
  | "Partnerships"
  | "Other";

export type QuoteService =
  | "Videography & Film"
  | "Editorial & Cover Features"
  | "Branding & Printing"
  | "PR & Advertising"
  | "Pageant Production"
  | "Ushering & Talent";

export type MessageStatus = "new" | "read" | "replied" | "archived";
export type QuoteStatus = "new" | "read" | "quoted" | "archived";

export type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
  status: MessageStatus;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type QuoteRequest = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: QuoteService;
  message: string;
  status: QuoteStatus;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
};

// ---------- Admin ----------
export const Admin = {
  login: (email: string, password: string) => api<{ token: string; admin?: any }>("/admin/login", { body: { email, password } }),
  stats: () => api<{ users: any; votes: any; revenue: any; topCandidates: any[] }>("/admin/stats"),
  getSettings: () => api<{ settings: any }>("/admin/settings"),
  updateSettings: (settings: any) => api<{ settings: any }>("/admin/settings", { method: "PUT", body: settings }),
  users: (q: { status?: string; paymentStatus?: string; category?: string; search?: string } = {}) =>
    api<AdminUser[]>("/admin/users", { query: q }),
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

  // Contact messages
  messages: (q: { status?: MessageStatus; subject?: string; search?: string } = {}) =>
    api<{ messages: ContactMessage[] }>("/admin/messages", { query: q as any }),
  message: (id: string) => api<{ message: ContactMessage }>(`/admin/messages/${id}`),
  updateMessage: (id: string, body: { status?: MessageStatus; adminNotes?: string }) =>
    api<{ message: ContactMessage }>(`/admin/messages/${id}`, { method: "PUT", body }),
  deleteMessage: (id: string) => api<{ success: boolean }>(`/admin/messages/${id}`, { method: "DELETE" }),

  // Quote requests
  quotes: (q: { status?: QuoteStatus; service?: string } = {}) =>
    api<{ quotes: QuoteRequest[] }>("/admin/quotes", { query: q as any }),
  quote: (id: string) => api<{ quote: QuoteRequest }>(`/admin/quotes/${id}`),
  updateQuote: (id: string, body: { status?: QuoteStatus; adminNotes?: string }) =>
    api<{ quote: QuoteRequest }>(`/admin/quotes/${id}`, { method: "PUT", body }),
  deleteQuote: (id: string) => api<{ success: boolean }>(`/admin/quotes/${id}`, { method: "DELETE" }),
};

