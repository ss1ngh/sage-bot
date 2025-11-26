import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, setToken, setUserData } from '../utils/api';

const StudentLogin = () => {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = isSignup
                ? await authAPI.studentSignup(formData)
                : await authAPI.studentLogin({ email: formData.email, password: formData.password });

            if (response.data.success) {
                const { token, user } = response.data.data;
                setToken(token);
                setUserData({ ...user, role: 'STUDENT' });
                navigate('/student/chat');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-light flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl p-4 mb-4">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Sage University Bot
                    </h1>
                    <p className="text-gray-600">
                        {isSignup ? 'Create your student account' : 'Welcome back, Student'}
                    </p>
                </div>

                {/* Login/Signup Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isSignup && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={isSignup}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                placeholder="student@university.edu"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary-500 to-primary-700 text-white font-medium py-3 rounded-xl hover:from-primary-600 hover:to-primary-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-200"
                        >
                            {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError('');
                            }}
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link to="/admin/login" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        Admin Login →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;
