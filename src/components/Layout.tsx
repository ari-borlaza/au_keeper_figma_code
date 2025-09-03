import React from 'react';
import { Book, Home, Users, BookMarked, Settings, User, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useApp } from '../context/AppContext';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { currentUser } = useApp();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'stories', label: 'Stories', icon: Book },
    { id: 'authors', label: 'Authors', icon: Users },
    { id: 'readlists', label: 'My Read List', icon: BookMarked },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* AO3-inspired Header */}
      <header className="bg-primary text-primary-foreground border-b-2 border-primary/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Book className="w-6 h-6" />
                <div>
                  <h1 className="text-lg font-bold" style={{fontFamily: 'var(--font-family-serif)'}}>
                    Golden Catalogue
                  </h1>
                  <p className="text-xs text-primary-foreground/80" style={{fontFamily: 'var(--font-family-sans)'}}>
                    beta
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 bg-white/90 border-white/20 text-foreground"
                  style={{fontFamily: 'var(--font-family-sans)'}}
                />
              </div>
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20"
                style={{fontFamily: 'var(--font-family-sans)'}}
              >
                Log In
              </Button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="border-t border-primary-foreground/20">
            <div className="flex items-center gap-6 py-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1 text-sm transition-colors hover:bg-white/10 rounded ${
                    currentPage === item.id ? 'bg-white/20' : ''
                  }`}
                  style={{fontFamily: 'var(--font-family-sans)'}}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
};

export default Layout;