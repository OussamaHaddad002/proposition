import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext, useEffect } from 'react';
import './index.css';

// Pages — Public
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import InscriptionPage from './pages/public/InscriptionPage';
import PublicCataloguePage from './pages/public/PublicCataloguePage';

// Pages — Fournisseur
import FournisseurDashboard from './pages/fournisseur/FournisseurDashboard';
import MesLeadsPage from './pages/fournisseur/MesLeadsPage';

// Pages — Acheteur
import AcheteurDashboard from './pages/acheteur/AcheteurDashboard';
import CataloguePage from './pages/acheteur/CataloguePage';
import MesAchatsPage from './pages/acheteur/MesAchatsPage';
import CreditsPage from './pages/acheteur/CreditsPage';
import AcheteurSettingsPage from './pages/acheteur/AcheteurSettingsPage';

// Pages — Agent
import AgentDashboard from './pages/agent/AgentDashboard';
import HistoriqueAppelsPage from './pages/agent/HistoriqueAppelsPage';

// Pages — Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLeadsPage from './pages/admin/AdminLeadsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// Pages — Common
import SettingsPage from './pages/common/SettingsPage';
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
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/explore" element={<PublicCataloguePage />} />
          
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
          
          {/* Acheteur — Catalogue is the main view */}
          <Route
            path="/acheteur"
            element={
              <ProtectedRoute allowedRole="acheteur">
                <CataloguePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/acheteur/dashboard"
            element={
              <ProtectedRoute allowedRole="acheteur">
                <AcheteurDashboard />
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
                <AcheteurSettingsPage />
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
