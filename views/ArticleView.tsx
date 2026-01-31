
import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { MOCK_COMMENTS } from '../constants';
import { geminiService } from '../services/geminiService';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleSummarize = async () => {
    setLoadingSummary(true);
    const res = await geminiService.summarizeArticle(article.title, article.content);
    setSummary(res);
    setLoadingSummary(false);
  };

  // Scroll visibility for interaction bar
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="min-h-screen bg-white dark:bg-background-dark flex flex-col items-center relative overflow-x-hidden">

      {/* Premium Top Navigation Bar - Simplified */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-white/0 dark:bg-background-dark/0 z-[100] px-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all group"
          >
            <span className="material-symbols-outlined text-[22px] text-slate-600 dark:text-slate-400 group-hover:dark:text-white">arrow_back</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-100 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-[22px] text-slate-400">more_horiz</span>
          </button>
        </div>
      </nav>

      <article className="max-w-[700px] w-full pt-20 pb-32 px-6 animate-fade-in flex flex-col">

        {/* Premium Header - Conditionally simplified for Pensamento */}
        {article.category !== 'Pensamento' ? (
          <header className="mb-14 border-b border-gray-100 dark:border-white/5 pb-10">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-md">
                  {article.category}
                </span>
                <div className="h-[1px] flex-1 bg-gray-100 dark:bg-white/5"></div>
              </div>

              <h1 className="text-3xl md:text-4xl font-newsreader font-bold leading-tight text-slate-900 dark:text-white tracking-tight">
                {article.title}
              </h1>

              <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-serif leading-relaxed italic border-l-2 border-slate-200 dark:border-white/10 pl-5 py-0.5">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-full bg-cover bg-center ring-2 ring-white/10 shadow-lg"
                    style={{ backgroundImage: `url("${article.author.avatar}")` }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {article.author.name}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">
                      <span>{article.date}</span>
                      <span className="size-1 bg-slate-400 rounded-full opacity-30"></span>
                      <span>{article.readTime} LEITURA</span>
                    </div>
                  </div>
                </div>

                <button className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10">
                  Subscribe
                </button>
              </div>
            </div>
          </header>
        ) : (
          <header className="mb-16 pt-10 text-center">
            <div className="flex flex-col items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">
                {article.date}
              </span>
              <div className="h-10 w-[1px] bg-gradient-to-b from-primary/30 to-transparent"></div>
            </div>
          </header>
        )}

        {/* Deep Reading Content */}
        <div className="prose-custom dark:prose-invert font-serif text-[18px] leading-[1.6] text-slate-800 dark:text-slate-300">

          {/* Dynamic Metadata Cards */}

          {/* 4. LIBRARY (BOOK) CARD - Moved to the Top of Content */}
          {article.category === 'Biblioteca' && article.bookInfo && (
            <div className="mb-16 p-8 bg-[#121212] rounded-[32px] border border-white/5 flex flex-col md:flex-row gap-10 items-center relative overflow-hidden group shadow-2xl">
              {article.bookInfo.coverUrl && (
                <div className="w-[160px] shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/40 transition-transform duration-700 group-hover:scale-105">
                  <img src={article.bookInfo.coverUrl} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 space-y-5 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`material-symbols-outlined text-[18px] ${i < (article.bookInfo?.rating || 0) / 2 ? 'text-primary filled-icon' : 'text-slate-800'}`}>
                        star
                      </span>
                    ))}
                  </div>
                  <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">
                    {article.bookInfo.status}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                  {article.bookInfo.title}
                </h3>
                <p className="text-lg text-slate-400 font-serif italic">por {article.bookInfo.author}</p>

                <div className="pt-4 flex items-center justify-center md:justify-start gap-4">
                  <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Nota: <span className="text-primary ml-1">{article.bookInfo.rating}/10</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1. PROJECT CARD */}
          {article.category === 'Projeto' && article.projectInfo && (
            <div className="my-12 p-8 bg-gray-50 dark:bg-white/[0.02] rounded-3xl border border-gray-100 dark:border-white/5 animate-slide-up">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${article.projectInfo.status === 'Concluído' ? 'bg-green-500/10 text-green-500' :
                    article.projectInfo.status === 'Em Desenvolvimento' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-slate-500/10 text-slate-500'
                    }`}>
                    {article.projectInfo.status}
                  </span>
                  <div className="flex gap-2">
                    {article.projectInfo.link && (
                      <a href={article.projectInfo.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-white/5 rounded-full hover:scale-110 transition-transform text-slate-400 hover:text-primary border border-gray-100 dark:border-white/5">
                        <span className="material-symbols-outlined text-[20px]">link</span>
                      </a>
                    )}
                    {article.projectInfo.github && (
                      <a href={article.projectInfo.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white dark:bg-white/5 rounded-full hover:scale-110 transition-transform text-slate-400 hover:text-primary border border-gray-100 dark:border-white/5">
                        <span className="material-symbols-outlined text-[20px]">code</span>
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.projectInfo.techStack.map(tech => (
                      <span key={tech} className="px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg text-[12px] font-medium text-slate-600 dark:text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. THOUGHT CARD - Refined Proportions */}
          {article.category === 'Pensamento' && article.thoughtInfo && (
            <div className="my-10 p-8 md:p-10 bg-[#1a0f0f] rounded-[24px] border border-white/5 animate-slide-up relative overflow-hidden shadow-2xl">
              <span className="material-symbols-outlined absolute -top-2 -left-1 text-[80px] text-white/[0.02] rotate-12 select-none">format_quote</span>

              <div className="relative z-10 space-y-6">
                <p className="text-lg md:text-xl font-newsreader italic text-white/90 leading-relaxed text-center">
                  "{article.thoughtInfo.coreInsight}"
                </p>

                <div className="flex flex-col items-center gap-3">
                  <div className="h-[1px] w-10 bg-primary/30"></div>
                  {article.thoughtInfo.inspirationSource && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
                      {article.thoughtInfo.inspirationSource}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. WRITING CARD */}
          {article.category === 'Escrita' && article.writingInfo && (
            <div className="my-10 flex gap-4 text-[12px] font-medium text-slate-500 justify-center">
              <span className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/5">
                Gênero: <span className="text-slate-900 dark:text-white font-bold ml-1">{article.writingInfo.genre}</span>
              </span>
              {article.writingInfo.targetAudience && (
                <span className="px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/5">
                  Para: <span className="text-slate-900 dark:text-white font-bold ml-1">{article.writingInfo.targetAudience}</span>
                </span>
              )}
            </div>
          )}

          <div
            className="space-y-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <blockquote className="relative my-12 pl-6 border-l-4 border-primary/40 dark:border-primary/60">
            <p className="text-2xl md:text-3xl font-serif text-slate-900 dark:text-white leading-relaxed italic">
              "A alma torna-se tingida com a cor de seus pensamentos. Construir o silêncio é escolher o pigmento da nossa existência."
            </p>
          </blockquote>

          <div className="pt-10 flex flex-col items-center gap-6">
            <button
              onClick={handleSummarize}
              className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all active:scale-95 shadow-xl shadow-black/10 flex items-center gap-3"
            >
              <span className={`material-symbols-outlined text-[18px] ${loadingSummary ? 'animate-spin' : ''}`}>auto_awesome</span>
              {loadingSummary ? 'Tecendo reflexões...' : 'Sintetizar Artigo'}
            </button>
            {summary && (
              <div className="w-full p-8 bg-primary/5 border border-primary/10 rounded-3xl animate-slide-up">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Ponto de Vista da IA</h4>
                <p className="text-lg italic font-serif text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{summary}</p>
              </div>
            )}
          </div>
        </div>

        {/* Clean Bottom Interaction Bar */}
        <div className="fixed bottom-0 left-0 w-full h-16 bg-white/80 dark:bg-background-dark/80 backdrop-blur-2xl border-t border-gray-100 dark:border-white/5 z-50 px-6 flex items-center justify-center">
          <div className="max-w-[700px] w-full flex items-center justify-between">
            <div className="flex items-center gap-10">
              <button className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-all group">
                <span className="material-symbols-outlined text-[22px] group-hover:fill-current group-active:scale-125 transition-all">favorite</span>
                <span className="text-[13px] font-black">{article.likes}</span>
              </button>
              <button className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-all group">
                <span className="material-symbols-outlined text-[22px] group-active:scale-125 transition-all">chat_bubble</span>
                <span className="text-[13px] font-black">{article.commentsCount}</span>
              </button>
              <button className="hidden md:flex items-center gap-2.5 text-slate-500 dark:text-slate-400 hover:text-primary transition-all group">
                <span className="material-symbols-outlined text-[22px] group-active:scale-125 transition-all">sync</span>
                <span className="text-[13px] font-black">115</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <span className="material-symbols-outlined text-[22px]">bookmark</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <span className="material-symbols-outlined text-[22px]">share</span>
              </button>
            </div>
          </div>
        </div>
      </article>

      <footer className="max-w-[760px] mx-auto px-6 pb-40 border-t border-gray-100 dark:border-white/5 pt-16">
        <h3 className="text-2xl font-bold font-newsreader mb-10 dark:text-white">Comentários</h3>
        <div className="space-y-12">
          {MOCK_COMMENTS.slice(0, 2).map(comment => (
            <div key={comment.id} className="flex gap-4">
              <div className="size-10 rounded-full bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${comment.authorAvatar}")` }} />
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold dark:text-white">{comment.authorName}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{comment.date}</span>
                </div>
                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-serif">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </section>
  );
};

export default ArticleView;
