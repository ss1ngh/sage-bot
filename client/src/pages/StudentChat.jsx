import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatMessage from '../components/ChatMessage';
import { chatAPI, getUserData, getToken, removeToken, removeUserData } from '../utils/api';

const EXAMPLE_QUERIES = [
    "What are the hackathon deadline dates?",
    "Explain the internship policy",
    "Where is the library located?",
    "How do I register for courses?"
];

const StudentChat = () => {
    const navigate = useNavigate();
    const userData = getUserData();
    const token = getToken();
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [escalated, setEscalated] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat history on mount
    useEffect(() => {
        if (userData?.id && token) {
            loadChatHistory();
        }
    }, []);

    const loadChatHistory = async () => {
        try {
            const response = await chatAPI.getChatHistory(userData.id, token);
            if (response.data.success && response.data.data.length > 0) {
                const history = response.data.data.map((msg, idx) => ({
                    id: msg.id || `history-${idx}`,
                    message: msg.message,
                    isBot: msg.isBot,
                    timestamp: msg.createdAt
                }));
                setMessages(history);
            }
        } catch (error) {
            console.error('Error loading history:', error);
        }
    };

    const handleSendMessage = async (e, text = inputMessage) => {
        if (e) e.preventDefault();
        if (!text.trim() || loading) return;

        const userMessage = {
            id: `user-${Date.now()}`,
            message: text,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setLoading(true);

        try {
            const response = await chatAPI.sendMessage(userData.id, text, token);

            if (response.data.success) {
                const { response: botResponse, shouldEscalate } = response.data.data;

                const botMessage = {
                    id: `bot-${Date.now()}`,
                    message: botResponse,
                    isBot: true,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, botMessage]);

                if (shouldEscalate) {
                    setEscalated(true);
                    setTimeout(() => setEscalated(false), 5000);
                }
            }
        } catch (error) {
            const errorMessage = {
                id: `error-${Date.now()}`,
                message: 'Sorry, I encountered an error. Please try again.',
                isBot: true,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        removeToken();
        removeUserData();
        navigate('/');
    };

    const showHero = messages.length === 0;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="fixed top-0 w-full bg-white/50 backdrop-blur-sm z-10">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="font-semibold text-gray-800">Sage</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            {userData?.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition text-xs font-medium"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 pt-20 pb-4">

                {showHero ? (
                    /* Hero View */
                    <div className="flex-1 flex flex-col justify-center items-center space-y-8 -mt-20">
                        <h1 className="text-3xl font-semibold text-gray-800">What can I help with?</h1>

                        <div className="w-full max-w-2xl relative">
                            <form onSubmit={(e) => handleSendMessage(e)} className="relative">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Ask Sage anything..."
                                    className="w-full p-4 pr-12 rounded-2xl border border-gray-200 shadow-sm focus:shadow-md focus:border-gray-300 outline-none transition-all text-lg"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!inputMessage.trim()}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </button>
                            </form>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                            {EXAMPLE_QUERIES.map((query, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(null, query)}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
                                >
                                    {query} <span className="text-gray-400 ml-1">→</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Chat View */
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 overflow-y-auto space-y-6 pb-4">
                            {messages.map((msg) => (
                                <ChatMessage
                                    key={msg.id}
                                    message={msg.message}
                                    isBot={msg.isBot}
                                    timestamp={msg.timestamp}
                                />
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="sticky bottom-0 bg-gradient-to-t from-[#f8fafc] to-transparent pt-4 pb-2">
                            <form onSubmit={(e) => handleSendMessage(e)} className="relative">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Message Sage..."
                                    className="w-full p-4 pr-12 rounded-2xl border border-gray-200 shadow-sm focus:shadow-md focus:border-gray-300 outline-none transition-all bg-white"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !inputMessage.trim()}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </button>
                            </form>
                            <p className="text-center text-xs text-gray-400 mt-2">
                                Sage can make mistakes. Consider checking important information.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Escalation Toast */}
            {escalated && (
                <div className="fixed bottom-24 right-4 max-w-sm bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-lg flex items-start space-x-3 animate-fade-in-up">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <h3 className="font-medium text-amber-900">Escalated to Admin</h3>
                        <p className="text-sm text-amber-700 mt-1">
                            An admin will review this query shortly.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentChat;
