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

// common headers jo token bhejte hain
export function authHeaders(withJson = true) {
  const headers = {
    "Authorization": getToken()
  };
  if (withJson) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}