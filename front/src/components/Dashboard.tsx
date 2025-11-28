import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface DashboardStats {
  totalAgentes: number;
  totalDocumentos: number;
  totalSistemas: number;
  documentosPorEstado: {
    BORRADOR: number;
    REVISION: number;
    APROBADO: number;
    PUBLICADO: number;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8888/api/dashboard/estadisticas');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Welcome message */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <div className="p-5 bg-white/20 backdrop-blur-sm rounded-3xl mr-8 shadow-2xl border border-white/20">
              <span className="text-4xl">👋</span>
            </div>
            <div>
              <h3 className="text-4xl font-bold tracking-tight">
                ¡Bienvenido al BMS Assistant!
              </h3>
              <p className="text-blue-100 mt-3 text-xl font-medium">
                Sistema de gestión documental con IA para supervisores de ingeniería
              </p>
            </div>
          </div>
          <p className="text-blue-50 leading-relaxed text-xl max-w-5xl font-medium">
            Crea agentes especializados, genera documentación técnica y colabora con IA para optimizar tus sistemas BMS.
            Gestiona proyectos complejos con la ayuda de inteligencia artificial avanzada y mejora tu productividad.
          </p>
          <div className="mt-8 flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-blue-100">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Sistema operativo</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
              <span className="text-sm font-medium">IA integrada</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
              <span className="text-sm font-medium">Colaboración en tiempo real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl p-8 border border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="p-4 bg-blue-500 rounded-2xl shadow-lg">
                <span className="text-3xl text-white">🤖</span>
              </div>
              <div className="ml-6">
                <p className="text-sm font-bold text-blue-700 uppercase tracking-wide">Agentes IA</p>
                <p className="text-4xl font-bold text-blue-900">{stats.totalAgentes}</p>
                <p className="text-sm text-blue-600 mt-1 font-medium">Activos y configurados</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl p-8 border border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="p-4 bg-green-500 rounded-2xl shadow-lg">
                <span className="text-3xl text-white">📄</span>
              </div>
              <div className="ml-6">
                <p className="text-sm font-bold text-green-700 uppercase tracking-wide">Documentos</p>
                <p className="text-4xl font-bold text-green-900">{stats.totalDocumentos}</p>
                <p className="text-sm text-green-600 mt-1 font-medium">Total generados</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-xl p-8 border border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="p-4 bg-purple-500 rounded-2xl shadow-lg">
                <span className="text-3xl text-white">🏗️</span>
              </div>
              <div className="ml-6">
                <p className="text-sm font-bold text-purple-700 uppercase tracking-wide">Sistemas BMS</p>
                <p className="text-4xl font-bold text-purple-900">{stats.totalSistemas}</p>
                <p className="text-sm text-purple-600 mt-1 font-medium">Sistemas gestionados</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-xl p-8 border border-yellow-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="flex items-center">
              <div className="p-4 bg-yellow-500 rounded-2xl shadow-lg">
                <span className="text-3xl text-white">📊</span>
              </div>
              <div className="ml-6">
                <p className="text-sm font-bold text-yellow-700 uppercase tracking-wide">En Revisión</p>
                <p className="text-4xl font-bold text-yellow-900">{stats.documentosPorEstado.REVISION}</p>
                <p className="text-sm text-yellow-600 mt-1 font-medium">Pendientes de aprobación</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document status breakdown */}
      {stats && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h4 className="text-2xl font-bold text-slate-900 mb-8 text-center">Estado de Documentos</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.documentosPorEstado.BORRADOR}</div>
              <div className="text-sm font-semibold text-blue-700">Borradores</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
              <div className="text-4xl font-bold text-yellow-600 mb-2">{stats.documentosPorEstado.REVISION}</div>
              <div className="text-sm font-semibold text-yellow-700">En Revisión</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.documentosPorEstado.APROBADO}</div>
              <div className="text-sm font-semibold text-green-700">Aprobados</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.documentosPorEstado.PUBLICADO}</div>
              <div className="text-sm font-semibold text-purple-700">Publicados</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl p-10 border border-slate-200">
        <h4 className="text-3xl font-bold text-slate-900 mb-10 text-center">🚀 Acciones Rápidas</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <button
            onClick={() => navigate('/agents')}
            className="group flex flex-col items-center justify-center px-8 py-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <span className="text-4xl mb-4 group-hover:animate-bounce">🤖</span>
            <span className="font-bold text-lg">Crear Agente IA</span>
            <span className="text-sm text-blue-100 mt-2 font-medium">Configura un nuevo asistente</span>
          </button>
          <button
            onClick={() => navigate('/documents')}
            className="group flex flex-col items-center justify-center px-8 py-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <span className="text-4xl mb-4 group-hover:animate-bounce">📄</span>
            <span className="font-bold text-lg">Nuevo Documento</span>
            <span className="text-sm text-green-100 mt-2 font-medium">Genera documentación técnica</span>
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="group flex flex-col items-center justify-center px-8 py-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            <span className="text-4xl mb-4 group-hover:animate-bounce">💬</span>
            <span className="font-bold text-lg">Chat con IA</span>
            <span className="text-sm text-purple-100 mt-2 font-medium">Colabora con tus agentes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
