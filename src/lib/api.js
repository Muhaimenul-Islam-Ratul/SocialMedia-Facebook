const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const ACCESS_TOKEN_KEY = 'socialfeed.accessToken';

let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
let refreshPromise = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token;
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function clearAccessToken() {
  setAccessToken(null);
}

async function doRefresh() {
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    clearAccessToken();
    const error = new Error('Session expired');
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  setAccessToken(data.accessToken);
  return data.accessToken;
}

async function ensureRefreshedToken() {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function apiFetch(path, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    skipAuthRefresh = false,
    isFormData = false,
  } = options;

  const requestHeaders = { ...headers };
  if (!isFormData) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  if (accessToken) {
    requestHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: requestHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  if (response.status === 401 && !skipAuthRefresh) {
    await ensureRefreshedToken();
    return apiFetch(path, { ...options, skipAuthRefresh: true });
  }

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const errorPayload = await response.json();
      message = errorPayload.message || message;
    } catch {
      message = response.statusText || message;
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
