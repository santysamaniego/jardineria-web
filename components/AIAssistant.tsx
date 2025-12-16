import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGardenAdvice } from '../services/geminiService';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: '¡Hola! Soy tu asistente de jardinería. 🌱 ¿Tenés alguna duda sobre tus plantas o necesitas recomendación de productos?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { products } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    // Update context with real contact info before sending
    const enrichedQuery = `${userMsg} (Contexto adicional: El WhatsApp de contacto es 1140872286, Lucas. Instagram: jardineriaseverino).`;

    const botResponse = await getGardenAdvice(enrichedQuery, products);

    setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    setIsLoading(false);
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-jungle-600 hover:bg-jungle-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center gap-2"
        >
          <Bot size={24} />
          <span className="hidden md:inline font-bold">Asistente Virtual</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-jungle-100 animate-fade-in-up">
          {/* Header */}
          <div className="bg-jungle-800 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-jungle-500 p-1.5 rounded-full">
                <Leaf size={16} />
              </div>
              <div>
                <h3 className="font-bold text-sm">El Jardinero Virtual</h3>
                <span className="text-xs text-jungle-300 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  En línea
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-jungle-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Preguntá sobre hongos, poda, riego..."
              className="flex-grow bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-jungle-300"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-jungle-600 text-white p-2 rounded-full hover:bg-jungle-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant;