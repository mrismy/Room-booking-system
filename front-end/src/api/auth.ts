import { AuthRequest, AuthResponse } from "../types/types";

const BASE_URL = "http://localhost:8080/api/auth";

export const login = async (data: AuthRequest): Promise<AuthResponse> => {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
};

export const register = async (data: AuthRequest): Promise<string> => {
    const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Registration failed");
    }
    return res.text();
};

export const refreshToken = async (token: string): Promise<AuthResponse> => {
    const res = await fetch(`${BASE_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token }),
    });
    if (!res.ok) throw new Error("Token refresh failed");
    return res.json();
};
