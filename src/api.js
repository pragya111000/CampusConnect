// One place for the backend address, so it is not typed in every component.
//
// By default we talk to the Flask backend running on your own computer.
// To use another address later (for example after deployment), create a file
// called .env in the project root (NOT inside backend/) with:
//
//     VITE_API_URL=https://your-backend-address
//
// Note: anything starting with VITE_ is visible in the browser, so never put
// passwords or API keys there. Secrets belong in backend/.env only.
export const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

// Read data from the backend (GET).
export async function apiGet(path) {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error("The server returned an error. Please try again.");
  }

  return response.json();
}

// Send data to the backend (POST).
// If the server says "no", we throw an Error that carries the server's message
// (and per-field messages in error.fieldErrors) so the screen can show them.
export async function apiPost(path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    // the server sent no JSON - keep data as {}
  }

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong. Please try again.");
    error.fieldErrors = data.errors || {};
    throw error;
  }

  return data;
}
