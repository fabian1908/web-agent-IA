import { create } from 'zustand';
import axios from 'axios';

interface Documento {
  id: number;
  titulo: string;
  contenido: string;
  tipoFormatoId: number;
  sistemaId: number;
  usuarioId: number;
  agenteId?: number;
  estado: string;
  observaciones?: string;
  fechaCreacion: string;
}

interface DocumentsState {
  documents: Documento[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDocuments: () => Promise<void>;
  createDocument: (doc: Omit<Documento, 'id' | 'fechaCreacion'>) => Promise<boolean>;
  updateDocument: (id: number, doc: Partial<Documento>) => Promise<boolean>;
  deleteDocument: (id: number) => Promise<boolean>;
  generateDocumentWithAI: (data: any) => Promise<any>;
}

const API_BASE_URL = 'http://localhost:8888';

export const useDocumentsStore = create<DocumentsState>((set, get) => ({
  documents: [],
  isLoading: false,
  error: null,

  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/api/documentos`);
      set({ documents: response.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching documents:', error);
      set({ error: 'Error al cargar documentos', isLoading: false });
    }
  },

  createDocument: async (docData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/api/documentos`, docData);
      const newDoc = response.data;
      set(state => ({
        documents: [...state.documents, newDoc],
        isLoading: false
      }));
      return true;
    } catch (error) {
      console.error('Error creating document:', error);
      set({ error: 'Error al crear documento', isLoading: false });
      return false;
    }
  },

  updateDocument: async (id, docData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_BASE_URL}/api/documentos/${id}`, docData);
      const updatedDoc = response.data;
      set(state => ({
        documents: state.documents.map(doc =>
          doc.id === id ? updatedDoc : doc
        ),
        isLoading: false
      }));
      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      set({ error: 'Error al actualizar documento', isLoading: false });
      return false;
    }
  },

  deleteDocument: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/api/documentos/${id}`);
      set(state => ({
        documents: state.documents.filter(doc => doc.id !== id),
        isLoading: false
      }));
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      set({ error: 'Error al eliminar documento', isLoading: false });
      return false;
    }
  },

  generateDocumentWithAI: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/api/ia/generar-documento`, data);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error('Error generating document with AI:', error);
      set({ error: 'Error al generar documento con IA', isLoading: false });
      throw error;
    }
  }
}));
