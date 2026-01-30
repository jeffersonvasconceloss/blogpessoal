
import React from 'react';
import { Author } from '../types';

interface MobileHeaderProps {
    me: Author;
    onBrandClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ me, onBrandClick }) => {
    return (
        <header className="lg:hidden sticky top-0 bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/10 px-6 py-4 z-40 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={onBrandClick}>
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 ring-2 ring-primary/20"
                    style={{ backgroundImage: `url("${me.avatar}")` }}
                />
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold leading-none dark:text-white font-newsreader">{me.name.split(' ')[0]}</h1>
                    <p className="text-primary text-[8px] font-bold uppercase tracking-widest leading-none mt-1">Jornal Literário</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                </button>
                <button className="text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">notifications1</span>
                </button>
            </div>
        </header>
    );
};

export default MobileHeader;
