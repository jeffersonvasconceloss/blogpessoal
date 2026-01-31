
import React from 'react';
import { Author } from '../types';

interface MobileHeaderProps {
    me: Author;
    onBrandClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ me, onBrandClick }) => {
    return (
        <header className="lg:hidden sticky top-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 px-6 py-4 z-40 flex items-center justify-between pt-safe">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={onBrandClick}>
                <div className="flex flex-col">
                    <h1 className="text-[17px] font-black leading-tight dark:text-white tracking-tight -mb-0.5">{me.name.split(' ')[0]}</h1>
                    <p className="text-primary text-[9px] font-black uppercase tracking-[0.2em] leading-none opacity-80">Mindshelf</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="size-10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[22px]">search</span>
                </button>
                <div className="size-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">notifications</span>
                </div>
            </div>
        </header>
    );
};

export default MobileHeader;
