const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getErrorMessage(data, response) {
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (response.status === 401) return "Your session has expired. Please log in again.";
  if (response.status === 403) return "You do not have permission to perform this action.";
  if (response.status === 404) return "The requested API endpoint was not found.";
  if (response.status >= 500) return "The server failed to complete the request. Please try again.";
  return `Request failed with status ${response.status}.`;
}

export async function api(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = `${API_URL}${path}`;
  const method = options.method || "GET";
  const body = options.body ? JSON.stringify(options.body) : undefined;

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      body,
    });
  } catch (networkError) {
    throw new Error(
      `Unable to reach the server at ${API_URL}. Please check that the backend is running and CORS allows this frontend.`
    );
  }

  const rawText = await response.text();
  let data = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch (parseError) {
    // Response was not valid JSON
  }

  if (!response.ok) {
    const error = new Error(getErrorMessage(data, response));
    Object.keys(data).forEach(key => {
      if (key !== 'message') {
        error[key] = data[key];
      }
    });
    error.status = response.status;
    error.response = data;
    error.rawResponse = rawText;
    throw error;
  }
  return data;
}

export function saveSession(data) {
  localStorage.setItem("vyora_session", JSON.stringify({ token: data.token, user: data.user }));
}

export function getSession() {
  try {
    const saved = localStorage.getItem("vyora_session");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function getToken() {
  const session = getSession();
  return session?.token || null;
}

export function getUser() {
  const session = getSession();
  return session?.user || null;
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem("vyora_session");
  window.location.href = "/login";
}
