import { api } from "./client";

export async function login(username: string, password: string) {
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);
  body.set("grant_type", "password");
  body.set("scope", "");
  body.set("client_id", "");
  body.set("client_secret", "");

  try {
    const { data } = await api.post("/auth/login", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    localStorage.setItem("access_token", data.access_token);
    return data;
  } catch (err: any) {
    // surface precise backend message
    const detail =
      err?.response?.data?.detail ??
      err?.response?.data?.message ??
      err?.message ??
      "Login failed";
    // rethrow with readable message
    throw new Error(
      typeof detail === "string" ? detail : JSON.stringify(detail)
    );
  }
}
