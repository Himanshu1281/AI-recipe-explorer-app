import React, { useState } from 'react';
import { ChefHatIcon } from '../components/Icons';
import Spinner from '../components/Spinner';

interface AuthPageProps {
  onLogin: (email: string, pass: string) => Promise<boolean>;
  onSignup: (email: string, pass: string) => Promise<boolean>;
  error: string | null;
}

type FormMode = 'login' | 'signup';

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup, error }) => {
  const [mode, setMode] = useState<FormMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (mode === 'login') {
      await onLogin(email, password);
    } else {
      await onSignup(email, password);
    }
    setIsLoading(false);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  const title = mode === 'login' ? 'Welcome Back!' : 'Create Your Account';
  const subTitle = mode === 'login' ? 'Sign in to continue' : 'Get started with your own recipe book';
  const buttonText = mode === 'login' ? 'Login' : 'Sign Up';
  const toggleText = mode === 'login' ? "Don't have an account?" : "Already have an account?";
  const toggleLinkText = mode === 'login' ? "Sign up" : "Login";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <ChefHatIcon className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto" />
            <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{subTitle}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed dark:disabled:bg-indigo-800 transition-all duration-200 shadow-sm"
            >
              {isLoading ? <Spinner className="text-white" /> : buttonText}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {toggleText}{' '}
            <button onClick={toggleMode} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              {toggleLinkText}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;