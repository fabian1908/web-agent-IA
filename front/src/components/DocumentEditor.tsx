import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentsStore } from '../stores/documentsStore';
import { useAgentsStore } from '../stores/agentsStore';
import { useAuthStore } from '../stores/authStore';
import { jsPDF } from "jspdf";
import { pdfjs } from 'react-pdf';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import html2canvas from 'html2canvas';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface DocumentEditorProps {
  documentId?: number;
  onClose: () => void;
}

const DocumentEditor = ({ documentId, onClose }: DocumentEditorProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { agents, systems, formats, fetchAgents, fetchSystems, fetchFormats } = useAgentsStore();
  const { createDocument, updateDocument, documents } = useDocumentsStore();

  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    sistemaId: '',
    tipoFormatoId: '',
    estado: 'BORRADOR',
    observaciones: '',
    agenteId: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
    fetchSystems();
    fetchFormats();

    if (documentId) {
      const doc = documents.find(d => d.id === documentId);
      if (doc) {
        setFormData({
          titulo: doc.titulo,
          contenido: doc.contenido,
          sistemaId: doc.sistemaId?.toString() || '',
          tipoFormatoId: doc.tipoFormatoId?.toString() || '',
          estado: doc.estado,
          observaciones: doc.observaciones || '',
          agenteId: doc.agenteId?.toString() || ''
        });
      }
    }
  }, [documentId, documents, fetchAgents, fetchSystems, fetchFormats]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!user) return;

    const docData = {
      titulo: formData.titulo,
      contenido: formData.contenido,
      sistemaId: parseInt(formData.sistemaId),
      tipoFormatoId: parseInt(formData.tipoFormatoId),
      usuarioId: user.id,
      estado: formData.estado,
      observaciones: formData.observaciones,
      agenteId: formData.agenteId ? parseInt(formData.agenteId) : undefined
    };

    let success = false;
    if (documentId) {
      success = await updateDocument(documentId, docData);
    } else {
      success = await createDocument(docData);
    }

    if (success) {
      onClose();
    }
  };

  const handleSaveAI = async () => {
    // Acts as "Guardar IA"
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleSubmit(fakeEvent);
  };

  const handleChatWithAI = () => {
    if (documentId && formData.agenteId) {
      navigate('/chat', { state: { documentId, agentId: parseInt(formData.agenteId) } });
    }
  };

  const togglePdfPreview = async () => {
    if (!showPdf) {
      // Generate PDF from HTML content
      const doc = new jsPDF();
      
      // Create a temporary container for the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; width: 595px;">
          <h1 style="text-align: center; margin-bottom: 20px;">${formData.titulo || 'Sin Título'}</h1>
          <div style="font-size: 12px; line-height: 1.5;">${formData.contenido || ''}</div>
        </div>
      `;
      document.body.appendChild(tempDiv);

      try {
        // Use html2canvas to render the element to a canvas
        const canvas = await html2canvas(tempDiv, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        document.body.removeChild(tempDiv);
      }
    }
    setShowPdf(!showPdf);
  };

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      setFormData(prev => ({
        ...prev,
        contenido: prev.contenido ? prev.contenido + '\n\n' + fullText : fullText
      }));
    } catch (error) {
      console.error('Error parsing PDF:', error);
      alert('Error al leer el archivo PDF.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {documentId ? 'Editar Documento' : 'Nuevo Documento'}
              </h3>
              <p className="text-slate-600 mt-1">
                Crea o edita documentos técnicos con asistencia de IA
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Título del Documento
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                  placeholder="Ingrese el título del documento"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                >
                  <option value="BORRADOR">Borrador</option>
                  <option value="REVISION">En Revisión</option>
                  <option value="APROBADO">Aprobado</option>
                  <option value="PUBLICADO">Publicado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sistema BMS
                </label>
                <select
                  value={formData.sistemaId}
                  onChange={(e) => setFormData({...formData, sistemaId: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                  required
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Formato
                </label>
                <select
                  value={formData.tipoFormatoId}
                  onChange={(e) => setFormData({...formData, tipoFormatoId: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                  required
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

            {/* AI Generation Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Asistencia IA</h4>
              <div className="flex items-center space-x-4">
                <select
                  value={formData.agenteId}
                  onChange={(e) => setFormData({...formData, agenteId: e.target.value})}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar agente IA</option>
                  {agents.filter(agent => agent.activo).map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.nombre} - {agent.descripcion}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleSaveAI}
                  disabled={!formData.agenteId || !formData.titulo}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Guardar IA
                </button>
                {documentId && formData.agenteId && (
                  <button
                    type="button"
                    onClick={handleChatWithAI}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center"
                  >
                    <span className="mr-2">💬</span>
                    Hablar con IA
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Contenido del Documento
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleTemplateUpload}
                      className="hidden"
                      id="template-upload"
                    />
                    <label
                      htmlFor="template-upload"
                      className="cursor-pointer text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded border border-gray-300 flex items-center"
                    >
                      <span className="mr-1">📄</span> Cargar Plantilla PDF
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={togglePdfPreview}
                  className={`text-sm px-3 py-1 rounded-md transition-colors ${
                    showPdf 
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showPdf ? '👁️ Volver a Edición' : '📄 Ver PDF'}
                </button>
              </div>
              
              {showPdf && pdfUrl ? (
                <div className="w-full h-[500px] border border-slate-300 rounded-lg overflow-hidden bg-slate-100">
                  <iframe 
                    src={pdfUrl} 
                    className="w-full h-full" 
                    title="PDF Preview"
                  />
                </div>
              ) : (
                <div className="bg-white">
                  <ReactQuill
                    theme="snow"
                    value={formData.contenido}
                    onChange={(content) => setFormData({...formData, contenido: content})}
                    className="h-96 mb-12"
                    placeholder="Ingrese el contenido del documento..."
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                placeholder="Observaciones adicionales..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              >
                {documentId ? 'Actualizar Documento' : 'Crear Documento'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
