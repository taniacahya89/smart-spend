import React, { useState, useRef, useEffect } from 'react';
import { AdvisorMessage } from '@/types';
import { TypingIndicator } from './TypingIndicator';
import { Send, Sparkles } from 'lucide-react';

interface AdvisorChatProps {
  history: AdvisorMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export const AdvisorChat: React.FC<AdvisorChatProps> = ({
  history,
  onSendMessage,
  isLoading,
}) => {
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-xl flex flex-col h-[500px] select-none justify-between">
      {/* Mini chat header */}
      <div className="flex items-center gap-2 pb-3.5 border-b border-border/40 mb-3 shrink-0">
        <Sparkles className="w-4.5 h-4.5 text-primary" />
        <div>
          <h4 className="text-sm font-bold text-text-primary">Tanya Lanjutan Ke AI</h4>
          <span className="text-[10px] text-text-secondary">Tanyakan tips menghemat, saran belanja, dll.</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 select-text">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-text-secondary">
            <p className="text-xs font-semibold max-w-[280px] leading-relaxed">
              Belum ada obrolan. Ketik pertanyaanmu di bawah untuk berkonsultasi lebih lanjut dengan AI Advisor!
            </p>
          </div>
        ) : (
          history.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#6C63FF] text-white rounded-tr-sm shadow-md shadow-[#6C63FF]/15'
                      : 'bg-[#2A2D3A] border border-border/50 text-text-primary rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className={`block text-[9px] text-right mt-1.5 ${isUser ? 'text-white/70' : 'text-text-secondary'}`}>
                    {new Intl.DateTimeFormat('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* AI Typing Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Box */}
      <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan sesuatu ke advisor..."
          className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-3 bg-primary hover:bg-primary-hover text-text-primary rounded-xl transition-all flex items-center justify-center shrink-0 active:scale-[0.97] disabled:bg-primary/50 disabled:cursor-not-allowed shadow-md shadow-primary/15"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
};
