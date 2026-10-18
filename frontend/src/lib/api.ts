import "server-only";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.EVHSS_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

export const AUTH_COOKIE_NAME = "evhss_token";

export type ApiErrorBody = {
  detail?: string;
  message?: string;
  error?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type LoginResponse = {
  access_token?: string;
  token?: string;
  token_type?: string;
  user?: ApiUser;
};

export type ApiUser = {
  id?: string;
  email?: string;
  organisation_id?: string;
  is_active?: boolean;
  first_name?: string | null;
  last_name?: string | null;
};

export type UserResponse = ApiUser & {
  id: string;
  email: string;
  organisation_id: string;
};

export type PublicBookingRequest = {
  type: "vet" | "spa" | string;
  owner_name: string;
  phone_number: string;
  pet_name: string;
  species?: string | null;
  breed?: string | null;
  reason: string;
  requested_datetime?: string | null;
  address?: string | null;
};

export type ApiPet = {
  id: string;
  client_id: string;
  name?: string | null;
  species?: string | null;
  breed?: string | null;
};

export type PetResponse = ApiPet;

export type ApiClient = {
  id: string;
  user_id?: string | null;
  phone_number?: string | null;
  address?: string | null;
  organisation_id?: string;
  users?: {
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
  } | null;
};

export type ClientResponse = ApiClient;

export type ApiAppointment = {
  id: string;
  client_id: string;
  pet_id: string;
  vet_id?: string | null;
  appointment_date?: string | null;
  status?: string | null;
  reason?: string | null;
  pets?: {
    name?: string | null;
    species?: string | null;
    breed?: string | null;
  } | null;
  clients?: ApiClient | null;
};

export type AppointmentResponse = ApiAppointment;

export type DashboardTrendPoint = {
  date: string;
  appointments?: number;
  revenue?: number | string;
  vet?: number;
  spa?: number;
};

export type DashboardActivity = {
  id: string;
  created_at?: string;
  event_type?: string;
  details?: string | null;
  reason?: string | null;
  pets?: {
    name?: string | null;
  } | null;
  clients?: {
    users?: {
      first_name?: string | null;
    } | null;
  } | null;
};

export type DashboardStats = {
  appointmentsToday: number;
  pendingRequests: number;
  totalPatients: number;
  systemStatus: string;
  trendData: Array<{ date: string; vet: number; spa: number }>;
  distributionData: Array<{ name: string; value: number }>;
  recentActivity: DashboardActivity[];
};

type ApiFetchOptions = RequestInit & {
  token?: string;
};

export async function getAuthToken() {
  return (await cookies()).get(AUTH_COOKIE_NAME)?.value;
}

function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL.replace(/\/$/, "")}/api/v1${normalizedPath}`;
}

async function parseError(res: Response) {
  try {
    const body = (await res.json()) as ApiErrorBody;
    return body.detail || body.message || body.error || res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { token, headers, ...init } = options;
  const resolvedToken = token === undefined ? await getAuthToken() : token;
  const res = await fetch(apiUrl(path), {
    ...init,
    cache: init.cache ?? "no-store",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(await parseError(res), res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

function listFromResponse<T>(response: T[] | { data?: T[] }) {
  return Array.isArray(response) ? response : response.data || [];
}

export async function login(email: string, password: string) {
  const response = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const token = response.access_token || response.token;
  if (!token) {
    throw new ApiError("Login response did not include an access token.", 502);
  }
  return { token, user: response.user };
}

export async function requestBooking(payload: PublicBookingRequest) {
  return apiFetch<{ message?: string; id?: string }>("/public/appointments/request", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAppointments(token: string) {
  const response = await apiFetch<ApiAppointment[] | { data?: ApiAppointment[] }>("/clinic/appointments", { token });
  return listFromResponse(response);
}

export async function getClients(token: string) {
  const response = await apiFetch<ApiClient[] | { data?: ApiClient[] }>("/crm/clients", { token });
  return listFromResponse(response);
}

export async function getPets(token: string) {
  const response = await apiFetch<ApiPet[] | { data?: ApiPet[] }>("/crm/pets", { token });
  return listFromResponse(response);
}

export async function createClient(
  token: string,
  payload: { user_id?: string; phone_number?: string; address?: string },
) {
  return apiFetch<ApiClient>("/crm/clients", { method: "POST", token, body: JSON.stringify(payload) });
}

export async function updateAppointment(token: string, id: string, status: string) {
  return apiFetch<ApiAppointment>(`/clinic/appointments/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });
}

