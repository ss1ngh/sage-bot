import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="w-full py-6 px-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <span className="font-semibold text-gray-900">Sage</span>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to="/admin/login" className="text-sm font-medium text-gray-600 hover:text-black transition">
                        Admin Portal
                    </Link>
                    <Link to="/student/login" className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
                        Student Login
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center -mt-20">
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-rose-100 blur-3xl opacity-30 rounded-full transform scale-150"></div>
                    <h1 className="relative text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-6">
                        Your University <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            AI Companion
                        </span>
                    </h1>
                </div>

                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Sage helps you navigate university life with instant answers to your questions about courses, policies, and campus facilities.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/student/login"
                        className="px-8 py-4 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition shadow-lg shadow-gray-200 flex items-center justify-center"
                    >
                        Get Started
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                    <Link
                        to="/admin/login"
                        className="px-8 py-4 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-50 transition border border-gray-200 shadow-sm flex items-center justify-center"
                    >
                        Admin Access
                    </Link>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-6 pb-20 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition">
                        <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center mb-4 shadow-sm">
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Instant Answers</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Get immediate responses to your queries without waiting for emails or office hours.
                        </p>
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition">
                        <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center mb-4 shadow-sm">
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Knowledge Base</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Access a comprehensive database of university policies, schedules, and information.
                        </p>
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition">
                        <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center mb-4 shadow-sm">
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Smart Escalation</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Complex queries are automatically routed to human administrators for personalized help.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
