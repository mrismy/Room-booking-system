import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, refreshToken as refreshTokenApi } from '../api/auth';
import { AuthRequest } from '../types/types';

interface AuthContextType {
    user: string | null;
    login: (data: AuthRequest) => Promise<void>;
    register: (data: AuthRequest) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        if (accessToken && storedUser) {
            setUser(storedUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (data: AuthRequest) => {
        const response = await loginApi(data);
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', data.username);
        setUser(data.username);
    };

    const register = async (data: AuthRequest) => {
        await registerApi(data);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    const getToken = async (): Promise<string | null> => {
        let token = localStorage.getItem('accessToken');
        if (!token) return null;

        // In a real app, check expiration here using jwt-decode.
        // For now, if request fails with 401, we handle it in API wrapper or component,
        // but here we can try to refresh if we had logic to check expiry.
        // Since we don't have expiry check logic yet, we return the token.
        // Ideally, we'd wrap fetch/axios to handle 401s globally.

        return token;
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
