import React, { useState, useEffect, useRef } from 'react';
import { chatWithArtHistorian } from '../services/geminiService';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import { Send, User, Bot, Loader2, Globe } from 'lucide-react';

const HistoryChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hola! Soc el teu assistent d'Història de l'Art. Pregunta'm sobre moviments artístics, artistes o context històric. En què et puc ajudar avui?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // Convert internal message format to Gemini history format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await chatWithArtHistorian(history, userMsg.text);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        sources: response.sources
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Ho sento, he tingut un problema connectant amb la base de coneixement. Torna-ho a provar.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-indigo-50 flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-full">
            <Bot className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
            <h2 className="font-serif text-lg font-semibold text-gray-800">El Comissari Virtual</h2>
            <p className="text-xs text-gray-500">Expert en Història de l'Art amb accés a Google Search</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-indigo-600'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gray-800 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                
                {msg.sources && msg.sources.length > 0 && (
                   <div className="mt-4 pt-3 border-t border-gray-200/20">
                     <p className="text-xs font-semibold mb-2 flex items-center gap-1 opacity-80">
                       <Globe size={12} /> Fonts:
                     </p>
                     <ul className="space-y-1">
                       {msg.sources.map((source, idx) => (
                         <li key={idx} className="text-xs truncate">
                           <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:underline opacity-70 hover:opacity-100">
                             {source.title}
                           </a>
                         </li>
                       ))}
                     </ul>
                   </div>
                )}

                <span className={`text-[10px] mt-2 block opacity-70 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-indigo-600 flex items-center justify-center shrink-0">
                    <Bot size={16} />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4 text-indigo-500" />
                    <span className="text-sm text-gray-500">Cercant informació...</span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pregunta sobre artistes, obres o dades actuals..."
            className="flex-1 p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className={`p-3 rounded-xl text-white transition-colors ${!inputText.trim() || loading ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default HistoryChat;