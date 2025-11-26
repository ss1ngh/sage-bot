import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, ingestionAPI, getUserData, getToken, removeToken, removeUserData } from '../utils/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const userData = getUserData();
    const token = getToken();

    const [activeTab, setActiveTab] = useState('escalations');
    const [escalations, setEscalations] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedEscalation, setSelectedEscalation] = useState(null);
    const [resolution, setResolution] = useState('');

    // Upload state
    const [uploadType, setUploadType] = useState('pdf');
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadText, setUploadText] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    useEffect(() => {
        if (activeTab === 'escalations') {
            loadEscalations();
            loadStats();
        } else if (activeTab === 'upload') {
            loadDocuments();
        }
    }, [activeTab]);

    const loadEscalations = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getEscalations(token);
            if (response.data.success) {
                setEscalations(response.data.data);
            }
        } catch (error) {
            console.error('Error loading escalations:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await adminAPI.getStats(token);
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadDocuments = async () => {
        setLoading(true);
        try {
            const response = await ingestionAPI.getDocuments(token);
            if (response.data.success) {
                setDocuments(response.data.data);
            }
        } catch (error) {
            console.error('Error loading documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolveEscalation = async () => {
        if (!resolution.trim() || !selectedEscalation) return;

        try {
            const response = await adminAPI.resolveEscalation(selectedEscalation.id, resolution, token);
            if (response.data.success) {
                setSelectedEscalation(null);
                setResolution('');
                loadEscalations();
            }
        } catch (error) {
            console.error('Error resolving escalation:', error);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!uploadTitle.trim()) {
            setUploadMessage('Please enter a title');
            return;
        }

        if (uploadType === 'pdf' && !uploadFile) {
            setUploadMessage('Please select a PDF file');
            return;
        }

        if (uploadType === 'text' && !uploadText.trim()) {
            setUploadMessage('Please enter some text');
            return;
        }

        setUploading(true);
        setUploadMessage('');

        try {
            let response;
            if (uploadType === 'pdf') {
                response = await ingestionAPI.uploadPDF(uploadFile, uploadTitle, token);
            } else {
                response = await ingestionAPI.uploadText(uploadTitle, uploadText, token);
            }

            if (response.data.success) {
                setUploadMessage('✓ Document uploaded and processed successfully!');
                setUploadTitle('');
                setUploadText('');
                setUploadFile(null);
                loadDocuments();
                setTimeout(() => setUploadMessage(''), 3000);
            }
        } catch (error) {
            setUploadMessage('Error uploading document: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
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
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-primary-900 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                            <p className="text-sm text-gray-500">University Chatbot Management</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            <span className="font-medium">{userData?.name}</span>
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

            {/* Stats Cards */}
            {stats.totalUsers !== undefined && (
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                            <div className="text-gray-500 text-sm font-medium">Total Users</div>
                            <div className="text-2xl font-bold text-gray-800 mt-1">{stats.totalUsers}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                            <div className="text-gray-500 text-sm font-medium">Documents</div>
                            <div className="text-2xl font-bold text-gray-800 mt-1">{stats.totalDocuments}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                            <div className="text-gray-500 text-sm font-medium">Total Messages</div>
                            <div className="text-2xl font-bold text-gray-800 mt-1">{stats.totalMessages}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                            <div className="text-gray-500 text-sm font-medium">Escalations</div>
                            <div className="text-2xl font-bold text-gray-800 mt-1">{stats.totalEscalations}</div>
                        </div>
                        <div className="bg-amber-50 rounded-xl shadow-sm p-4 border border-amber-200">
                            <div className="text-amber-700 text-sm font-medium">Pending</div>
                            <div className="text-2xl font-bold text-amber-900 mt-1">{stats.pendingEscalations}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex space-x-2 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('escalations')}
                        className={`px-6 py-3 font-medium transition relative ${activeTab === 'escalations'
                                ? 'text-primary-700 border-b-2 border-primary-700'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Escalated Issues
                        {stats.pendingEscalations > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
                                {stats.pendingEscalations}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-6 py-3 font-medium transition ${activeTab === 'upload'
                                ? 'text-primary-700 border-b-2 border-primary-700'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Upload Knowledge Base
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                {activeTab === 'escalations' && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Escalated Queries</h2>

                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading...</div>
                        ) : escalations.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No escalated queries</div>
                        ) : (
                            <div className="space-y-3">
                                {escalations.map((esc) => (
                                    <div
                                        key={esc.id}
                                        className="border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-sm transition"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${esc.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                                            esc.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                                                                'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {esc.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(esc.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-800 font-medium mb-1">{esc.query}</p>
                                                <p className="text-sm text-gray-500">
                                                    Student: {esc.user?.name} ({esc.user?.email})
                                                </p>
                                                {esc.resolution && (
                                                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                                                        <p className="text-sm text-green-800">
                                                            <strong>Resolution:</strong> {esc.resolution}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            {esc.status === 'PENDING' && (
                                                <button
                                                    onClick={() => setSelectedEscalation(esc)}
                                                    className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
                                                >
                                                    Resolve
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Resolution Modal */}
                        {selectedEscalation && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Resolve Escalation</h3>
                                    <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-600 mb-1">Query:</p>
                                        <p className="text-gray-800 font-medium">{selectedEscalation.query}</p>
                                    </div>
                                    <textarea
                                        value={resolution}
                                        onChange={(e) => setResolution(e.target.value)}
                                        placeholder="Enter your resolution..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none h-32 resize-none"
                                    />
                                    <div className="flex justify-end space-x-3 mt-4">
                                        <button
                                            onClick={() => {
                                                setSelectedEscalation(null);
                                                setResolution('');
                                            }}
                                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleResolveEscalation}
                                            disabled={!resolution.trim()}
                                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Submit Resolution
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'upload' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Upload Form */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Upload Document</h2>

                            <div className="flex space-x-2 mb-6">
                                <button
                                    onClick={() => setUploadType('pdf')}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${uploadType === 'pdf'
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    PDF Upload
                                </button>
                                <button
                                    onClick={() => setUploadType('text')}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${uploadType === 'text'
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Text Input
                                </button>
                            </div>

                            <form onSubmit={handleFileUpload} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Document Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadTitle}
                                        onChange={(e) => setUploadTitle(e.target.value)}
                                        placeholder="e.g., Library Hours and Policies"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                        required
                                    />
                                </div>

                                {uploadType === 'pdf' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            PDF File *
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 transition">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => setUploadFile(e.target.files[0])}
                                                className="hidden"
                                                id="pdf-upload"
                                                required
                                            />
                                            <label htmlFor="pdf-upload" className="cursor-pointer">
                                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-sm text-gray-600">
                                                    {uploadFile ? uploadFile.name : 'Click to upload PDF or drag and drop'}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">PDF up to 10MB</p>
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Text Content *
                                        </label>
                                        <textarea
                                            value={uploadText}
                                            onChange={(e) => setUploadText(e.target.value)}
                                            placeholder="Paste your document content here..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none h-64 resize-none font-mono text-sm"
                                            required
                                        />
                                    </div>
                                )}

                                {uploadMessage && (
                                    <div className={`p-3 rounded-xl text-sm ${uploadMessage.startsWith('✓')
                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                        }`}>
                                        {uploadMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-800 text-white font-medium rounded-xl hover:from-primary-700 hover:to-primary-900 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-200"
                                >
                                    {uploading ? 'Processing...' : 'Upload & Process'}
                                </button>
                            </form>
                        </div>

                        {/* Uploaded Documents List */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Uploaded Documents</h2>

                            {loading ? (
                                <div className="text-center py-8 text-gray-500">Loading...</div>
                            ) : documents.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">No documents uploaded yet</div>
                            ) : (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                    {documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-sm transition"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${doc.type === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {doc.type}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {doc.chunkCount} chunks
                                                        </span>
                                                    </div>
                                                    <h3 className="font-medium text-gray-800">{doc.title}</h3>
                                                    {doc.filename && (
                                                        <p className="text-xs text-gray-500 mt-1">{doc.filename}</p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(doc.uploadedAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
