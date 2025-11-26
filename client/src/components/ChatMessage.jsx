import React from 'react';

const ChatMessage = ({ message, isBot, timestamp }) => {
    return (
        <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
            <div className={`max-w-[70%] ${isBot ? 'bg-white' : 'bg-primary-500'} rounded-2xl px-4 py-3 shadow-sm`}>
                {isBot && (
                    <div className="flex items-center mb-1">
                        <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-2">
                            <span className="text-white text-xs font-semibold">S</span>
                        </div>
                        <span className="text-xs font-medium text-gray-600">Sage Bot</span>
                    </div>
                )}
                <p className={`text-sm ${isBot ? 'text-gray-800' : 'text-white'}`}>
                    {message}
                </p>
                {timestamp && (
                    <span className={`text-xs ${isBot ? 'text-gray-400' : 'text-primary-100'} block mt-1`}>
                        {new Date(timestamp).toLocaleTimeString()}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
