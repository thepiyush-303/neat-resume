import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import { TemplateSelection } from './pages/TemplateSelection';
import UploadPage from './pages/UploadPage';
import Editor from './pages/Editor';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/templates" element={<TemplateSelection />} />
                <Route path="/resumes/upload" element={<UploadPage />} />
                <Route path="/resumes/:id/edit" element={<Editor />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
