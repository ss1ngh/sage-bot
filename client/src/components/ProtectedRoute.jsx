import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUserData } from '../utils/api';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = getToken();
    const userData = getUserData();

    if (!token || !userData) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && userData.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
