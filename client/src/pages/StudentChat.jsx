import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatMessage from '../components/ChatMessage';
import { chatAPI, getUserData, getToken, removeToken, removeUserData } from '../utils/api';

const StudentChat = () => {
    const navigate = useNavigate();
    const userData = getUserData();
    const token = getToken();
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            message: 'Hello! How can I help you today?',
            isBot: true,
            timestamp: new Date()
        }
    ]);
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
                setMessages([...messages, ...history]);
            }
        } catch (error) {
            console.error('Error loading history:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || loading) return;

        const userMessage = {
            id: `user-${Date.now()}`,
            message: inputMessage,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setLoading(true);

        try {
            const response = await chatAPI.sendMessage(userData.id, inputMessage, token);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-light">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Sage Chat</h1>
                            <p className="text-sm text-gray-500">University Assistant</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            Welcome, <span className="font-medium">{userData?.name}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Escalation Alert */}
            {escalated && (
                <div className="max-w-4xl mx-auto px-4 mt-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
                        <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h3 className="font-medium text-amber-900">Query Escalated to Admin</h3>
                            <p className="text-sm text-amber-700 mt-1">
                                I've escalated your query to an administrator who will provide a detailed response soon.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Messages */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-lg h-[calc(100vh-280px)] flex flex-col">
                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 p-4">
                        <form onSubmit={handleSendMessage} className="flex space-x-3">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !inputMessage.trim()}
                                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentChat;
