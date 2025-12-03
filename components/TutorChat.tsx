import React, { useState, useRef, useEffect } from 'react';
import { Subject, ChatMessage } from '../types';
import { getTutorResponse } from '../services/geminiService';
import { MessageSquare, Send, BookOpen, X, Sparkles } from 'lucide-react';

interface Props {
  subject: Subject;
}

const TutorChat: React.FC<Props> = ({ subject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Greetings. I am Prof. Nexus. I can assist with formulas, derivations, or conceptual questions regarding ${subject}.`, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(prev => [
        ...prev, 
        { role: 'model', text: `Module switched to ${subject}. How can I assist with your research?`, timestamp: Date.now() }
    ]);
  }, [subject]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.slice(-5).map(m => `${m.role}: ${m.text}`);
    const responseText = await getTutorResponse(userMsg.text, subject, history);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-slate-800 transition-all hover:scale-105 z-50 flex items-center gap-3 border border-slate-700"
      >
        <BookOpen size={24} />
        <span className="font-bold text-sm hidden md:inline">Prof. Nexus AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[90vw] h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-slate-900 p-4 flex justify-between items-center text-white border-b border-slate-800">
        <div className="flex items-center gap-3">
            <div className="bg-lab-teal p-1.5 rounded text-slate-900">
                <Sparkles size={16} fill="currentColor" />
            </div>
            <div>
                <h3 className="font-bold text-sm">Prof. Nexus</h3>
                <span className="text-xs text-slate-400 block">Advanced Tutor Model v2.5</span>
            </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-hide">
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                    className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-lab-blue text-white' 
                        : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
                    }`}
                >
                    {msg.text}
                </div>
            </div>
        ))}
        {isLoading && (
             <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                    </div>
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Input query or equation..." 
            className="flex-grow bg-slate-50 border border-slate-200 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all font-mono"
        />
        <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-slate-900 text-white p-2 rounded hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
            <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default TutorChat;