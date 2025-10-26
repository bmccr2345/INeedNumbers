import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "./contexts/AuthContext";
import PerformanceMonitor from "./components/PerformanceMonitor";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from 'sonner';
import { useIsMobile } from "./hooks/useMediaQuery";
import "./App.css";

// Import pages
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import FreeCalculator from "./pages/FreeCalculator";
import Glossary from "./pages/Glossary";
import SamplePDF from "./pages/SamplePDF";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyAccountPage from "./pages/MyAccountPage";
import PricingPage from "./pages/PricingPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import WelcomePage from "./pages/WelcomePage";
import ToolsPage from "./pages/ToolsPage";
import CommissionSplitCalculator from "./pages/CommissionSplitCalculator";
import SellerNetSheetCalculator from "./pages/SellerNetSheetCalculator";
import AffordabilityCalculator from "./pages/AffordabilityCalculator";
import SetPasswordPage from "./pages/SetPasswordPage";
import SupportPage from "./pages/SupportPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import PnLPanel from "./components/dashboard/PnLPanel";
import ClosingDateCalculator from "./pages/ClosingDateCalculator";
import AdminConsolePage from "./pages/AdminConsolePage";
import BrandingProfilePage from "./pages/BrandingProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <div className="App">
      <HelmetProvider>
        <PerformanceMonitor />
        <Toaster position="top-right" richColors />
        <AuthProvider>
          <BrowserRouter future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
          v7_fetcherPersist: true
        }}>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calculator" element={<FreeCalculator />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/sample-pdf" element={<SamplePDF />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/support" element={<SupportPage />} />
            
            {/* Tools Routes */}
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/commission-split" element={<CommissionSplitCalculator />} />
            <Route path="/tools/net-sheet" element={<SellerNetSheetCalculator />} />
            <Route path="/tools/affordability" element={<AffordabilityCalculator />} />
            <Route path="/tools/closing-date" element={<ClosingDateCalculator />} />
            <Route path="/affordability/shared/:calculationId" element={<AffordabilityCalculator />} />
            <Route path="/tools/agent-pl-tracker" element={<PnLPanel />} />
            <Route path="/tools/pnl-tracker" element={<PnLPanel />} />
            {/* Redirect old P&L Tracker URL to correct path */}
            <Route path="/agent-pnl-tracker" element={<Navigate to="/tools/agent-pl-tracker" replace />} />
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />
            <Route path="/app/branding" element={<BrandingProfilePage />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/set-password" element={<SetPasswordPage />} />
            <Route path="/account" element={<MyAccountPage />} />
            
            {/* Legal Routes */}
            <Route path="/legal/terms" element={<TermsPage />} />
            <Route path="/legal/privacy" element={<PrivacyPage />} />
            <Route path="/legal/cookies" element={<CookiePolicyPage />} />
            <Route path="/legal/accessibility" element={<AccessibilityPage />} />
            
            {/* Admin Routes */}
            <Route path="/app/admin" element={<AdminConsolePage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </HelmetProvider>
    </div>
  );
}

export default App;