export async function createAppointment(
  token: string,
  payload: {
    client_id: string;
    pet_id: string;
    appointment_date: string;
    reason: string;
    status: string;
    organisation_id?: string;
  },
) {
  return apiFetch<ApiAppointment>("/clinic/appointments", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser(token: string) {
  return apiFetch<UserResponse>("/auth/me", { token });
}

export type ApiMedicalRecord = {
  id: string;
  pet_id: string;
  vet_id: string;
  appointment_id?: string | null;
  notes?: string | null;
  created_at?: string;
};

export type ApiVaccination = {
  id: string;
  pet_id: string;
  vaccine_name: string;
  date_administered: string;
  next_due_date?: string | null;
};

export type ApiGroomingRecord = {
  id: string;
  pet_id: string;
  groomer_id: string;
  appointment_date?: string | null;
  services_provided?: string | null;
  groomer_notes?: string | null;
};

export type ApiInventoryItem = {
  id: string;
  name: string;
  sku?: string | null;
  stock_quantity: number | string;
  unit_price?: number | string | null;
};

export type ApiInvoice = {
  id: string;
  client_id: string;
  total_amount: number | string;
  status?: string | null;
  created_at?: string;
};

export type ApiPOSTransaction = {
  id: string;
  invoice_id?: string | null;
  amount_paid: number | string;
  payment_method?: string | null;
};

export type ApiStaffProfile = {
  id: string;
  user_id: string;
  job_title?: string | null;
  hire_date?: string | null;
};

export type ApiStaffSchedule = {
  id: string;
  staff_id: string;
  shift_start: string;
  shift_end: string;
};

export type ApiAuditLog = {
  id: string;
  user_id?: string | null;
  event_type: string;
  entity_name?: string | null;
  entity_id?: string | null;
  details?: string | null;
  created_at?: string;
};

export type ApiWhatsAppLog = {
  id: string;
  recipient_phone: string;
  message_content: string;
  status?: string | null;
  appointment_id?: string | null;
  created_at?: string;
};

export async function getMedicalRecords(token: string) {
  const response = await apiFetch<ApiMedicalRecord[] | { data?: ApiMedicalRecord[] }>("/clinic/medical-records", { token });
  return listFromResponse(response);
}

export async function createMedicalRecord(
  token: string,
  payload: { pet_id: string; vet_id: string; appointment_id?: string | null; notes?: string },
) {
  return apiFetch<ApiMedicalRecord>("/clinic/medical-records", { method: "POST", token, body: JSON.stringify(payload) });
}

export async function getVaccinations(token: string) {
  const response = await apiFetch<ApiVaccination[] | { data?: ApiVaccination[] }>("/clinic/vaccinations", { token });
  return listFromResponse(response);
}

export async function createVaccination(
  token: string,
  payload: { pet_id: string; vaccine_name: string; date_administered: string; next_due_date?: string | null },
) {
  return apiFetch<ApiVaccination>("/clinic/vaccinations", { method: "POST", token, body: JSON.stringify(payload) });
}

export async function getGroomingRecords(token: string) {
  const response = await apiFetch<ApiGroomingRecord[] | { data?: ApiGroomingRecord[] }>("/grooming/records", { token });
  return listFromResponse(response);
}

export async function createGroomingRecord(
  token: string,
  payload: {
    pet_id: string;
    groomer_id: string;
    appointment_date?: string | null;
    services_provided?: string;
    groomer_notes?: string;
  },
) {
  return apiFetch<ApiGroomingRecord>("/grooming/records", { method: "POST", token, body: JSON.stringify(payload) });
}

export async function getInventoryItems(token: string) {
  const response = await apiFetch<ApiInventoryItem[] | { data?: ApiInventoryItem[] }>("/inventory/items", { token });
  return listFromResponse(response);
}

export async function createInventoryItem(
  token: string,
  payload: { name: string; sku?: string; stock_quantity?: number; unit_price?: number },
) {
  return apiFetch<ApiInventoryItem>("/inventory/items", { method: "POST", token, body: JSON.stringify(payload) });
}

export async function updateInventoryItem(
  token: string,
  id: string,
  payload: Partial<{ name: string; sku: string; stock_quantity: number; unit_price: number }>,
) {
  return apiFetch<ApiInventoryItem>(`/inventory/items/${id}`, { method: "PATCH", token, body: JSON.stringify(payload) });
}

export async function getInvoices(token: string) {
  const response = await apiFetch<ApiInvoice[] | { data?: ApiInvoice[] }>("/billing/invoices", { token });
  return listFromResponse(response);
}

export async function createInvoice(
  token: string,
  payload: { client_id: string; total_amount: number; status?: string },
) {
  return apiFetch<ApiInvoice>("/billing/invoices", { method: "POST", token, body: JSON.stringify(payload) });
}

export async function processPOSTransaction(
  token: string,
  payload: { client_id: string; payment_method: string; items: Array<{ inventory_item_id: string; quantity: number }> },
) {
  return apiFetch<ApiPOSTransaction>("/billing/pos/transaction", { method: "POST", token, body: JSON.stringify(payload) });
}

export async function getStaffProfiles(token: string) {
  const response = await apiFetch<ApiStaffProfile[] | { data?: ApiStaffProfile[] }>("/hr/staff-profiles", { token });
  return listFromResponse(response);
}

export async function createStaffProfile(
  token: string,
  payload: { user_id: string; job_title?: string; hire_date?: string },
) {
  return apiFetch<ApiStaffProfile>("/hr/staff-profiles", { method: "POST", token, body: JSON.stringify(payload) });
}

export async function getStaffSchedules(token: string) {
  const response = await apiFetch<ApiStaffSchedule[] | { data?: ApiStaffSchedule[] }>("/hr/schedules", { token });
  return listFromResponse(response);
}

export async function createStaffSchedule(
  token: string,
  payload: { staff_id: string; shift_start: string; shift_end: string },
) {
  return apiFetch<ApiStaffSchedule>("/hr/schedules", { method: "POST", token, body: JSON.stringify(payload) });
}

export async function getAuditLogs(token: string) {
  const response = await apiFetch<ApiAuditLog[] | { data?: ApiAuditLog[] }>("/system/audit-logs", { token });
  return listFromResponse(response);
}

export async function getWhatsAppLogs(token: string) {
  const response = await apiFetch<ApiWhatsAppLog[] | { data?: ApiWhatsAppLog[] }>("/system/whatsapp-logs", { token });
  return listFromResponse(response);
}

export async function getDashboardStats(token: string): Promise<DashboardStats> {
  const raw = await apiFetch<Record<string, any>>("/system/dashboard-stats", { token });
  return normalizeDashboardStats(raw);
}

export function normalizeDashboardStats(raw: Record<string, any>): DashboardStats {
  const sevenDayTrend = raw.seven_day_trend || raw.trendData || [];
  const trendData = sevenDayTrend.map((point: DashboardTrendPoint) => {
    const appointments = Number(point.appointments ?? point.vet ?? 0);
    return {
      date: point.date,
      vet: Number(point.vet ?? appointments),
      spa: Number(point.spa ?? 0),
    };
  });

  const vetTotal = trendData.reduce((sum: number, point: { vet: number; spa: number }) => sum + point.vet, 0);
  const spaTotal = trendData.reduce((sum: number, point: { vet: number; spa: number }) => sum + point.spa, 0);

  return {
    appointmentsToday: Number(raw.appointmentsToday ?? raw.appointments_today ?? 0),
    pendingRequests: Number(raw.pendingRequests ?? raw.pending_requests ?? 0),
    totalPatients: Number(raw.totalPatients ?? raw.total_registered_pets ?? raw.total_pets ?? 0),
    systemStatus: raw.systemStatus || "Online",
    trendData,
    distributionData: raw.distributionData || [
      { name: "Veterinary", value: vetTotal },
      { name: "Shampooch", value: spaTotal },
    ],
    recentActivity: raw.recentActivity || raw.recent_activity || [],
  };
}
