import React, { useState, useEffect, useRef } from 'react';
import { LucideSend } from 'lucide-react';

export default function Chat() {
    const [messages, setMessages] = useState(() => {
        const stored = localStorage.getItem('scholar_chat_history');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return [];
            }
        }
        return [
            {
                role: 'system',
                text: 'Welcome to ScholarAI Deep-Sea Research. I am ready to dive into archival databases and synthesize meta-analytical insights. What topic would you like to explore today?'
            }
        ];
    });

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [backendStatus, setBackendStatus] = useState('checking'); // 'online', 'mock', 'offline'
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Check backend status on mount
    useEffect(() => {
        fetch('/api/status')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'online') {
                    setBackendStatus(data.provider_available ? 'online' : 'mock');
                } else {
                    setBackendStatus('offline');
                }
            })
            .catch(() => setBackendStatus('offline'));
    }, []);

    useEffect(() => {
        scrollToBottom();
        localStorage.setItem('scholar_chat_history', JSON.stringify(messages));
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        
        const newMessages = [...messages, { role: 'user', text: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    history: messages
                })
            });

            if (!res.ok) throw new Error('API server returned error');
            const data = await res.json();

            setMessages(prev => [...prev, {
                role: 'system',
                text: data.assistant_text || 'No response generated.',
                tool_events: data.tool_events || []
            }]);
        } catch (err) {
            console.warn('Backend unavailable, using client fallback:', err);
            setMessages(prev => [...prev, {
                role: 'system',
                text: `[Offline Fallback] Research Agent processed "${userMsg}". (Backend connection unverified)`,
                tool_events: []
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearHistory = () => {
        if (window.confirm('Clear all chat history?')) {
            const initialMsg = [{
                role: 'system',
                text: 'Welcome to ScholarAI Deep-Sea Research. I am ready to dive into archival databases and synthesize meta-analytical insights. What topic would you like to explore today?'
            }];
            setMessages(initialMsg);
            localStorage.setItem('scholar_chat_history', JSON.stringify(initialMsg));
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex-1 overflow-y-auto p-unit-md md:p-unit-xl pb-32">
                <div className="max-w-3xl mx-auto flex flex-col gap-unit-md">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-outline-variant bg-surface-container-low text-xs text-on-surface-variant font-label-sm">
                                <span className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'online' ? 'bg-emerald-400' : 'bg-secondary'} animate-pulse`}></span>
                                Agent: {backendStatus === 'online' ? 'Python Agent (Live)' : backendStatus === 'mock' ? 'Python Agent (Simulated)' : 'Offline'}
                            </div>
                        </div>
                        <button onClick={clearHistory} className="text-xs text-on-surface-variant hover:text-secondary transition-colors cursor-pointer">Clear History</button>
                    </div>

                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-outline-variant/30 overflow-hidden bg-surface-container-high">
                                {msg.role === 'user' ? (
                                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
                                ) : (
                                    <span className="material-symbols-outlined text-[18px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>science</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary-container text-on-primary-container rounded-tr-sm' : 'glass-card text-on-surface rounded-tl-sm'}`}>
                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                </div>
                                
                                {/* Tool Calls / Events Badge */}
                                {msg.tool_events && msg.tool_events.length > 0 && (
                                    <div className="flex flex-col gap-1.5 mt-1">
                                        {msg.tool_events.map((evt, eIdx) => (
                                            <div key={eIdx} className="bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs text-on-surface-variant flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-secondary font-bold font-display-lg">
                                                    <span className="material-symbols-outlined text-[14px]">build</span>
                                                    <span>Tool Call: {evt.tool || evt.name}</span>
                                                </div>
                                                {evt.args && (
                                                    <div className="text-[11px] font-mono opacity-80">
                                                        Args: {JSON.stringify(evt.args)}
                                                    </div>
                                                )}
                                                {evt.result && (
                                                    <div className="text-[11px] font-mono text-emerald-400/90 bg-surface-container-lowest/80 p-2 rounded max-h-48 overflow-y-auto break-all border border-outline-variant/20">
                                                        Result: {JSON.stringify(evt.result, null, 2)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-4 max-w-[85%]">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-outline-variant/30 overflow-hidden bg-surface-container-high">
                                <span className="material-symbols-outlined text-[18px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>science</span>
                            </div>
                            <div className="p-4 rounded-2xl glass-card text-on-surface rounded-tl-sm">
                                <div className="flex items-center gap-1.5 h-6">
                                    <span className="text-xs text-on-surface-variant mr-2">Agent reasoning...</span>
                                    <div className="w-2 h-2 rounded-full bg-secondary/60 animate-bounce" style={{animationDelay: '0ms'}}></div>
                                    <div className="w-2 h-2 rounded-full bg-secondary/60 animate-bounce" style={{animationDelay: '150ms'}}></div>
                                    <div className="w-2 h-2 rounded-full bg-secondary/60 animate-bounce" style={{animationDelay: '300ms'}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-10 pb-6 px-4 md:px-margin">
                <div className="max-w-3xl mx-auto relative">
                    <form onSubmit={handleSubmit} className="relative group">
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl py-4 pl-4 pr-14 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all resize-none shadow-lg shadow-surface-container-highest/20"
                            placeholder="Ask ScholarAI a research question... (Shift+Enter for newline)"
                            rows="1"
                            style={{minHeight: '60px', maxHeight: '200px'}}
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-secondary text-on-secondary-fixed disabled:opacity-50 disabled:bg-surface-container-high disabled:text-on-surface-variant transition-colors hover:bg-opacity-90 active:scale-95 cursor-pointer"
                        >
                            <LucideSend size={18} />
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <span className="text-[10px] text-on-surface-variant font-label-sm">AI can make mistakes. Verify important information with source citations.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
