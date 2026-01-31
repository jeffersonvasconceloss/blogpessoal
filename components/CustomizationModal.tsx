
import React from 'react';

interface FontOption {
    name: string;
    description: string;
    family: string;
}

const FONTS: FontOption[] = [
    { name: 'Inter', description: 'Moderna e Legível (Padrão)', family: 'Inter' },
    { name: 'Lora', description: 'Clássica e Elegante', family: 'Lora' },
    { name: 'Literata', description: 'Refinada e Literária', family: 'Literata' },
    { name: 'Mulish', description: 'Minimalista e Suave', family: 'Mulish' },
    { name: 'Crimson Text', description: 'Serifada Humanista', family: 'Crimson Text' },
    { name: 'Gentium Book Plus', description: 'Tipografia Acadêmica', family: 'Gentium Book Plus' },
];

interface CustomizationModalProps {
    currentFont: string;
    onSelectFont: (font: string) => void;
    onClose: () => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ currentFont, onSelectFont, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center animate-fade-in p-6">
            <div className="bg-[#121212] border border-white/10 w-full max-w-[480px] rounded-[32px] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
                {/* Header */}
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Personalização</h3>
                        <p className="text-sm text-slate-500">Configure a aparência da sua interface</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all outline-none"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 pt-4 flex-1 overflow-y-auto no-scrollbar max-h-[60vh]">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tipografia da Interface</span>
                        <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[9px] font-black uppercase rounded border border-yellow-500/20">Premium</span>
                    </div>

                    <div className="space-y-3">
                        {FONTS.map((font) => (
                            <button
                                key={font.family}
                                onClick={() => onSelectFont(font.family)}
                                className={`w-full p-6 rounded-2xl border transition-all text-left flex items-center justify-between group ${currentFont === font.family
                                        ? 'bg-white/[0.03] border-yellow-500/50 ring-1 ring-yellow-500/20'
                                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                    }`}
                                style={{ fontFamily: font.family }}
                            >
                                <div>
                                    <h4 className={`text-lg font-bold mb-1 ${currentFont === font.family ? 'text-yellow-500' : 'text-white'}`}>
                                        {font.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 font-sans tracking-wide">
                                        {font.description}
                                    </p>
                                </div>
                                {currentFont === font.family && (
                                    <div className="size-6 rounded-full bg-yellow-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[16px] text-black font-black">check</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-black/20 border-t border-white/5">
                    <p className="text-[10px] text-slate-600 text-center italic tracking-wide">
                        As alterações são aplicadas instantaneamente em toda a plataforma.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CustomizationModal;
