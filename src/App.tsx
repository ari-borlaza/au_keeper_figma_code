import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StoriesPage from './components/StoriesPage';
import AuthorsPage from './components/AuthorsPage';
import ReadListsPage from './components/ReadListsPage';
import SettingsPage from './components/SettingsPage';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard />;
      case 'stories':
        return <StoriesPage />;
      case 'authors':
        return <AuthorsPage />;
      case 'readlists':
        return <ReadListsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <SettingsPage />; // For now, profile redirects to settings
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
      <Toaster />
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}