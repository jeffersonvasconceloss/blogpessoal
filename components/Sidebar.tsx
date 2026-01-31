
import React from 'react';
import { AppView, Author } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  me: Author;
  isAuthenticated: boolean;
  onOpenCustomization: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, me, isAuthenticated, onOpenCustomization }) => {
  return (
    <aside className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-background-dark border-r border-gray-100 dark:border-white/[0.03] hidden lg:flex flex-col justify-between p-8 z-50">
      <div className="flex flex-col gap-10">
        {/* Brand */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate(AppView.HOME)}>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 ring-2 ring-primary/10"
            style={{ backgroundImage: `url("${me.avatar}")` }}
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-black leading-none dark:text-white font-newsreader">{me.name.split(' ')[0]}</h1>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-1">Jornal Literário</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-2">
          <NavItem
            icon="explore"
            label="Início"
            active={currentView === AppView.HOME || currentView === AppView.FEED}
            onClick={() => onNavigate(AppView.FEED)}
          />

          <NavItem
            icon="auto_stories"
            label="Biblioteca"
            active={currentView === AppView.LIBRARY}
            onClick={() => onNavigate(AppView.LIBRARY)}
          />
          <NavItem
            icon="account_circle"
            label="Sobre"
            active={currentView === AppView.ABOUT}
            onClick={() => onNavigate(AppView.ABOUT)}
          />

          {isAuthenticated && (
            <div className="my-4 border-t border-gray-100 dark:border-white/5 pt-4">
              <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Administração</p>
              <NavItem
                icon="dashboard"
                label="Dashboard"
                active={currentView === AppView.DASHBOARD}
                onClick={() => onNavigate(AppView.DASHBOARD)}
              />
              <NavItem
                icon="draw"
                label="Escrever"
                active={currentView === AppView.EDITOR}
                onClick={() => onNavigate(AppView.EDITOR)}
              />
            </div>
          )}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <NavItem
            icon="palette"
            label="Personalizar"
            active={false}
            onClick={onOpenCustomization}
          />
          <div className="my-2" />
          <SocialLink icon="share" label="Instagram" href="#" />
          <SocialLink icon="link" label="LinkedIn" href="#" />
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-white/5">
          {isAuthenticated && (
            <button
              className="w-full py-3 bg-primary text-white text-sm font-bold rounded-lg hover:brightness-110 transition-all shadow-lg shadow-primary/20 mb-4"
              onClick={() => onNavigate(AppView.EDITOR)}
            >
              Nova Entrada
            </button>
          )}
          <p className="text-[10px] text-gray-400 text-center uppercase tracking-tighter mt-4">© 2024 {me.name}</p>
        </div>
      </div>
    </aside>
  );
};

const NavItem: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${active
      ? 'bg-primary/10 text-primary font-bold'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary'
      }`}
  >
    <span className={`material-symbols-outlined ${active ? 'filled-icon' : ''}`}>{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const SocialLink: React.FC<{ icon: string; label: string; href: string }> = ({ icon, label, href }) => (
  <a href={href} className="flex items-center gap-3 px-3 py-1 text-gray-500 hover:text-primary transition-colors">
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span className="text-[10px] uppercase tracking-widest font-semibold">{label}</span>
  </a>
);

export default Sidebar;
