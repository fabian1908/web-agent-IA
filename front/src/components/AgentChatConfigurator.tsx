import { useState, useEffect, useRef } from 'react';
import { useAgentsStore } from '../stores/agentsStore';

// Configuración de Gemini
// const API_KEY = 'AIzaSyA5cQdKyhyUby96OLJfGJFLfzqiVrCwZPk';
// const API_KEY = 'AIzaSyCPvCYaBo4t3G3t6BvBId5fN-LAHzWzmh0';
const API_KEY = 'AIzaSyB6Z8U2oR7R6jBb5VtUw9wgenokVRFkwr4'
const MODEL_NAME = 'gemini-2.0-flash-exp';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface AgentConfig {
  nombre: string;
  descripcion: string;
  sistemaId?: number;
  tipoFormatoId?: number;
  modeloIA: string;
  configuracion: {
    prompt: string;
    temperatura: number;
    maxTokens: number;
    especialidad?: string;
    instruccionesEspecificas?: string[];
  };
}

interface AgentChatConfiguratorProps {
  onClose: () => void;
  editingAgent?: any;
}

const AgentChatConfigurator = ({ onClose, editingAgent }: AgentChatConfiguratorProps) => {
  const { systems, formats, createAgent, updateAgent } = useAgentsStore();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: editingAgent 
        ? `Hola! Estoy aquí para ayudarte a personalizar el agente "${editingAgent.nombre}". ¿Qué te gustaría modificar? Puedes cambiar su especialidad, comportamiento, o añadir instrucciones específicas.`
        : 'Hola! Soy tu asistente para crear agentes de IA personalizados. Cuéntame: ¿qué tipo de agente necesitas? Por ejemplo: "un agente especializado en HVAC" o "un asistente para sistemas de iluminación".',
      timestamp: new Date()
    }
  ]);
  
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(
    editingAgent ? {
      nombre: editingAgent.nombre,
      descripcion: editingAgent.descripcion,
      sistemaId: editingAgent.sistemaId,
      tipoFormatoId: editingAgent.tipoFormatoId,
      modeloIA: editingAgent.modeloIA,
      configuracion: typeof editingAgent.configuracion === 'string' 
        ? JSON.parse(editingAgent.configuracion || '{}')
        : editingAgent.configuracion
    } : null
  );
  
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const buildSystemPrompt = () => {
    return `Eres un asistente experto en configuración de agentes de IA para sistemas BMS (Building Management Systems).

Tu trabajo es ayudar al usuario a crear o modificar configuraciones de agentes mediante conversación natural.

Sistemas BMS disponibles: ${systems.map(s => `${s.id}: ${s.nombre}`).join(', ')}
Formatos disponibles: ${formats.map(f => `${f.id}: ${f.nombre}`).join(', ')}

Cuando el usuario te diga qué tipo de agente necesita, debes:
1. Hacer preguntas aclaratorias si es necesario
2. Sugerir configuraciones apropiadas
3. Generar un objeto JSON con la configuración completa del agente

${editingAgent ? `IMPORTANTE: Estás editando el agente existente "${editingAgent.nombre}".
Configuración actual: ${JSON.stringify(agentConfig, null, 2)}` : ''}

DEBES responder SIEMPRE con un único objeto JSON válido con esta estructura exacta:
{
  "chatResponse": "tu respuesta conversacional en español",
  "agentConfig": {
    "nombre": "Nombre del Agente",
    "descripcion": "Descripción clara del agente", 
    "sistemaId": 1,
    "tipoFormatoId": 1,
    "modeloIA": "gemini-pro",
    "configuracion": {
      "prompt": "Eres un agente especializado en...",
      "temperatura": 0.7,
      "maxTokens": 2000,
      "especialidad": "HVAC",
      "instruccionesEspecificas": ["Instrucción 1", "Instrucción 2"]
    }
  },
  "needsMoreInfo": false,
  "isComplete": true
}

REGLAS IMPORTANTES:
- sistemaId y tipoFormatoId deben ser números del 1-10 basados en los sistemas disponibles
- modeloIA debe ser "gemini-pro" o "gemini-pro-vision"
- temperatura debe ser entre 0.0 y 1.0
- Si no tienes suficiente información, pon "needsMoreInfo": true e "isComplete": false
- Si la configuración está lista, pon "needsMoreInfo": false e "isComplete": true

Sé conversacional, amigable y haz preguntas específicas.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage: Message = {
      sender: 'user',
      text: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      console.log('🔵 Enviando mensaje a Gemini...');
      
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Combinar el system prompt con el primer mensaje del usuario
      const systemPrompt = buildSystemPrompt();
      const fullUserMessage = `${systemPrompt}\n\n---\n\nUsuario: ${userInput}`;
      
      const requestBody = {
        contents: [
          ...conversationHistory,
          {
            role: 'user',
            parts: [{ text: fullUserMessage }]
          }
        ],
        generationConfig: {
          temperature: 0.7
        }
      };

      console.log('📤 Request Body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error Response:', errorText);
        throw new Error(`Error en la API: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📥 Response Data:', JSON.stringify(data, null, 2));

      if (!data.candidates || !data.candidates[0]) {
        throw new Error('La respuesta de la API no contiene candidatos');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      console.log('📝 Response Text:', responseText);

      let parsedResponse;
      try {
        // Intentar extraer JSON si viene envuelto en texto
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          parsedResponse = JSON.parse(responseText);
        }
        console.log('✅ Parsed Response:', parsedResponse);
      } catch (parseError) {
        console.error('❌ Error al parsear JSON:', parseError);
        // Si no es JSON válido, crear una respuesta conversacional
        const botMessage: Message = {
          sender: 'bot',
          text: responseText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        return;
      }

      if (!parsedResponse.chatResponse) {
        throw new Error('La respuesta no contiene chatResponse');
      }

      const botMessage: Message = {
        sender: 'bot',
        text: parsedResponse.chatResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      if (parsedResponse.agentConfig) {
        console.log('💾 Guardando configuración:', parsedResponse.agentConfig);
        setAgentConfig(parsedResponse.agentConfig);
      }

      if (parsedResponse.isComplete && parsedResponse.agentConfig) {
        const confirmMessage: Message = {
          sender: 'bot',
          text: '✅ ¡Perfecto! La configuración está completa. Revisa los detalles en el panel derecho y haz clic en "Guardar Agente" cuando estés listo.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, confirmMessage]);
      }

    } catch (error) {
      console.error('❌ Error completo:', error);
      const errorMessage: Message = {
        sender: 'bot',
        text: `❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}. Por favor, revisa la consola para más detalles.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAgent = async () => {
    if (!agentConfig) return;

    try {
      setIsLoading(true);
      console.log('💾 Guardando agente:', agentConfig);
      
      const agentData = {
        ...agentConfig,
        configuracion: JSON.stringify(agentConfig.configuracion),
        activo: true
      };

      let success = false;
      if (editingAgent) {
        success = await updateAgent(editingAgent.id, agentData as any);
      } else {
        success = await createAgent(agentData as any);
      }

      if (success) {
        const successMessage: Message = {
          sender: 'bot',
          text: `🎉 ¡Agente ${editingAgent ? 'actualizado' : 'creado'} exitosamente! Puedes cerrar esta ventana.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
        
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('No se pudo guardar el agente');
      }
    } catch (error) {
      console.error('❌ Error al guardar agente:', error);
      const errorMessage: Message = {
        sender: 'bot',
        text: `❌ Error al guardar: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {editingAgent ? '🔧 Personalizar Agente' : '🤖 Crear Nuevo Agente'}
            </h3>
            <p className="text-slate-600 mt-1">
              Configura tu agente mediante conversación con IA
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

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col p-6">
            <div
              ref={chatHistoryRef}
              className="flex-1 overflow-y-auto mb-4 space-y-4 bg-slate-50 rounded-xl p-4"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-white text-slate-900 shadow-md border border-slate-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-xs opacity-70 mt-2 block">
                      {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-200">
                    <div className="flex items-center space-x-2">
                      <div className="animate-bounce">💭</div>
                      <span className="text-slate-600">Pensando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading || !userInput.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
              >
                Enviar
              </button>
            </form>
          </div>

          {/* Configuration Panel */}
          <div className="w-96 border-l border-slate-200 p-6 overflow-y-auto bg-slate-50">
            <h4 className="text-lg font-bold text-slate-900 mb-4">
              📋 Configuración del Agente
            </h4>

            {agentConfig ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <h5 className="font-semibold text-slate-700 mb-2">Información Básica</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-slate-500">Nombre:</span>
                      <p className="font-medium text-slate-900">{agentConfig.nombre}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Descripción:</span>
                      <p className="text-slate-700">{agentConfig.descripcion}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Modelo:</span>
                      <p className="font-medium text-slate-900">{agentConfig.modeloIA}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <h5 className="font-semibold text-slate-700 mb-2">Configuración Avanzada</h5>
                  <pre className="text-xs bg-slate-900 text-green-400 p-3 rounded-lg overflow-auto max-h-64">
                    {JSON.stringify(agentConfig.configuracion, null, 2)}
                  </pre>
                </div>

                <button
                  onClick={handleSaveAgent}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg"
                >
                  {isLoading ? '⏳ Guardando...' : '💾 Guardar Agente'}
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤔</div>
                <p className="text-slate-500 text-sm">
                  La configuración del agente aparecerá aquí mientras conversas con el asistente.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentChatConfigurator;