import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext, useEffect } from 'react';
import './index.css';

// Pages
import LoginPage from './pages/LoginPage';
import FournisseurDashboard from './pages/FournisseurDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AcheteurDashboard from './pages/AcheteurDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CataloguePage from './pages/CataloguePage';
import MesAchatsPage from './pages/MesAchatsPage';
import MesLeadsPage from './pages/MesLeadsPage';
import HistoriqueAppelsPage from './pages/HistoriqueAppelsPage';
import SettingsPage from './pages/SettingsPage';
import CreditsPage from './pages/CreditsPage';
import InscriptionPage from './pages/InscriptionPage';
import AdminLeadsPage from './pages/AdminLeadsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import type { UserRole } from './types';

// Auth Context
interface AuthContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  setRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Protected Route
function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: UserRole }) {
  const { role, setRole } = useAuth();
  
  // For demo purposes: auto-set role based on URL if not authenticated
  useEffect(() => {
    if (!role) {
      setRole(allowedRole);
    }
  }, [role, allowedRole, setRole]);
  
  if (!role) {
    return null; // or a loading spinner
  }
  
  if (role !== allowedRole) {
    return <Navigate to={`/${role}`} replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const [role, setRole] = useState<UserRole | null>(null);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      <Router>
        <Routes>
          {/* Login Page */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Inscription & Onboarding */}
          <Route path="/inscription" element={<InscriptionPage />} />
          
          
          {/* Fournisseur Dashboard */}
          <Route
            path="/fournisseur"
            element={
              <ProtectedRoute allowedRole="fournisseur">
                <FournisseurDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Agent Dashboard */}
          <Route
            path="/agent"
            element={
              <ProtectedRoute allowedRole="agent">
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Acheteur Dashboard */}
          <Route
            path="/acheteur"
            element={
              <ProtectedRoute allowedRole="acheteur">
                <AcheteurDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/acheteur/catalogue"
            element={
              <ProtectedRoute allowedRole="acheteur">
                <CataloguePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/acheteur/achats"
            element={
              <ProtectedRoute allowedRole="acheteur">
                <MesAchatsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/acheteur/credits"
            element={
              <ProtectedRoute allowedRole="acheteur">
                <CreditsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/acheteur/settings"
            element={
              <ProtectedRoute allowedRole="acheteur">
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Fournisseur - Additional Pages */}
          <Route
            path="/fournisseur/leads"
            element={
              <ProtectedRoute allowedRole="fournisseur">
                <MesLeadsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fournisseur/settings"
            element={
              <ProtectedRoute allowedRole="fournisseur">
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Agent - Additional Pages */}
          <Route
            path="/agent/historique"
            element={
              <ProtectedRoute allowedRole="agent">
                <HistoriqueAppelsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/settings"
            element={
              <ProtectedRoute allowedRole="agent">
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLeadsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/utilisateurs"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRole="admin">
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
