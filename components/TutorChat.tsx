import React, { useState, useRef, useEffect } from 'react';
import { Subject, ChatMessage, EducationLevel } from '../types';
import { getTutorResponse } from '../services/geminiService';
import { MessageSquare, Send, BookOpen, X, Sparkles, Smile } from 'lucide-react';

interface Props {
  subject: Subject;
  level: EducationLevel;
}

const TutorChat: React.FC<Props> = ({ subject, level }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getTutorName = () => {
      switch(level) {
          case EducationLevel.ELEMENTARY: return "Prof. Spark 🌟";
          case EducationLevel.MIDDLE: return "Science Detective";
          default: return "Prof. Nexus";
      }
  }

  const getGreeting = () => {
      switch(level) {
          case EducationLevel.ELEMENTARY: return `Hi! I'm Prof. Spark! Ask me anything about ${subject}!`;
          case EducationLevel.MIDDLE: return `Ready to investigate ${subject}? I can help you solve problems.`;
          default: return `Greetings. I am Prof. Nexus. I can assist with concepts regarding ${subject}.`;
      }
  }

  // Reset chat when level or subject changes
  useEffect(() => {
    setMessages([
        { role: 'model', text: getGreeting(), timestamp: Date.now() }
    ]);
  }, [subject, level]);

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
    const responseText = await getTutorResponse(userMsg.text, subject, level, history);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all z-50 flex items-center gap-3 border border-white/20 ${
            level === EducationLevel.ELEMENTARY ? 'bg-orange-500' : 'bg-slate-900'
        }`}
      >
        {level === EducationLevel.ELEMENTARY ? <Smile size={24} /> : <BookOpen size={24} />}
        <span className="font-bold text-sm hidden md:inline">{getTutorName()} AI</span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 max-w-[90vw] h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border overflow-hidden font-sans ${
        level === EducationLevel.ELEMENTARY ? 'border-orange-300' : 'border-slate-200'
    }`}>
      {/* Header */}
      <div className={`p-4 flex justify-between items-center text-white border-b ${
          level === EducationLevel.ELEMENTARY ? 'bg-orange-500 border-orange-600' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded ${level === EducationLevel.ELEMENTARY ? 'bg-white text-orange-500' : 'bg-lab-teal text-slate-900'}`}>
                <Sparkles size={16} fill="currentColor" />
            </div>
            <div>
                <h3 className="font-bold text-sm">{getTutorName()}</h3>
                <span className={`text-xs block ${level === EducationLevel.ELEMENTARY ? 'text-orange-100' : 'text-slate-400'}`}>
                    {level === EducationLevel.ELEMENTARY ? 'Your Science Pal!' : 'AI Tutor'}
                </span>
            </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100 transition-opacity">
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
                        ? (level === EducationLevel.ELEMENTARY ? 'bg-orange-500 text-white' : 'bg-lab-blue text-white')
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
            placeholder="Ask a question..." 
            className="flex-grow bg-slate-50 border border-slate-200 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all font-mono"
        />
        <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className={`text-white p-2 rounded disabled:opacity-50 transition-colors ${
                level === EducationLevel.ELEMENTARY ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-900 hover:bg-slate-800'
            }`}
        >
            <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default TutorChat;