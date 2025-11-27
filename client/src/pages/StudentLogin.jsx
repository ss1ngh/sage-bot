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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-xl mb-4 shadow-lg shadow-gray-200">
                        <span className="font-bold text-xl">S</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {isSignup ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-500">
                        {isSignup ? 'Join Sage University' : 'Sign in to continue to Sage'}
                    </p>
                </div>

                {/* Login/Signup Form */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isSignup && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required={isSignup}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                placeholder="student@university.edu"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white font-medium py-3.5 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
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
                            className="text-gray-600 hover:text-black font-medium text-sm transition"
                        >
                            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center space-y-4">
                    <Link to="/admin/login" className="block text-sm text-gray-400 hover:text-gray-600 transition">
                        Admin Access
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;
