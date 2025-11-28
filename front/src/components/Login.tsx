import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor ingrese email y contraseña');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Credenciales inválidas');
    }
  };

  // Función helper para autollenar credenciales de prueba
  const fillTestCredentials = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
            <span className="text-3xl text-white">🤖</span>
          </div>
          <h2 className="mt-8 text-4xl font-bold tracking-tight text-slate-900">
            BMS Assistant
          </h2>
          <p className="mt-3 text-slate-600 font-medium">
            Sistema de gestión documental con IA
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-10 px-8 shadow-xl rounded-3xl border border-slate-200">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full px-5 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white placeholder-slate-400"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-slate-400" aria-hidden="true">📧</span>
                </div>
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full px-5 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white placeholder-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-slate-400" aria-hidden="true">🔒</span>
                </div>
              </div>
            </div>

            {error && (
              <div 
                className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm"
                role="alert"
              >
                <div className="flex items-center">
                  <span className="mr-3" aria-hidden="true">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-5 border border-transparent rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              {isLoading ? (
                <div className="relative flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                <div className="relative flex items-center">
                  <span className="mr-3 animate-bounce" aria-hidden="true">🚀</span>
                  <span>Iniciar Sesión</span>
                </div>
              )}
            </button>
          </form>

          {/* Test Users */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                Acceso Rápido
              </p>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => fillTestCredentials('test4@empresa4.com', 'test123')}
                  disabled={isLoading}
                  className="bg-blue-50 px-4 py-3 rounded-2xl hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-semibold text-blue-700">test4@empresa4.com</span>
                  <span className="text-slate-500 ml-2 font-medium">/ test123</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillTestCredentials('test3@empresa3.com', 'test123')}
                  disabled={isLoading}
                  className="bg-blue-50 px-4 py-3 rounded-2xl hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-semibold text-blue-700">test3@empresa3.com</span>
                  <span className="text-slate-500 ml-2 font-medium">/ test123</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 mt-8">
          <p className="font-medium">
            © 2025 EMPRESA RLE- BMS Assistant
          </p>
          <p className="mt-1 text-slate-400">
            Sistema de gestión documental con IA
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;