import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, setToken, setUserData } from '../utils/api';

const AdminLogin = () => {
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
                ? await authAPI.adminSignup(formData)
                : await authAPI.adminLogin({ email: formData.email, password: formData.password });

            if (response.data.success) {
                const { token, admin } = response.data.data;
                setToken(token);
                setUserData({ ...admin, role: 'ADMIN' });
                navigate('/admin/dashboard');
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
                    <div className="inline-block bg-gradient-to-br from-primary-700 to-primary-900 text-white rounded-2xl p-4 mb-4">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-gray-600">
                        {isSignup ? 'Create admin account' : 'Administrative access only'}
                    </p>
                </div>

                {/* Login/Signup Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-primary-100">
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-700 focus:border-transparent outline-none transition"
                                    placeholder="Admin Name"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-700 focus:border-transparent outline-none transition"
                                placeholder="admin@university.edu"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-700 focus:border-transparent outline-none transition"
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
                            className="w-full bg-gradient-to-r from-primary-700 to-primary-900 text-white font-medium py-3 rounded-xl hover:from-primary-800 hover:to-primary-900 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-300"
                        >
                            {loading ? 'Processing...' : (isSignup ? 'Create Admin Account' : 'Admin Sign In')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError('');
                            }}
                            className="text-primary-700 hover:text-primary-800 font-medium text-sm"
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
                    <Link to="/student/login" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        Student Login →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
