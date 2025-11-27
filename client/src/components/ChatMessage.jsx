import React from 'react';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ message, isBot, timestamp }) => {
    return (
        <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
            <div className={`max-w-[85%] ${isBot ? 'bg-white' : 'bg-black text-white'} rounded-2xl px-5 py-4 shadow-sm border border-gray-100`}>
                {isBot && (
                    <div className="flex items-center mb-2 pb-2 border-b border-gray-50">
                        <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center mr-2">
                            <span className="text-white text-xs font-bold">S</span>
                        </div>
                        <span className="text-xs font-bold text-gray-900">Sage</span>
                    </div>
                )}

                <div className={`text-sm leading-relaxed ${isBot ? 'text-gray-800' : 'text-white'}`}>
                    {isBot ? (
                        <ReactMarkdown
                            components={{
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 mt-4" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2 mt-3" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1 mt-2" {...props} />,
                                code: ({ node, inline, className, children, ...props }) => {
                                    return inline ? (
                                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-pink-600" {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <code className="block bg-gray-50 p-3 rounded-lg text-xs font-mono text-gray-800 overflow-x-auto mb-2 border border-gray-100" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-200 pl-3 italic text-gray-500 my-2" {...props} />,
                            }}
                        >
                            {message}
                        </ReactMarkdown>
                    ) : (
                        message
                    )}
                </div>

                {timestamp && (
                    <span className={`text-[10px] ${isBot ? 'text-gray-400' : 'text-gray-400'} block mt-2 text-right`}>
                        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
