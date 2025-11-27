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
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="sticky top-0 w-full bg-white/50 backdrop-blur-sm z-10 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <span className="font-semibold text-gray-900">Admin Dashboard</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            {userData?.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition text-xs font-medium"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            {stats.totalUsers !== undefined && (
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                            <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Users</div>
                            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                            <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">Documents</div>
                            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalDocuments}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                            <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">Messages</div>
                            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalMessages}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                            <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">Escalations</div>
                            <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalEscalations}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-16 h-16 bg-amber-50 rounded-bl-full -mr-8 -mt-8"></div>
                            <div className="text-amber-600 text-xs font-medium uppercase tracking-wider relative z-10">Pending</div>
                            <div className="text-2xl font-bold text-gray-900 mt-1 relative z-10">{stats.pendingEscalations}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex space-x-6 border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('escalations')}
                        className={`pb-3 font-medium text-sm transition relative ${activeTab === 'escalations'
                            ? 'text-black border-b-2 border-black'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Escalated Issues
                        {stats.pendingEscalations > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] rounded-full">
                                {stats.pendingEscalations}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`pb-3 font-medium text-sm transition ${activeTab === 'upload'
                            ? 'text-black border-b-2 border-black'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Knowledge Base
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'escalations' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Escalated Queries</h2>

                        {loading ? (
                            <div className="text-center py-12 text-gray-400">Loading...</div>
                        ) : escalations.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">No escalated queries found</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {escalations.map((esc) => (
                                    <div
                                        key={esc.id}
                                        className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col h-full group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-2 h-2 rounded-full ${esc.status === 'PENDING' ? 'bg-amber-500' :
                                                    esc.status === 'RESOLVED' ? 'bg-green-500' :
                                                        'bg-blue-500'
                                                    }`}></div>
                                                <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
                                                    {esc.status}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400 font-mono">
                                                {new Date(esc.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex-1 mb-6">
                                            <h3 className="text-gray-900 font-semibold text-lg leading-snug mb-1 line-clamp-3">
                                                "{esc.query}"
                                            </h3>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-gray-50">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                        {esc.user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-gray-900">
                                                            {esc.user?.name}
                                                        </span>
                                                        <span className="text-[10px] text-gray-500">
                                                            {esc.user?.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {esc.resolution ? (
                                                <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                                                    <p className="text-xs text-green-800">
                                                        <span className="font-semibold">Resolved:</span> {esc.resolution}
                                                    </p>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setSelectedEscalation(esc)}
                                                    className="w-full py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition shadow-lg shadow-gray-200 group-hover:scale-[1.02] active:scale-95"
                                                >
                                                    Resolve Query
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Resolution Modal */}
                        {selectedEscalation && (
                            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Resolve Escalation</h3>
                                    <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Query</p>
                                        <p className="text-gray-900 font-medium text-lg">{selectedEscalation.query}</p>
                                    </div>
                                    <textarea
                                        value={resolution}
                                        onChange={(e) => setResolution(e.target.value)}
                                        placeholder="Enter your resolution..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none h-32 resize-none text-gray-800"
                                    />
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            onClick={() => {
                                                setSelectedEscalation(null);
                                                setResolution('');
                                            }}
                                            className="px-5 py-2.5 text-gray-600 hover:text-gray-900 transition font-medium text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleResolveEscalation}
                                            disabled={!resolution.trim()}
                                            className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Upload Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Add to Knowledge Base</h2>

                            <div className="flex space-x-2 mb-6 p-1 bg-gray-100 rounded-xl">
                                <button
                                    onClick={() => setUploadType('pdf')}
                                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${uploadType === 'pdf'
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    PDF Upload
                                </button>
                                <button
                                    onClick={() => setUploadType('text')}
                                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${uploadType === 'text'
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Text Input
                                </button>
                            </div>

                            <form onSubmit={handleFileUpload} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Document Title
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadTitle}
                                        onChange={(e) => setUploadTitle(e.target.value)}
                                        placeholder="e.g., Library Hours and Policies"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                                        required
                                    />
                                </div>

                                {uploadType === 'pdf' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            PDF File
                                        </label>
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-400 transition bg-gray-50/50">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={(e) => setUploadFile(e.target.files[0])}
                                                className="hidden"
                                                id="pdf-upload"
                                                required
                                            />
                                            <label htmlFor="pdf-upload" className="cursor-pointer block">
                                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {uploadFile ? uploadFile.name : 'Click to upload PDF'}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">Up to 10MB</p>
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Text Content
                                        </label>
                                        <textarea
                                            value={uploadText}
                                            onChange={(e) => setUploadText(e.target.value)}
                                            placeholder="Paste your document content here..."
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none h-64 resize-none font-mono text-sm"
                                            required
                                        />
                                    </div>
                                )}

                                {uploadMessage && (
                                    <div className={`p-3 rounded-xl text-sm ${uploadMessage.startsWith('✓')
                                        ? 'bg-green-50 text-green-700 border border-green-100'
                                        : 'bg-red-50 text-red-700 border border-red-100'
                                        }`}>
                                        {uploadMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full px-6 py-3.5 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
                                >
                                    {uploading ? 'Processing...' : 'Upload & Process'}
                                </button>
                            </form>
                        </div>

                        {/* Uploaded Documents List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Uploaded Documents</h2>

                            {loading ? (
                                <div className="text-center py-12 text-gray-400">Loading...</div>
                            ) : documents.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">No documents uploaded yet</div>
                            ) : (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                    {documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="group border border-gray-100 rounded-xl p-4 hover:border-gray-300 transition bg-gray-50/50 hover:bg-white"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${doc.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                                            }`}>
                                                            {doc.type}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {doc.chunkCount} chunks
                                                        </span>
                                                    </div>
                                                    <h3 className="font-medium text-gray-900">{doc.title}</h3>
                                                    {doc.filename && (
                                                        <p className="text-xs text-gray-500 mt-1 font-mono">{doc.filename}</p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-2">
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
