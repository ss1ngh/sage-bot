import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-light flex items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center">
                {/* Logo */}
                <div className="mb-8">
                    <div className="inline-block bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-3xl p-6 mb-6 shadow-2xl shadow-primary-200">
                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        Sage University Bot
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Your intelligent assistant for all university-related queries. Get instant answers powered by AI.
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">Instant Answers</h3>
                        <p className="text-sm text-gray-600">Get quick responses to your university-related questions using advanced AI</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">Rich Knowledge Base</h3>
                        <p className="text-sm text-gray-600">Access information from university documents and policies</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">Admin Support</h3>
                        <p className="text-sm text-gray-600">Complex queries are escalated to administrators for personalized assistance</p>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/student/login"
                        className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-800 transition shadow-xl shadow-primary-200 transform hover:scale-105"
                    >
                        Student Login
                    </Link>
                    <Link
                        to="/admin/login"
                        className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition shadow-lg border-2 border-primary-200 transform hover:scale-105"
                    >
                        Admin Login
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-16 text-sm text-gray-500">
                    <p>Powered by Gemini AI • Built with React & Express</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
