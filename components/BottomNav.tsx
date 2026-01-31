
import React from 'react';
import { AppView } from '../types';

interface BottomNavProps {
    currentView: AppView;
    onNavigate: (view: AppView) => void;
    isAuthenticated: boolean;
    onOpenCustomization: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, isAuthenticated, onOpenCustomization }) => {
    return (
        <div className="fixed bottom-6 left-0 w-full px-6 lg:hidden z-[100] pointer-events-none">
            <nav className="mx-auto max-w-[440px] w-full bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-2xl border border-gray-100 dark:border-white/5 rounded-[28px] flex justify-around items-center px-4 py-3 pointer-events-auto shadow-[0_15px_40px_rgba(0,0,0,0.12)]">
                <NavItem
                    icon="explore"
                    label="Feed"
                    active={currentView === AppView.HOME || currentView === AppView.FEED}
                    onClick={() => onNavigate(AppView.FEED)}
                />

                <NavItem
                    icon="auto_stories"
                    label="Livros"
                    active={currentView === AppView.LIBRARY}
                    onClick={() => onNavigate(AppView.LIBRARY)}
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
                    icon="account_circle"
                    label="Sobre"
                    active={currentView === AppView.ABOUT}
                    onClick={() => onNavigate(AppView.ABOUT)}
                />

                <NavItem
                    icon="palette"
                    label="Estilo"
                    active={false}
                    onClick={onOpenCustomization}
                />
            </nav>
        </div>
    );
};

const NavItem: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`relative flex flex-col items-center gap-1.5 px-3 py-1 transition-all duration-300 ${active
            ? 'text-primary scale-110'
            : 'text-slate-400 dark:text-slate-600'
            }`}
    >
        <span className={`material-symbols-outlined text-[26px] ${active ? 'filled-icon' : ''}`}>{icon}</span>
        {active && (
            <span className="absolute -bottom-1 size-1 bg-primary rounded-full animate-fade-in" />
        )}
    </button>
);

export default BottomNav;
