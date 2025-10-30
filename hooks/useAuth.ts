import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Users = Record<string, string>; // email: password

export function useAuth() {
    const [users, setUsers] = useLocalStorage<Users>('recipeAppUsers', {});
    const [currentUser, setCurrentUser] = useLocalStorage<string | null>('recipeAppCurrentUser', null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate loading the session
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    const signup = async (email: string, password: string): Promise<boolean> => {
        setError(null);
        if (users[email]) {
            setError("An account with this email already exists.");
            return false;
        }
        setUsers(prev => ({ ...prev, [email]: password })); // In a real app, hash the password
        setCurrentUser(email);
        return true;
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        setError(null);
        if (!users[email] || users[email] !== password) {
            setError("Invalid email or password.");
            return false;
        }
        setCurrentUser(email);
        return true;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return {
        user: currentUser,
        loading,
        error,
        signup,
        login,
        logout,
    };
}
