import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Minimize2 } from "lucide-react";
import axiosClient from "../api/axiosClient";
import ReactMarkdown from "react-markdown";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "¡Hola! Soy el asistente tecnico de Servitek. ¿En que te puedo ayudar hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const { data } = await axiosClient.post("/chat", { message: userMsg });
      setMessages((prev) => [...prev, { role: "assistant", text: data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", text: "Ocurrio un error al comunicarme con mis sensores. Intenta nuevamente." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-500 hover:bg-brand-600 rounded-full shadow-lg shadow-brand-500/30 flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 cursor-pointer z-50 animate-bounce-subtle"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-[350px] bg-surface-900 border border-surface-700 shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-surface-800 p-4 border-b border-surface-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-100">Servitek AI</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-[10px] text-surface-400 uppercase tracking-wider font-semibold">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsOpen(false)} className="p-1.5 text-surface-400 hover:text-slate-200 hover:bg-surface-700 rounded-lg transition-colors">
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-surface-900/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${m.role === "user" ? "bg-surface-800" : "bg-brand-500/20"}`}>
              {m.role === "user" ? <User className="w-4 h-4 text-surface-400" /> : <Bot className="w-4 h-4 text-brand-400" />}
            </div>
            <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${m.role === "user" ? "bg-brand-500 text-white rounded-tr-sm" : "bg-surface-800 border border-surface-700 text-slate-200 rounded-tl-sm"}`}>
              {m.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>
              ) : (
                m.text
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 shrink-0 rounded-full bg-brand-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-brand-400" />
            </div>
            <div className="bg-surface-800 border border-surface-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-surface-800 border-t border-surface-700">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta..."
            className="w-full bg-surface-900 border border-surface-700 text-slate-200 text-sm rounded-full pl-4 pr-12 py-2.5 focus:outline-none focus:border-brand-500 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1 top-1 bottom-1 w-8 rounded-full bg-brand-500 hover:bg-brand-600 disabled:bg-surface-700 disabled:text-surface-500 text-white flex items-center justify-center transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
