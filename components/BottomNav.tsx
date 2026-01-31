
import React from 'react';
import { AppView } from '../types';

interface BottomNavProps {
    currentView: AppView;
    onNavigate: (view: AppView) => void;
    isAuthenticated: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, isAuthenticated }) => {
    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-background-dark/90 backdrop-blur-xl border-t border-gray-100 dark:border-white/5 lg:hidden flex justify-around items-center px-2 py-2 z-[100] pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <NavItem
                icon="explore"
                label="Início"
                active={currentView === AppView.HOME || currentView === AppView.FEED}
                onClick={() => onNavigate(AppView.FEED)}
            />


            {isAuthenticated && (
                <NavItem
                    icon="dashboard"
                    label="Painel"
                    active={currentView === AppView.DASHBOARD}
                    onClick={() => onNavigate(AppView.DASHBOARD)}
                />
            )}

            <NavItem
                icon="auto_stories"
                label="Livros"
                active={currentView === AppView.LIBRARY}
                onClick={() => onNavigate(AppView.LIBRARY)}
            />
            <NavItem
                icon="account_circle"
                label="Sobre"
                active={currentView === AppView.ABOUT}
                onClick={() => onNavigate(AppView.ABOUT)}
            />
        </nav>
    );
};

const NavItem: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${active
            ? 'text-primary'
            : 'text-gray-400 dark:text-gray-500'
            }`}
    >
        <span className={`material-symbols-outlined text-[24px] ${active ? 'filled-icon' : ''}`}>{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </button>
);

export default BottomNav;
