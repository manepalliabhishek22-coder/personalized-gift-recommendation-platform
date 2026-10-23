import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { QuestionnaireForm } from './components/QuestionnaireForm';
import { ResultsView } from './components/ResultsView';
import { CatalogView } from './components/CatalogView';
import { SavedFolderView } from './components/SavedFolderView';
import { HistoryAndExportView } from './components/HistoryAndExportView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { GiftComparisonModal } from './components/GiftComparisonModal';
import { AIChatAssistant } from './components/AIChatAssistant';
import { ToastContainer } from './components/Toast';
import { RealProductVisualizer } from './components/RealProductVisualizer';
import { NavigationMenuDrawer } from './components/NavigationMenuDrawer';

const AppContent: React.FC = () => {
  const { activeTab, previewProduct, setPreviewProduct } = useAuth();

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-purple-600/20 via-pink-600/15 to-transparent blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-rose-600/20 via-amber-600/15 to-transparent blur-[130px]" />
        <div className="absolute -bottom-20 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-teal-600/10 to-transparent blur-[140px]" />
      </div>

      {/* Sticky Top Navigation Bar */}
      <Navbar />

      {/* Main Content View Switcher */}
      <main className="flex-1 relative z-10">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'questionnaire' && <QuestionnaireForm />}
        {activeTab === 'results' && <ResultsView />}
        {activeTab === 'catalog' && <CatalogView />}
        {activeTab === 'saved' && <SavedFolderView />}
        {activeTab === 'history' && <HistoryAndExportView />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Floating AI Concierge Chatbot */}
      <AIChatAssistant />

      {/* Auth Modal (Sign In / Register / Demo Roles) */}
      <AuthModal />

      {/* Comparison Modal */}
      <GiftComparisonModal />

      {/* Slide-out Navigation Menu Drawer */}
      <NavigationMenuDrawer />

      {/* Global Real Product Visualizer Modal */}
      {previewProduct && (
        <RealProductVisualizer
          gift={previewProduct}
          onClose={() => setPreviewProduct(null)}
        />
      )}

      {/* Global Toast Notifications Stack */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

