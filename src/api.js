export const BASE_URL = "http://localhost:8080";

export function getToken() {
  return localStorage.getItem("token");
}

export function getUserId() {
  return localStorage.getItem("userId");
}

export function isLoggedIn() {
  return !!getUserId();
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
}

export function authHeaders(withJson = true) {
  const headers = {
    "Authorization": getToken()
  };
  if (withJson) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

// turns 1500 into "1,500" for nicer price display
export function formatPrice(value) {
  return Number(value).toLocaleString("en-IN");
}