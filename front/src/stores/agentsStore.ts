import { create } from 'zustand';
import axios from 'axios';

interface AgenteIA {
  id: number;
  nombre: string;
  descripcion: string;
  sistemaId?: number;
  tipoFormatoId?: number;
  configuracion: string; // JSON string
  modeloIA: string;
  activo: boolean;
  fechaCreacion: string;
}

interface SistemaBMS {
  id: number;
  nombre: string;
  descripcion: string;
  protocoloComunicacion: string;
  fabricante: string;
}

interface TipoFormato {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

interface AgentsState {
  agents: AgenteIA[];
  systems: SistemaBMS[];
  formats: TipoFormato[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAgents: () => Promise<void>;
  fetchSystems: () => Promise<void>;
  fetchFormats: () => Promise<void>;
  createAgent: (agent: Omit<AgenteIA, 'id' | 'fechaCreacion'>) => Promise<boolean>;
  updateAgent: (id: number, agent: Partial<AgenteIA>) => Promise<boolean>;
  deleteAgent: (id: number) => Promise<boolean>;
  createSystem: (system: any) => Promise<boolean>;
  updateSystem: (id: number, system: any) => Promise<boolean>;
  deleteSystem: (id: number) => Promise<boolean>;
}

const API_BASE_URL = 'http://localhost:8888';

export const useAgentsStore = create<AgentsState>((set, get) => ({
  agents: [],
  systems: [],
  formats: [],
  isLoading: false,
  error: null,

  fetchAgents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/agentes`);
      set({ agents: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching agents:', error);
      set({ error: 'Error al cargar agentes', isLoading: false });
    }
  },

  fetchSystems: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/sistemas`);
      set({ systems: response.data });
    } catch (error) {
      console.error('Error fetching systems:', error);
    }
  },

  createSystem: async (systemData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/api/sistemas`, systemData);
      const newSystem = response.data;
      set(state => ({
        systems: [...state.systems, newSystem],
        isLoading: false
      }));
      return true;
    } catch (error) {
      console.error('Error creating system:', error);
      set({ error: 'Error al crear sistema', isLoading: false });
      return false;
    }
  },

  updateSystem: async (id, systemData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_BASE_URL}/api/sistemas/${id}`, systemData);
      const updatedSystem = response.data;
      set(state => ({
        systems: state.systems.map(sys =>
          sys.id === id ? updatedSystem : sys
        ),
        isLoading: false
      }));
      return true;
    } catch (error) {
      console.error('Error updating system:', error);
      set({ error: 'Error al actualizar sistema', isLoading: false });
      return false;
    }
  },

  deleteSystem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/api/sistemas/${id}`);
      set(state => ({
        systems: state.systems.filter(sys => sys.id !== id),
        isLoading: false
      }));
      return true;
    } catch (error) {
      console.error('Error deleting system:', error);
      set({ error: 'Error al eliminar sistema', isLoading: false });
      return false;
    }
  },

  fetchFormats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/formatos`);
      set({ formats: response.data });
    } catch (error) {
      console.error('Error fetching formats:', error);
    }
  },

  createAgent: async (agentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/api/agentes`, agentData);
      const newAgent = response.data;
      set(state => ({
        agents: [...state.agents, newAgent],
        isLoading: false
      }));
      return true;
    } catch (error: any) {
      console.error('Error creating agent:', error);
      const msg = error.response?.data?.message || error.message || 'Error al crear agente';
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  updateAgent: async (id, agentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_BASE_URL}/api/agentes/${id}`, agentData);
      const updatedAgent = response.data;
      set(state => ({
        agents: state.agents.map(agent =>
          agent.id === id ? updatedAgent : agent
        ),
        isLoading: false
      }));
      return true;
    } catch (error: any) {
      console.error('Error updating agent:', error);
      const msg = error.response?.data?.message || error.message || 'Error al actualizar agente';
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  deleteAgent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/api/agentes/${id}`);
      set(state => ({
        agents: state.agents.filter(agent => agent.id !== id),
        isLoading: false
      }));
      return true;
    } catch (error) {
      console.error('Error deleting agent:', error);
      set({ error: 'Error al eliminar agente', isLoading: false });
      return false;
    }
  }
}));
