import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    username: string;
    uuid: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated on mount
        const checkAuth = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/whispers', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    setUser(null);
                    navigate('/login');
                    return;
                }
                // If we get here, the user is authenticated
                const userResponse = await fetch('http://127.0.0.1:5000/api/users/me', {
                    credentials: 'include'
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData);
                }
            } catch (error) {
                setUser(null);
                navigate('/login');
            }
        };
        checkAuth();
    }, [navigate]);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await fetch('http://127.0.0.1:5000/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
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