export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
export const BACKEND_URL = API_URL.replace("/api", "");

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function getXsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return null;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Don't set Content-Type for FormData (browser sets boundary automatically)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const xsrf = getXsrfToken();
  if (xsrf) {
    headers["X-XSRF-TOKEN"] = xsrf;
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    
    // Make messages user-friendly
    let friendlyMessage = body.message || res.statusText;
    if (res.status === 419 || friendlyMessage.includes("CSRF")) {
      friendlyMessage = "Your session expired. Please try again.";
    } else if (res.status === 401) {
      friendlyMessage = "Incorrect email or password.";
    } else if (res.status === 500) {
      friendlyMessage = "Something went wrong on our end. Please try again later.";
    }

    const err: ApiError = {
      message: friendlyMessage,
      errors: body.errors,
      status: res.status,
    };
    throw err;
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
};

/* ─── Type definitions matching backend API resources ─── */

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  type: string;
  base_price: number;
  price_range: string | null;
  stock: number;
  available: number;
  featured_image: string | null;
  is_active: boolean;
  average_rating: number;
  category: Category | null;
  variants: ProductVariant[];
  reviews: Review[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  products_count?: number;
}

export interface ProductVariant {
  id: number;
  name: string;
  price: number;
  stock: number;
  reserved: number;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  user: { id: number; name: string };
  created_at: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  unit_price: number;
  product: Product;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}

export interface Order {
  id: number;
  reference: string;
  status: string;
  total: number;
  items: unknown[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface AuthResponse {
  user: { id: number; name: string; email: string };
  token: string;
}
