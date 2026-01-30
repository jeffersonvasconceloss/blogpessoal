
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
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="size-8 rounded-full bg-cover bg-center ring-1 ring-black/5 dark:ring-white/10"
                      style={{ backgroundImage: `url("${article.author.avatar}")` }}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] font-bold text-slate-900 dark:text-white">{article.author.name}</span>
                        <span className="material-symbols-outlined text-[13px] text-slate-400">verified</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{article.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-primary text-[12px] font-bold hover:opacity-80 transition-opacity">Subscribe</button>
                    <button className="text-slate-400">
                      <span className="material-symbols-outlined text-[16px]">more_horiz</span>
                    </button>
                  </div>
                </div>

                {/* Optional Intro/Title */}
                {article.title && (
                  <p className="text-[14px] font-medium text-slate-700 dark:text-slate-200 mb-2.5 leading-relaxed">
                    {article.title} 😯 ➔
                  </p>
                )}

                {/* The Thought Box - Compact & High Contrast */}
                <div className="relative w-full bg-[#1a0f0f] dark:bg-[#160a0a] rounded-[20px] p-6 md:p-8 mb-4 overflow-hidden shadow-xl shadow-black/20 group-hover:scale-[1.005] transition-transform duration-500">
                  <span className="material-symbols-outlined text-3xl text-white/5 mb-4 block select-none leading-none">format_quote</span>

                  <div className="space-y-6">
                    <p className="text-[16px] md:text-[18px] font-serif text-slate-100 leading-[1.55] italic">
                      {article.thoughtInfo?.coreInsight || article.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4">
                      <span className="text-[11px] font-newsreader italic text-white/30 tracking-wide uppercase">
                        {article.author.name.toLowerCase().split(' ')[0]}
                      </span>
                      <button className="text-white/20 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[18px]">bookmark</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Interactions */}
                <div className="flex items-center gap-8 pl-1">
                  <button className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-all group/icon">
                    <span className="material-symbols-outlined text-[20px] group-active/icon:scale-125 transition-transform">favorite</span>
                    <span className="text-[12px] font-bold">{article.likes}</span>
                  </button>
                  <button className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-all group/icon">
                    <span className="material-symbols-outlined text-[20px] group-active/icon:scale-125 transition-transform">chat_bubble</span>
                    <span className="text-[12px] font-bold">{article.commentsCount}</span>
                  </button>
                  <button className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-all group/icon">
                    <span className="material-symbols-outlined text-[20px] group-active/icon:scale-125 transition-transform">sync</span>
                    <span className="text-[12px] font-bold">24</span>
                  </button>
                  <button className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-all group/icon">
                    <span className="material-symbols-outlined text-[20px] group-active/icon:scale-125 transition-transform">ios_share</span>
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
