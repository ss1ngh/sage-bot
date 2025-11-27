import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <div className="w-full py-4 px-6 flex justify-between items-center max-w-7xl mx-auto shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-md shadow-gray-200">
                        <span className="text-white font-bold text-base">S</span>
                    </div>
                    <span className="font-bold text-lg text-gray-900 tracking-tight">Sage</span>
                </div>
                <div className="flex items-center space-x-6">
                    <Link to="/admin/login" className="text-xs font-medium text-gray-500 hover:text-black transition duration-300">
                        Admin Portal
                    </Link>
                    <Link to="/student/login" className="px-5 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition duration-300 shadow-md shadow-gray-200 hover:shadow-lg hover:-translate-y-0.5">
                        Student Login
                    </Link>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 min-h-0">

                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center text-center mb-8 shrink-0">
                    <div className="mb-6 relative max-w-3xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-100 via-rose-100 to-amber-50 blur-3xl opacity-40 rounded-full transform scale-150 animate-pulse"></div>
                        <h1 className="relative text-4xl md:text-6xl font-bold text-gray-900 tracking-tighter mb-4 leading-[1.1]">
                            Your University <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                                AI Companion
                            </span>
                        </h1>
                        <p className="relative text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed font-light">
                            Sage helps you navigate university life with instant answers to your questions about courses, policies, and campus facilities.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                        <Link
                            to="/student/login"
                            className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 transition duration-300 shadow-lg shadow-gray-200 flex items-center justify-center group text-sm"
                        >
                            Get Started
                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                        <Link
                            to="/admin/login"
                            className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition duration-300 border border-gray-200 shadow-sm hover:shadow-md text-sm"
                        >
                            Admin Access
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full shrink-0">
                    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition duration-300 hover:-translate-y-1">
                        <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center mb-3 shadow-sm">
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-2">Instant Answers</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Get immediate responses to your queries without waiting for emails or office hours.
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition duration-300 hover:-translate-y-1">
                        <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center mb-3 shadow-sm">
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-2">Knowledge Base</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Access a comprehensive database of university policies, schedules, and information.
                        </p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition duration-300 hover:-translate-y-1">
                        <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center mb-3 shadow-sm">
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-2">Smart Escalation</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Complex queries are automatically routed to human administrators for personalized help.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
