import { useEffect, useState } from 'react';
import { useAgentsStore } from '../stores/agentsStore';
import AgentChatConfigurator from './AgentChatConfigurator';

interface AgenteIA {
  id: number;
  nombre: string;
  descripcion: string;
  sistemaId?: number;
  tipoFormatoId?: number;
  configuracion: string;
  modeloIA: string;
  activo: boolean;
  fechaCreacion: string;
}

const Agents = () => {
  const {
    agents,
    systems,
    formats,
    isLoading,
    error,
    fetchAgents,
    fetchSystems,
    fetchFormats,
    createAgent,
    updateAgent,
    deleteAgent
  } = useAgentsStore();

  const [showForm, setShowForm] = useState(false);
  const [showChatConfigurator, setShowChatConfigurator] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgenteIA | null>(null);
  const [agentToEdit, setAgentToEdit] = useState<AgenteIA | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    sistemaId: '',
    tipoFormatoId: '',
    modeloIA: 'gemini-pro',
    activo: true,
    configuracion: '{}',
  });

  useEffect(() => {
    fetchAgents();
    fetchSystems();
    fetchFormats();
  }, [fetchAgents, fetchSystems, fetchFormats]);

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      sistemaId: '',
      tipoFormatoId: '',
      modeloIA: 'gemini-pro',
      activo: true,
      configuracion: '{}',
    });
    setEditingAgent(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate JSON
      try {
        JSON.parse(formData.configuracion);
      } catch (e) {
        alert('El JSON de configuración no es válido.');
        return;
      }

      const agentData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        sistemaId: formData.sistemaId && !isNaN(parseInt(formData.sistemaId)) ? parseInt(formData.sistemaId) : undefined,
        tipoFormatoId: formData.tipoFormatoId && !isNaN(parseInt(formData.tipoFormatoId)) ? parseInt(formData.tipoFormatoId) : undefined,
        modeloIA: formData.modeloIA,
        activo: formData.activo,
        configuracion: formData.configuracion
      };

      let success = false;
      if (editingAgent) {
        success = await updateAgent(editingAgent.id, agentData as AgenteIA);
      } else {
        success = await createAgent(agentData as AgenteIA);
      }

      if (success) {
        resetForm();
        fetchAgents();
      }
    } catch (error) {
      console.error('Error saving agent:', error);
      alert('Error al guardar el agente. Verifica que la configuración JSON sea válida.');
    }
  };

  const handleEdit = (agent: AgenteIA) => {
    setEditingAgent(agent);
    setFormData({
      nombre: agent.nombre,
      descripcion: agent.descripcion,
      sistemaId: agent.sistemaId?.toString() || '',
      tipoFormatoId: agent.tipoFormatoId?.toString() || '',
      modeloIA: agent.modeloIA,
      activo: agent.activo,
      configuracion: agent.configuracion || '{}',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este agente?')) {
      const success = await deleteAgent(id);
      if (success) {
        fetchAgents();
      }
    }
  };

  const handleConfigureWithChat = () => {
    setAgentToEdit(null); // null = crear nuevo agente
    setShowChatConfigurator(true);
  };

  const handleEditWithChat = (agent: AgenteIA) => {
    setAgentToEdit(agent); // editar agente existente
    setShowChatConfigurator(true);
  };

  const handleCloseChatConfigurator = () => {
    setShowChatConfigurator(false);
    setAgentToEdit(null);
    fetchAgents(); // Recargar la lista de agentes
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Agentes de IA</h3>
          <p className="text-slate-600 mt-2">
            Personaliza agentes especializados para diferentes sistemas BMS
          </p>
        </div>
        <button
          onClick={handleConfigureWithChat}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
        >
          <span className="mr-2">💬</span>
          Asistente de Configuración
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Agents list */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{agent.nombre}</h4>
                    <p className="text-sm text-slate-600 mt-1">{agent.descripcion}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditWithChat(agent)}
                    className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Editar con Chat IA"
                  >
                    <span className="text-lg">💬</span>
                  </button>
                  <button
                    onClick={() => handleEdit(agent)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(agent.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    agent.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      agent.activo ? 'bg-green-400' : 'bg-red-400'
                    }`}></span>
                    {agent.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {agent.modeloIA}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(agent.fechaCreacion).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Agent form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {editingAgent ? 'Editar Agente' : 'Nuevo Agente'}
                  </h3>
                  <p className="text-slate-600 mt-1">
                    Configura las características y especialización del agente IA
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sistema BMS
                    </label>
                    <select
                      value={formData.sistemaId}
                      onChange={(e) => setFormData({...formData, sistemaId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar sistema</option>
                      {systems.map((system) => (
                        <option key={system.id} value={system.id}>
                          {system.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Formato
                    </label>
                    <select
                      value={formData.tipoFormatoId}
                      onChange={(e) => setFormData({...formData, tipoFormatoId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar formato</option>
                      {formats.map((format) => (
                        <option key={format.id} value={format.id}>
                          {format.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modelo IA
                    </label>
                    <select
                      value={formData.modeloIA}
                      onChange={(e) => setFormData({...formData, modeloIA: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="gemini-pro">Gemini Pro</option>
                      <option value="gemini-pro-vision">Gemini Pro Vision</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Configuración (JSON)
                    </label>
                    <textarea
                      value={formData.configuracion}
                      onChange={(e) => setFormData({...formData, configuracion: e.target.value})}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="activo"
                      checked={formData.activo}
                      onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
                      Agente Activo
                    </label>
                  </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold"
                  >
                    {editingAgent ? 'Actualizar' : 'Crear'} Agente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Chat Configurator Modal */}
      {showChatConfigurator && (
        <AgentChatConfigurator
          onClose={handleCloseChatConfigurator}
          editingAgent={agentToEdit}
        />
      )}
    </div>
  );
};

export default Agents;
