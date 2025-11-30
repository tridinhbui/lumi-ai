import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import HomePage from './components/HomePage';
import HomeDashboard from './components/HomeDashboard';
import CaseInterview from './components/CaseInterview';
import ChatbotCaseCompetition from './components/ChatbotCaseCompetition';
import LumiWorkspace from './components/LumiWorkspace';
import LearningDashboard from './components/LearningDashboard';
import Settings from './components/Settings';
import CaseCompetitionChat from './components/CaseCompetitionChat';
import GeneralAssistantChat from './components/GeneralAssistantChat';
import SubscriptionPage from './components/SubscriptionPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/home" replace /> : <HomePage />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomeDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lumi" 
          element={
            <ProtectedRoute>
              <LumiWorkspace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <LearningDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/case-interview" 
          element={
            <ProtectedRoute>
              <CaseInterview />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <ChatbotCaseCompetition />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/case-competition" 
          element={
            <ProtectedRoute>
              <CaseCompetitionChat />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/general-assistant" 
          element={
            <ProtectedRoute>
              <GeneralAssistantChat />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/subscription" 
          element={
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;