
import React from 'react';
import { MOCK_ARTICLES } from '../constants';
import { Article } from '../types';

interface FeedProps {
  onArticleClick: (article: Article) => void;
  articles: Article[];
}


const FeedView: React.FC<FeedProps> = ({ onArticleClick, articles }) => {
  return (
    <section className="flex-1 max-w-[720px] mx-auto px-4 md:px-6 py-12 md:py-20">
      <header className="mb-16 border-b border-gray-100 dark:border-white/5 pb-10">
        <h2 className="text-3xl md:text-5xl font-display font-black dark:text-white tracking-tight mb-4">Fluxo de Pensamentos</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-serif max-w-2xl leading-relaxed">
          Explorando a artesania do pensamento, estética e a arquitetura do silêncio.
        </p>
      </header>

      <div className="flex flex-col gap-12 md:gap-14">
        {articles.map((article) => {
          if (article.category === 'Pensamento' || article.thoughtInfo) {
            return (
              <article
                key={article.id}
                className="group cursor-pointer border-b border-gray-100 dark:border-white/5 pb-12 transition-all animate-fade-in"
                onClick={() => onArticleClick(article)}
              >
                {/* Header Information */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-10 rounded-full bg-cover bg-center ring-2 ring-primary/5 shadow-md"
                      style={{ backgroundImage: `url("${article.author.avatar}")` }}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{article.author.name}</span>
                        <span className="material-symbols-outlined text-[14px] text-primary filled-icon">verified</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{article.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                      <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                  </div>
                </div>

                {/* Optional Intro/Title */}
                {article.title && (
                  <p className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-4 leading-relaxed flex items-center gap-2">
                    {article.title} <span className="text-primary">➔</span>
                  </p>
                )}

                {/* The Thought Box - Professional & Deep Focus */}
                <div className="relative w-full bg-slate-50 dark:bg-white/[0.02] rounded-[32px] p-8 md:p-10 mb-6 border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-500 group-hover:border-primary/20">
                  <span className="material-symbols-outlined absolute -top-4 -left-2 text-[100px] text-primary/[0.03] rotate-12 select-none pointer-events-none">format_quote</span>

                  <div className="relative z-10 space-y-6">
                    <p className="text-[18px] md:text-[20px] font-serif text-slate-700 dark:text-slate-200 leading-[1.7] italic">
                      "{article.thoughtInfo?.coreInsight || article.excerpt}"
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-200/50 dark:border-white/5">
                      <span className="text-[10px] font-black text-primary/50 uppercase tracking-[0.3em]">
                        {article.author.name}
                      </span>
                      <button className="text-slate-300 dark:text-white/20 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">bookmark</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Interactions */}
                <div className="flex items-center gap-10 pl-2">
                  <button className="flex items-center gap-2.5 text-slate-400 hover:text-primary transition-all group/icon">
                    <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">favorite</span>
                    <span className="text-[12px] font-black tracking-tighter">{article.likes}</span>
                  </button>
                  <button className="flex items-center gap-2.5 text-slate-400 hover:text-primary transition-all group/icon">
                    <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">chat_bubble</span>
                    <span className="text-[12px] font-black tracking-tighter">{article.commentsCount}</span>
                  </button>
                  <button className="flex items-center gap-2.5 text-slate-400 hover:text-primary transition-all group/icon">
                    <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">sync</span>
                    <span className="text-[12px] font-black tracking-tighter">24</span>
                  </button>
                  <button className="flex items-center gap-2.5 text-slate-400 hover:text-primary transition-all group/icon ml-auto">
                    <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform">ios_share</span>
                  </button>
                </div>
              </article>
            );
          }

          // Default Blog Post Style
          return (
            <article
              key={article.id}
              className="group cursor-pointer border-b border-gray-100 dark:border-white/5 pb-12 transition-all"
              onClick={() => onArticleClick(article)}
            >
              <div className="flex flex-col gap-4">
                {/* Author Row */}
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="size-6 rounded-full bg-cover bg-center ring-1 ring-black/5 dark:ring-white/10"
                    style={{ backgroundImage: `url("${article.author.avatar}")` }}
                  />
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{article.author.name}</span>
                  <span className="text-slate-400 text-[10px]">•</span>
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest">{article.date}</span>
                </div>

                {/* Content Wrapper (Text + Image) */}
                <div className="flex flex-col md:flex-row gap-8 justify-between">
                  <div className="flex-1 space-y-3">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400 font-serif leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  {article.imageUrl && (
                    <div className="w-full md:w-[160px] md:h-[105px] aspect-video md:aspect-auto rounded-lg overflow-hidden shrink-0">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Metadata */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                      <span className="text-[11px] font-bold">{article.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                      <span className="text-[11px] font-bold">{article.commentsCount}</span>
                    </div>
                    <div className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {article.category}
                    </div>
                    <span className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {article.readTime} leitura
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">bookmark</span>
                    </button>
                    <button className="text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-20 text-center">
        <button className="px-8 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
          Carregar mais ensaios
        </button>
      </div>
    </section>
  );
};


export default FeedView;
