// Responsável: Enzo
import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LineupPage from './pages/LineupPage';
import CommunityLineupsPage from './pages/CommunityLineupsPage';
import ExpulsionVotingPage from './pages/ExpulsionVotingPage';
import Header from './components/Header';

function ProtectedLayout({ children }: { children: ReactNode }) {
  return <><Header />{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><ProtectedLayout><DashboardPage /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/lineups" element={<ProtectedRoute><ProtectedLayout><LineupPage /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><ProtectedLayout><CommunityLineupsPage /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/matches/:matchId/vote" element={<ProtectedRoute><ProtectedLayout><ExpulsionVotingPage /></ProtectedLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
