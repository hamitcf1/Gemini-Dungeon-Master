
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { User, Sparkles } from 'lucide-react';

interface ChatLogProps {
  messages: ChatMessage[];
  t?: Record<string, string>;
}

const ChatLog: React.FC<ChatLogProps> = ({ messages, t }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only scroll to bottom if near bottom or if it's the very first load
    if (containerRef.current) {
       const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
       const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
       
       if (isNearBottom || messages.length <= 1) {
          containerRef.current.scrollTop = scrollHeight;
       }
    }
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950/50 rounded-lg border border-gray-800">
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20 italic">
              <p>{t?.log || "Log"}</p>
              <p className="text-sm mt-2">{t?.connect || "Connect to start"}</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-blue-900/50 text-blue-300' : 'bg-violet-900/50 text-violet-300'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              
              <div className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-950/40 border border-blue-900/50 text-blue-100' 
                  : 'bg-violet-950/40 border border-violet-900/50 text-violet-100'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
    </div>
  );
};

export default ChatLog;
