
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Article } from './types';
import { ME } from './constants';
import { postService } from './services/postService';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import MobileHeader from './components/MobileHeader';
import FeedView from './views/Feed';
import AboutView from './views/About';
import LibraryView from './views/Library';
import ArticleView from './views/ArticleView';
import EditorView from './views/Editor';
import DashboardView from './views/Dashboard';
import LoginView from './views/Login';
import CustomizationModal from './components/CustomizationModal';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentFont, setCurrentFont] = useState(() => localStorage.getItem('blog-font') || 'Inter');
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-font', currentFont);
  }, [currentFont]);

  const refreshArticles = async (isAuth = isAuthenticated) => {
    try {
      const data = await postService.getPosts(isAuth);
      setArticles(data);
    } catch (error) {
      console.error('Failed to refresh posts:', error);
    }
  };

  useEffect(() => {
    refreshArticles();
  }, [isAuthenticated]);

  // Navigation handler
  const navigateTo = (view: AppView, article?: Article) => {
    // Check if view is restricted
    if ((view === AppView.DASHBOARD || view === AppView.EDITOR) && !isAuthenticated) {
      setCurrentView(AppView.LOGIN);
      window.history.pushState({}, '', '/login');
      return;
    }

    if (view === AppView.LOGIN) {
      window.history.pushState({}, '', '/login');
    } else if (view === AppView.HOME || view === AppView.FEED) {
      window.history.pushState({}, '', '/');
    }

    setCurrentView(view);
    if (article) {
      setSelectedArticle(article);
    } else if (view !== AppView.ARTICLE) {
      setSelectedArticle(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/login') {
      setCurrentView(AppView.LOGIN);
    }

    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/login') {
        setCurrentView(AppView.LOGIN);
      } else if (currentPath === '/') {
        setCurrentView(AppView.HOME);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLogin = (password: string) => {
    if (password === 'jefferson123') {
      setIsAuthenticated(true);
      setCurrentView(AppView.DASHBOARD);
      window.history.pushState({}, '', '/');
      return true;
    }
    return false;
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
      case AppView.FEED:
        return <div className="animate-fade-in"><FeedView articles={articles} onArticleClick={(a) => navigateTo(AppView.ARTICLE, a)} /></div>;

      case AppView.ABOUT:
        return <div className="animate-fade-in"><AboutView /></div>;
      case AppView.LIBRARY:
        return <div className="animate-slide-up"><LibraryView articles={articles} onArticleClick={(a) => navigateTo(AppView.ARTICLE, a)} /></div>;
      case AppView.ARTICLE:
        return selectedArticle ? (
          <div className="animate-slide-up">
            <ArticleView article={selectedArticle} onBack={() => navigateTo(AppView.FEED)} />
          </div>
        ) : (
          <div className="animate-fade-in"><FeedView articles={articles} onArticleClick={(a) => navigateTo(AppView.ARTICLE, a)} /></div>
        );
      case AppView.EDITOR:
        return <div className="animate-slide-up"><EditorView
          article={selectedArticle}
          onPublish={() => {
            refreshArticles();
            navigateTo(AppView.DASHBOARD);
          }}
          onCancel={() => navigateTo(AppView.DASHBOARD)}
        /></div>;
      case AppView.DASHBOARD:
        return <div className="animate-fade-in"><DashboardView
          articles={articles}
          onEdit={(a) => navigateTo(AppView.EDITOR, a)}
          onDelete={async (id) => {
            await postService.deletePost(id);
            refreshArticles();
          }}
          onNew={() => navigateTo(AppView.EDITOR)}
          onLogout={() => {
            setIsAuthenticated(false);
            navigateTo(AppView.FEED);
            window.history.pushState({}, '', '/');
          }}
        /></div>;
      case AppView.LOGIN:
        return <div className="animate-fade-in"><LoginView onLogin={handleLogin} onCancel={() => navigateTo(AppView.HOME)} /></div>;
      default:
        return <div className="animate-fade-in"><FeedView articles={articles} onArticleClick={(a) => navigateTo(AppView.ARTICLE, a)} /></div>;
    }
  };

  const isFullScreenView = currentView === AppView.EDITOR || currentView === AppView.ARTICLE;

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen bg-background-light dark:bg-background-dark ${isFullScreenView ? 'overflow-hidden' : ''}`}>
      {!isFullScreenView && (
        <Sidebar
          currentView={currentView}
          onNavigate={navigateTo}
          me={ME}
          isAuthenticated={isAuthenticated}
          onOpenCustomization={() => setIsCustomizing(true)}
        />
      )}

      {!isFullScreenView && (
        <MobileHeader
          me={ME}
          onBrandClick={() => navigateTo(AppView.HOME)}
        />
      )}

      <main className={`flex-1 ${!isFullScreenView ? 'lg:ml-72 pb-20 lg:pb-0' : ''} flex flex-col min-h-screen relative`}>
        {renderView()}
      </main>

      {!isFullScreenView && (
        <BottomNav
          currentView={currentView}
          onNavigate={navigateTo}
          isAuthenticated={isAuthenticated}
          onOpenCustomization={() => setIsCustomizing(true)}
        />
      )}

      {isCustomizing && (
        <CustomizationModal
          currentFont={currentFont}
          onSelectFont={(font) => {
            setCurrentFont(font);
            localStorage.setItem('blog-font', font);
          }}
          onClose={() => setIsCustomizing(false)}
        />
      )}
    </div>
  );
};

export default App;
