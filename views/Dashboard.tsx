
import React from 'react';
import { Article } from '../types';

interface DashboardProps {
    articles: Article[];
    onEdit: (article: Article) => void;
    onDelete: (id: string) => void;
    onNew: () => void;
    onLogout: () => void;
}

const DashboardView: React.FC<DashboardProps> = ({ articles, onEdit, onDelete, onNew, onLogout }) => {
    return (
        <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white font-newsreader">Laboratório de Conteúdo</h2>
                    <p className="text-gray-500 font-serif italic">Gerencie seus pensamentos, projetos e pesquisas em um só lugar.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onNew}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        Nova Postagem
                    </button>
                    <button
                        onClick={onLogout}
                        className="p-3 border border-gray-200 dark:border-white/10 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-200 transition-all bg-white dark:bg-white/5"
                    >
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Total de Ensaios</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white font-newsreader">{articles.length}</h3>
                </div>
                <div className="p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Engajamento Médio</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white font-newsreader">
                        {Math.round(articles.reduce((acc, a) => acc + (a.likes || 0), 0) / (articles.length || 1))}
                    </h3>
                </div>
                <div className="p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Comentários Totais</p>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white font-newsreader">
                        {articles.reduce((acc, a) => acc + (a.commentsCount || 0), 0)}
                    </h3>
                </div>
            </div>

            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white font-newsreader tracking-tight">Postagens Recentes</h3>
                </div>

                <div className="overflow-x-auto ring-1 ring-gray-200 dark:ring-white/10 rounded-2xl bg-white dark:bg-[#1a1a1a]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Título</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Categoria</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-400">Data</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-400 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {articles.map(article => (
                                <tr key={article.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 dark:text-white font-bold text-sm line-clamp-1">{article.title}</span>
                                            <span className="text-slate-400 text-[10px] uppercase tracking-wide">{article.slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {article.category}
                                            </span>
                                            {!article.published && (
                                                <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-white/5">
                                                    Rascunho
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 font-serif">
                                        {article.date}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEdit(article)}
                                                className="p-2 text-slate-400 hover:text-primary transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Deseja excluir permanentemente este ensaio?')) {
                                                        onDelete(article.id);
                                                    }
                                                }}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
