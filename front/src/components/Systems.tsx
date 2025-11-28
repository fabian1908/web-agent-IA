import { useEffect, useState } from 'react';
import { useAgentsStore } from '../stores/agentsStore';

interface SistemaBMS {
  id: number;
  nombre: string;
  descripcion: string;
  protocoloComunicacion: string;
  fabricante: string;
}

const Systems = () => {
  const {
    systems,
    isLoading,
    error,
    fetchSystems,
    createSystem,
    updateSystem,
    deleteSystem
  } = useAgentsStore();

  const [showForm, setShowForm] = useState(false);
  const [editingSystem, setEditingSystem] = useState<SistemaBMS | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    protocoloComunicacion: '',
    fabricante: '',
  });

  useEffect(() => {
    fetchSystems();
  }, [fetchSystems]);

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      protocoloComunicacion: '',
      fabricante: '',
    });
    setEditingSystem(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let success = false;
      if (editingSystem) {
        success = await updateSystem(editingSystem.id, formData);
      } else {
        success = await createSystem(formData);
      }

      if (success) {
        resetForm();
        fetchSystems();
      }
    } catch (error) {
      console.error('Error saving system:', error);
      alert('Error al guardar el sistema.');
    }
  };

  const handleEdit = (system: SistemaBMS) => {
    setEditingSystem(system);
    setFormData({
      nombre: system.nombre,
      descripcion: system.descripcion,
      protocoloComunicacion: system.protocoloComunicacion,
      fabricante: system.fabricante,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este sistema?')) {
      const success = await deleteSystem(id);
      if (success) {
        fetchSystems();
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Sistemas BMS</h3>
          <p className="text-slate-600 mt-2">
            Gestiona los sistemas Building Management System (BMS)
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
        >
          <span className="mr-2">⚙️</span>
          Crear Sistema
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Systems list */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system) => (
            <div key={system.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-6 border border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                    <span className="text-white text-lg">🏢</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{system.nombre}</h4>
                    <p className="text-sm text-slate-600 mt-1">{system.fabricante}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(system)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(system.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-sm text-slate-600">{system.descripcion}</p>
                <div className="mt-3 flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Protocolo: {system.protocoloComunicacion}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* System form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {editingSystem ? 'Editar Sistema' : 'Nuevo Sistema'}
                  </h3>
                  <p className="text-slate-600 mt-1">
                    Registra un nuevo sistema BMS
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
                      Protocolo
                    </label>
                    <input
                      type="text"
                      value={formData.protocoloComunicacion}
                      onChange={(e) => setFormData({...formData, protocoloComunicacion: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej. BACnet, Modbus"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fabricante
                    </label>
                    <input
                      type="text"
                      value={formData.fabricante}
                      onChange={(e) => setFormData({...formData, fabricante: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
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
                    {editingSystem ? 'Actualizar' : 'Crear'} Sistema
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Systems;
