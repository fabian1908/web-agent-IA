import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentsStore } from '../stores/documentsStore';
import DocumentEditor from './DocumentEditor';

const Documents = () => {
  const navigate = useNavigate();
  const { documents, isLoading, error, fetchDocuments, deleteDocument } = useDocumentsStore();
  const [showEditor, setShowEditor] = useState(false);
  const [editingDocumentId, setEditingDocumentId] = useState<number | undefined>();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleNewDocument = () => {
    setEditingDocumentId(undefined);
    setShowEditor(true);
  };

  const handleEditDocument = (documentId: number) => {
    setEditingDocumentId(documentId);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingDocumentId(undefined);
    fetchDocuments(); // Refresh the list after editing
  };

  const handleDeleteDocument = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      const success = await deleteDocument(id);
      if (success) {
        fetchDocuments();
      }
    }
  };

  const handleChat = (doc: any) => {
    navigate('/chat', { state: { documentId: doc.id, agentId: doc.agenteId } });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Documentos</h3>
          <p className="text-slate-600 mt-2">
            Gestiona y edita documentos técnicos con asistencia de IA
          </p>
        </div>
        <button
          onClick={handleNewDocument}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
        >
          <span className="mr-2">📄</span>
          Nuevo Documento
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <div className="flex items-center">
            <span className="mr-3">⚠️</span>
            {error}
          </div>
        </div>
      )}

      {/* Documents list */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-6 border border-slate-200">
              <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                <div className="flex items-center flex-1 min-w-[200px]">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg mr-4 flex-shrink-0">
                    <span className="text-white text-lg">📄</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-slate-900 truncate">{doc.titulo}</h4>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {doc.contenido.substring(0, 100)}...
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditDocument(doc.id)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleChat(doc)}
                    className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Chat con IA"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
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
                    doc.estado === 'BORRADOR' ? 'bg-blue-100 text-blue-800' :
                    doc.estado === 'REVISION' ? 'bg-yellow-100 text-yellow-800' :
                    doc.estado === 'APROBADO' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      doc.estado === 'BORRADOR' ? 'bg-blue-400' :
                      doc.estado === 'REVISION' ? 'bg-yellow-400' :
                      doc.estado === 'APROBADO' ? 'bg-green-400' :
                      'bg-purple-400'
                    }`}></span>
                    {doc.estado}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(doc.fechaCreacion).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {documents.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📄</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">No hay documentos</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Crea tu primer documento técnico para comenzar a trabajar con asistencia de IA
          </p>
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold">
            <span className="mr-2">➕</span>
            Crear Primer Documento
          </button>
        </div>
      )}

      {/* Document Editor Modal */}
      {showEditor && (
        <DocumentEditor
          documentId={editingDocumentId}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
};

export default Documents;
