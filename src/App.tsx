/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Quiz } from './pages/Quiz';
import { Recommendations } from './pages/Recommendations';
import { EventDetails } from './pages/EventDetails';
import { Venues } from './pages/Venues';
import { Insights } from './pages/Insights';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans text-gray-900">
      <Sidebar />
      <Outlet />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/event/:eventId" element={<EventDetails />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="*" element={<div className="flex-1 p-8">Page not found</div>} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
