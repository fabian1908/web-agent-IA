import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Agentes IA', href: '/agents', icon: '🤖' },
    { name: 'Documentos', href: '/documents', icon: '📄' },
    { name: 'Sistemas', href: '/systems', icon: '⚙️' },
    { name: 'Chat IA', href: '/chat', icon: '💬' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl border-r border-slate-200/60 backdrop-blur-xl bg-white/95">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-24 px-8 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
            <div className="relative z-10 flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">BMS Assistant</h1>
                <p className="text-sm text-blue-100/80 font-medium">Sistema IA Avanzado</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-10 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative flex items-center px-6 py-4 text-sm font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25'
                      : 'text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-md border border-transparent hover:border-slate-200/50'
                  }`}
                >
                  <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                    isActive ? 'bg-gradient-to-r from-blue-500/10 to-indigo-600/10' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                  <span className="relative mr-4 text-xl">{item.icon}</span>
                  <span className="relative font-semibold tracking-wide">{item.name}</span>
                  {isActive && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-6 border-t border-slate-200/60 bg-gradient-to-t from-slate-50/80 to-white/80 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white">
                  <span className="text-white font-bold text-lg">
                    {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user?.nombre} {user?.apellido}
                </p>
                <p className="text-xs text-slate-500 truncate mb-1">{user?.email}</p>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                    user?.rol === 'SUPERVISOR'
                      ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200'
                      : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      user?.rol === 'SUPERVISOR' ? 'bg-emerald-400' : 'bg-blue-400'
                    }`}></div>
                    {user?.rol}
                  </span>
                </div>
              </div>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cerrar sesión"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          
            {/* Main content */}
      <div className="pl-80">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-xl border-b border-slate-200/60 sticky top-0 z-40">
          <div className="px-10 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">
                    {navigation.find(item => item.href === location.pathname)?.icon || '📊'}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                  </h2>
                  <p className="text-slate-600 mt-1 font-medium">
                    Gestiona tus agentes IA y documentos técnicos con inteligencia artificial avanzada
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-medium">Bienvenido de vuelta</p>
                  <p className="text-lg font-bold text-slate-900">
                    {user?.nombre}
                  </p>
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white">
                    <span className="text-white font-bold text-lg">
                      {user?.nombre?.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-10 bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50 min-h-[calc(100vh-120px)]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
