import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import CaseInterview from './components/CaseInterview';
import ChatbotCaseCompetition from './components/ChatbotCaseCompetition';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to="/case-interview" replace />} 
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
        <Route path="*" element={<Navigate to="/case-interview" replace />} />
      </Routes>
    </Router>
  );
};

export default App;