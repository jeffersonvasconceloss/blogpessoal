
import React, { useState } from 'react';

interface LoginProps {
    onLogin: (password: string) => boolean;
    onCancel: () => void;
}

const LoginView: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onLogin(password)) {
            setError('');
        } else {
            setError('Acesso negado. Senha incorreta.');
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0a0a0a]">
            <div className="w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-white/5">
                <div className="flex flex-col items-center text-center gap-6 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-3xl">lock</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-newsreader">Área Restrita</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-serif">Autentique-se para gerenciar o laboratório literário.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-gray-500">Senha de Acesso</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                            placeholder="••••••••"
                            autoFocus
                        />
                        {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95"
                        >
                            Entrar no Sistema
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold py-2 transition-colors"
                        >
                            Voltar ao Fluxo Público
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginView;
