// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { checkSession, logoutUser } from '../services/api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        checkUserSession();
    }, []);
    
    const checkUserSession = async () => {
        setLoading(true);
        try {
            // ✅ First check localStorage for faster load
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== 'undefined') {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    if (parsedUser && parsedUser.id) {
                        console.log('✅ User loaded from localStorage:', parsedUser);
                        setUser(parsedUser);
                        setLoading(false);
                        // Still check session in background
                        checkSessionFromBackend();
                        return;
                    }
                } catch (e) {
                    console.error('Error parsing stored user:', e);
                    localStorage.removeItem('user');
                }
            }
            
            // If no stored user, check backend
            await checkSessionFromBackend();
        } catch (error) {
            console.error('Session check error:', error);
            // Try to load from localStorage as fallback
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== 'undefined') {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    if (parsedUser && parsedUser.id) {
                        console.log('✅ Using stored user as fallback:', parsedUser);
                        setUser(parsedUser);
                    }
                } catch (e) {
                    setUser(null);
                    localStorage.removeItem('user');
                }
            } else {
                setUser(null);
                localStorage.removeItem('user');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const checkSessionFromBackend = async () => {
        try {
            const response = await checkSession();
            console.log('Session check response:', response);
            
            if (response && response.success && response.data) {
                console.log('✅ Session valid from backend:', response.data);
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            } else {
                console.log('❌ No valid session');
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Backend session check error:', error);
            // Don't clear user if we have stored user
            const storedUser = localStorage.getItem('user');
            if (!storedUser || storedUser === 'undefined') {
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    };
    
    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    };
    
    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout, checkUserSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};