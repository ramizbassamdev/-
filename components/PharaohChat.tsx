import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Crown, MessageSquare, Loader2, RefreshCcw } from 'lucide-react';
import { createPharaohChatSession } from '../services/geminiService';
import { Chat } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const PharaohChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'أهلاً بك يا حفيدي في مملكتي "توتو". أنا الملكة إيزيس، اسألني عن أمجاد أجدادك أو عن أي شيء يجول في خاطرك.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      chatSessionRef.current = createPharaohChatSession();
    } catch (e) {
      console.error("Failed to init chat", e);
      setError("مش قادر اتصل بالمعبد دلوقتي.");
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: userMessage });
      const text = response.text;
      
      setMessages(prev => [...prev, { role: 'model', text: text || '...' }]);
    } catch (err) {
      console.error("Chat error", err);
      setError("الرسالة موصلتش، الحمام الزاجل تاه.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-yellow-600/20 overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-800 to-yellow-600 p-4 flex items-center gap-3 text-white shadow-md">
        <div className="bg-white/20 p-2 rounded-full">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black">دردش مع الملكة إيزيس</h2>
          <p className="text-xs text-yellow-100 opacity-90">دردشة حية من "توتو"</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/papyrus.png')] bg-yellow-50/50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg shrink-0 border-2 
              ${msg.role === 'user' ? 'bg-blue-900 border-blue-700' : 'bg-yellow-500 border-yellow-700'}`}>
              {msg.role === 'user' ? <User className="w-6 h-6 text-white" /> : <Crown className="w-6 h-6 text-yellow-900" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm text-lg leading-relaxed whitespace-pre-wrap
              ${msg.role === 'user' 
                ? 'bg-blue-900 text-white rounded-tr-none' 
                : 'bg-white border border-yellow-200 text-gray-800 rounded-tl-none font-medium'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="w-10 h-10 rounded-full bg-yellow-500 border-2 border-yellow-700 flex items-center justify-center shadow-lg shrink-0">
               <Crown className="w-6 h-6 text-yellow-900" />
             </div>
             <div className="bg-white border border-yellow-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
               <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
               <span className="text-yellow-800 text-sm font-bold">إيزيس بتفكر...</span>
             </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center my-2">
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold border border-red-200">
              {error}
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 border-t border-yellow-600/20 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="اكتب سؤالك للملكة هنا..."
            disabled={isLoading}
            className="flex-1 bg-white border-2 border-yellow-300 rounded-xl px-4 py-3 text-gray-800 placeholder-yellow-800/50 focus:outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20 transition-all font-medium"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl px-6 py-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharaohChat;