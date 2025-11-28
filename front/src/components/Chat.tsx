import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAgentsStore } from '../stores/agentsStore';
import { useAuthStore } from '../stores/authStore';
import { useDocumentsStore } from '../stores/documentsStore';
import { Document, Page, pdfjs } from 'react-pdf';
import { jsPDF } from "jspdf";
import mammoth from 'mammoth';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentName?: string;
  file?: File;
}

// Configuration from AgentChatConfigurator
const API_KEY = 'AIzaSyB6Z8U2oR7R6jBb5VtUw9wgenokVRFkwr4';
const MODEL_NAME = 'gemini-2.0-flash-exp';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

const Chat = () => {
  const location = useLocation();
  const { agents, fetchAgents } = useAgentsStore();
  const { documents, fetchDocuments, updateDocument } = useDocumentsStore();
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAgents();
    fetchDocuments();
  }, [fetchAgents, fetchDocuments]);

  useEffect(() => {
    if (location.state?.agentId) {
      setSelectedAgent(location.state.agentId);
    }
    if (location.state?.documentId) {
      setSelectedDocumentId(location.state.documentId);
    }
  }, [location.state]);

  useEffect(() => {
    if (selectedDocumentId) {
      const doc = documents.find(d => d.id === selectedDocumentId);
      if (doc) {
        generatePdfPreview(doc.titulo, doc.contenido);
      }
    } else {
      setPdfPreviewUrl(null);
    }
  }, [selectedDocumentId, documents]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generatePdfPreview = (title: string, content: string) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(title || 'Sin Título', 10, 15);
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(content || '', 180);
    doc.text(splitText, 10, 25);
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    setPdfPreviewUrl(url);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const sendMessage = async () => {
    if ((!inputMessage.trim() && !selectedFile) || !selectedAgent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      file: selectedFile || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedFile(null);
    setIsFileSelected(false);
    setIsTyping(true);

    try {
      // Build Prompt
      const agent = agents.find(a => a.id === selectedAgent);
      let systemPrompt = agent?.configuracion || "Eres un asistente útil.";
      
      // Construct current message parts (Input + Context + Files)
      const currentParts: any[] = [];

      // Document Context (Only append if this is the FIRST message or we want to remind it? 
      // Better to append to System Instruction or just include in current message context)
      if (selectedDocumentId) {
        const doc = documents.find(d => d.id === selectedDocumentId);
        if (doc) {
          currentParts.push({ text: `[Contexto del Documento Actual]\nTítulo: ${doc.titulo}\nContenido:\n${doc.contenido}` });
        }
      }

      if (selectedFile) {
        if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
           const arrayBuffer = await selectedFile.arrayBuffer();
           const result = await mammoth.extractRawText({ arrayBuffer });
           currentParts.push({ text: `[Contenido del archivo adjunto Word (${selectedFile.name})]:\n${result.value}` });
        } else {
           // PDF or Image
           const base64Data = await fileToBase64(selectedFile);
           currentParts.push({
             inlineData: {
               mimeType: selectedFile.type,
               data: base64Data
             }
           });
        }
      }

      currentParts.push({ text: inputMessage });

      // Build History
      const historyContents = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // If history is empty, prepend system prompt to the first user message (current)
      // If history exists, we should have sent system prompt before. 
      // But REST API is stateless. We must send system prompt EVERY time.
      // Easiest is to use `system_instruction` field for Gemini 1.5+.
      
      const requestBody = {
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          ...historyContents,
          {
            role: 'user',
            parts: currentParts
          }
        ]
      };

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Error en la API de Gemini');

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No pude generar una respuesta.";

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        sender: 'agent',
        timestamp: new Date(),
        agentName: agent?.nombre || 'IA'
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, hubo un error al procesar tu mensaje.",
        sender: 'agent',
        timestamp: new Date(),
        agentName: "Sistema"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {selectedDocumentId ? 'Editor Asistido por IA' : 'Chat con Agentes IA'}
          </h3>
          <p className="text-sm text-slate-500">
            {selectedDocumentId ? 'Visualización y edición en tiempo real' : 'Colabora con agentes especializados'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedDocumentId || ''}
            onChange={(e) => setSelectedDocumentId(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
          >
            <option value="">Seleccionar documento</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.titulo}
              </option>
            ))}
          </select>

          <select
            value={selectedAgent || ''}
            onChange={(e) => setSelectedAgent(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar agente</option>
            {agents.filter(agent => agent.activo).map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content (Split Screen) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Chat */}
        <div className={`flex flex-col bg-white ${selectedDocumentId ? 'w-1/2 border-r border-slate-200' : 'w-full'}`}>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  {message.sender === 'agent' && message.agentName && (
                    <div className="text-xs font-bold mb-1 opacity-75">
                      {message.agentName}
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  
                  {message.file && (
                    <div className="mt-2 p-2 bg-white/10 rounded">
                      <span className="text-xs">📎 Archivo adjunto: {message.file.name}</span>
                    </div>
                  )}

                  {message.sender === 'agent' && selectedDocumentId && message.id !== 'context' && (
                    <button
                      onClick={() => {
                        if (window.confirm('¿Deseas actualizar el documento con esta respuesta?')) {
                          updateDocument(selectedDocumentId, { contenido: message.content });
                          // Update preview
                          const doc = documents.find(d => d.id === selectedDocumentId);
                          if (doc) generatePdfPreview(doc.titulo, message.content);
                          alert('Documento actualizado.');
                        }
                      }}
                      className="mt-3 text-xs bg-black/10 hover:bg-black/20 px-3 py-1.5 rounded-lg flex items-center transition-colors"
                    >
                      <span>💾 Actualizar Documento</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-4 py-2 rounded-2xl">
                  <span className="text-xs text-slate-500">Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                disabled={!selectedAgent}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      setIsFileSelected(true);
                    } else {
                      setSelectedFile(null);
                      setIsFileSelected(false);
                    }
                  }}
                />
                <label
                  htmlFor="fileInput"
                  className={`cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${isFileSelected ? 'bg-green-200 hover:bg-green-300 text-green-700' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </label>
              </div>
              <button
                onClick={sendMessage}
                disabled={(!inputMessage.trim() && !selectedFile) || !selectedAgent}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Document Preview (Overleaf style) */}
        {selectedDocumentId && (
          <div className="w-1/2 bg-slate-100 flex flex-col">
            <div className="bg-white border-b border-slate-200 px-4 py-2 flex justify-between items-center">
              <span className="font-semibold text-sm text-slate-700">Vista Previa (PDF)</span>
              <button 
                onClick={() => {
                   const doc = documents.find(d => d.id === selectedDocumentId);
                   if(doc) generatePdfPreview(doc.titulo, doc.contenido);
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                Actualizar Vista
              </button>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              {pdfPreviewUrl ? (
                <iframe src={pdfPreviewUrl} className="w-full h-full rounded-lg shadow-lg border border-slate-300 bg-white" title="PDF Preview" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  Cargando vista previa...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
