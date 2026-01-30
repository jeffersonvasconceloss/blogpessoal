
import React, { useState } from 'react';
import { Article } from '../types';
import { ME } from '../constants';

interface LibraryProps {
    articles: Article[];
    onArticleClick: (article: Article) => void;
}

const LibraryView: React.FC<LibraryProps> = ({ articles, onArticleClick }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const bookNotes = articles.filter(a => a.category === 'Biblioteca');
    const filteredNotes = bookNotes.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.bookInfo?.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 max-w-[800px] mx-auto w-full px-6 py-12 font-mono">
            {/* Header Breadcrumbs */}
            <div className="flex items-center gap-2 mb-12 text-lg">
                <span className="font-bold dark:text-white">{ME.name.split(' ')[0]}</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-400">Notes</span>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 rounded-full border border-gray-200 dark:border-white/10 bg-transparent dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                />
            </div>

            {/* Filters Dropdown (Mock) */}
            <div className="relative mb-12">
                <button className="w-full flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 text-slate-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                    <span className="font-bold text-sm">Filters</span>
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </button>
            </div>

            {/* Book List */}
            <div className="space-y-16">
                {filteredNotes.map(note => (
                    <div
                        key={note.id}
                        className="flex flex-col md:flex-row gap-8 group cursor-pointer"
                        onClick={() => onArticleClick(note)}
                    >
                        {/* Book Cover */}
                        <div className="w-[140px] shrink-0 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/10 relative">
                            {note.bookInfo?.coverUrl ? (
                                <img src={note.bookInfo.coverUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-300 text-4xl">book</span>
                                </div>
                            )}
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl"></div>
                        </div>

                        {/* Book Info */}
                        <div className="flex-1 space-y-3 py-2">
                            <h3 className="text-2xl font-bold dark:text-white leading-tight group-hover:text-primary transition-colors">
                                {note.bookInfo?.title || note.title}
                            </h3>
                            <p className="text-xl text-slate-600 dark:text-slate-400">
                                {note.bookInfo?.author}
                            </p>

                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-400 text-sm">
                                <span>Food, Health</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{note.bookInfo?.rating}/10</span>
                                    <span>•</span>
                                    <span>{note.readTime} read</span>
                                </div>
                                <span className="w-full md:w-auto">{note.date}</span>
                            </div>

                            {/* Action Icons */}
                            <div className="flex items-center gap-4 pt-4 text-slate-400">
                                <button className="hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">pan_tool_alt</span>
                                </button>
                                {note.category === 'Biblioteca' && (
                                    <button className="hover:text-[#ff9900] transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredNotes.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-slate-500 italic">Nenhum livro encontrado no seu acervo...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibraryView;
