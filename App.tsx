import React from 'react';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import RecipeAppPage from './pages/RecipeAppPage';
import Spinner from './components/Spinner';

export default function App() {
  const { user, login, signup, logout, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={login} onSignup={signup} error={error} />;
  }

  return <RecipeAppPage user={user} onLogout={logout} />;
}
