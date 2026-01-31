import React, { useState, useEffect } from 'react';
import { Article, Comment } from '../types';
import { geminiService } from '../services/geminiService';
import { postService } from '../services/postService';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [likes, setLikes] = useState(article.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [article.id]);

  const fetchComments = async () => {
    try {
      const data = await postService.getComments(article.id);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleLike = async () => {
    if (isLiked) return;
    try {
      const newLikes = await postService.likePost(article.id);
      setLikes(newLikes);
      setIsLiked(true);
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      await postService.addComment(article.id, {
        authorName: 'Visitante',
        text: newComment
      });
      setNewComment('');
      setShowCommentBox(false);
      fetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSummarize = async () => {
    setLoadingSummary(true);
    const res = await geminiService.summarizeArticle(article.title, article.content);
    setSummary(res);
    setLoadingSummary(false);
  };

  return (
    <section className="min-h-screen bg-white dark:bg-background-dark flex flex-col items-center relative overflow-x-hidden">
      {/* Minimal Top Header - Discreete Back & Profile */}
      <nav className="fixed top-0 left-0 w-full h-16 md:h-20 z-[100] px-4 md:px-6 flex items-center justify-between pointer-events-none pt-safe">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onBack}
            className="group flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/50 dark:bg-background-dark/50 backdrop-blur-md border border-gray-100 dark:border-white/5 shadow-sm active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">arrow_back</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Voltar</span>
          </button>
        </div>
        <div className="flex-1 flex justify-center pointer-events-auto">
          <div className="size-9 md:size-10 rounded-xl bg-cover bg-center border border-gray-100 dark:border-white/10 shadow-sm" style={{ backgroundImage: `url("${article.author.avatar}")` }} />
        </div>
        <div className="w-[80px] md:w-[100px]" /> {/* Spacer for symmetry */}
      </nav>

      <article className="max-w-[760px] w-full pt-20 pb-40 px-6 animate-fade-in flex flex-col">
        {/* Unified High-Hierarchy Header - Tightened & Organized */}
        <header className="mb-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/50 mb-2">
              {article.category}
            </span>

            <h1 className="text-4xl md:text-5xl font-display font-black leading-[1.1] text-slate-900 dark:text-white tracking-tight mb-6 text-center md:text-left">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 py-3 border-y border-gray-100 dark:border-white/5 w-full">
              <div className="size-9 rounded-full bg-cover bg-center ring-1 ring-black/5" style={{ backgroundImage: `url("${article.author.avatar}")` }} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{article.author.name}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{article.date} • {article.readTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="prose-custom dark:prose-invert font-serif text-[19px] leading-[1.8] text-slate-800 dark:text-slate-200">
          {/* Metadata Cards */}
          {article.category === 'Biblioteca' && article.bookInfo && (
            <div className="mb-8 p-6 bg-slate-50 dark:bg-white/[0.02] rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-8 items-center">
              {article.bookInfo.coverUrl && (
                <div className="w-[120px] shrink-0 aspect-[2/3] rounded-xl overflow-hidden shadow-xl">
                  <img src={article.bookInfo.coverUrl} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-1">
                    {article.bookInfo.status}
                  </span>
                  <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white leading-tight">
                    {article.bookInfo.title}
                  </h3>
                  <p className="text-lg text-slate-500 dark:text-slate-400 font-serif italic mb-3">por {article.bookInfo.author}</p>
                  <div className="flex items-center justify-center md:justify-start gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`material-symbols-outlined text-[18px] ${i < (article.bookInfo?.rating || 0) / 2 ? 'text-primary filled-icon' : 'text-slate-200 dark:text-slate-800'}`}>
                        star
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {article.category === 'Projeto' && article.projectInfo && (
            <div className="mb-8 p-6 bg-slate-50 dark:bg-white/[0.02] rounded-3xl border border-gray-100 dark:border-white/5">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md ${article.projectInfo.status === 'Concluído' ? 'bg-green-500/10 text-green-500' :
                      article.projectInfo.status === 'Em Desenvolvimento' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-slate-500/10 text-slate-500'
                      }`}>
                      {article.projectInfo.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {article.projectInfo.link && (
                      <a href={article.projectInfo.link} target="_blank" rel="noopener noreferrer" className="size-9 flex items-center justify-center bg-white dark:bg-white/5 rounded-xl hover:text-primary transition-all border border-gray-100 dark:border-white/5 shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">link</span>
                      </a>
                    )}
                    {article.projectInfo.github && (
                      <a href={article.projectInfo.github} target="_blank" rel="noopener noreferrer" className="size-9 flex items-center justify-center bg-white dark:bg-white/5 rounded-xl hover:text-primary transition-all border border-gray-100 dark:border-white/5 shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">code</span>
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.projectInfo.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {article.category === 'Escrita' && article.writingInfo && (
            <div className="mb-8 flex border-y border-gray-100 dark:border-white/5 py-3">
              <div className="flex-1 flex items-center justify-center gap-6">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  GÊNERO: <span className="text-slate-900 dark:text-white ml-2">{article.writingInfo.genre}</span>
                </div>
                <div className="size-1 bg-gray-200 dark:bg-white/10 rounded-full" />
                {article.writingInfo.targetAudience && (
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    PÚBLICO: <span className="text-slate-900 dark:text-white ml-2">{article.writingInfo.targetAudience}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {article.category === 'Pensamento' && article.thoughtInfo && (
            <div className="mb-16 p-12 bg-primary/[0.02] dark:bg-white/[0.01] rounded-[40px] border border-primary/5 dark:border-white/5 relative overflow-hidden group">
              <span className="material-symbols-outlined absolute -top-4 -left-2 text-[120px] text-primary/5 rotate-12 select-none group-hover:scale-110 transition-all duration-1000">format_quote</span>
              <div className="relative z-10 space-y-8 text-center">
                <p className="text-2xl md:text-3xl font-newsreader italic text-slate-800 dark:text-white/95 leading-relaxed">
                  "{article.thoughtInfo.coreInsight}"
                </p>
                <div className="flex flex-col items-center gap-4">
                  <div className="h-[1px] w-12 bg-primary/20"></div>
                  {article.thoughtInfo.inspirationSource && (
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
                      {article.thoughtInfo.inspirationSource}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div
            className="article-content space-y-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* AI Synthesis */}
          <div className="mt-24 pt-10 border-t border-gray-50 dark:border-white/5 flex flex-col items-center gap-8">
            <button
              onClick={handleSummarize}
              className="group px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] transition-all active:scale-[0.98] shadow-2xl flex items-center gap-4"
            >
              <span className={`material-symbols-outlined text-[20px] ${loadingSummary ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`}>auto_awesome</span>
              {loadingSummary ? 'Tecendo Reflexões...' : 'Sintetizar Artigo'}
            </button>
            {summary && (
              <div className="w-full p-10 bg-slate-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[40px] animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Perspectiva Estratégica</h4>
                </div>
                <p className="text-xl font-serif text-slate-700 dark:text-slate-300 leading-relaxed italic whitespace-pre-line">{summary}</p>
              </div>
            )}
          </div>
        </div>

        {/* Refined Minimalist Interaction Bar (Matching Reference) */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[94%] max-w-[540px] h-16 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-2xl border border-gray-100 dark:border-white/5 rounded-full z-[100] px-8 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-10">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2.5 transition-all ${isLiked ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
            >
              <span className={`material-symbols-outlined text-[24px] ${isLiked ? 'filled-icon scale-110' : 'hover:scale-110'}`}>favorite</span>
              <span className="text-[14px] font-bold tracking-tight">{likes}</span>
            </button>

            <button
              onClick={() => setShowCommentBox(!showCommentBox)}
              className="flex items-center gap-2.5 text-slate-400 hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined text-[24px] hover:scale-110 transition-transform">chat_bubble</span>
              <span className="text-[14px] font-bold tracking-tight">{comments.length}</span>
            </button>

            <button className="flex items-center gap-2.5 text-slate-400 hover:text-primary transition-all">
              <span className="material-symbols-outlined text-[24px] hover:scale-110 transition-transform">sync</span>
              <span className="text-[14px] font-bold tracking-tight">26</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
              <span className="material-symbols-outlined text-[24px] hover:scale-110 transition-transform">ios_share</span>
            </button>
          </div>
        </div>

        {/* Minimal Inline Comment Box */}
        {showCommentBox && (
          <div className="mt-16 animate-slide-up border-t border-gray-100 dark:border-white/5 pt-16">
            <form onSubmit={handleAddComment} className="relative mb-16">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="O que você está pensando?"
                className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-3xl p-8 pb-20 text-lg font-serif placeholder:text-slate-300 dark:placeholder:text-white/10 focus:ring-1 focus:ring-primary/20 outline-none resize-none transition-all h-[200px]"
              />
              <div className="absolute bottom-6 right-6 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowCommentBox(false)}
                  className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
                >
                  Cancelar
                </button>
                <button
                  disabled={!newComment.trim() || isSubmittingComment}
                  className="px-8 py-2.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {isSubmittingComment ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            </form>

            {/* Real Comments List */}
            <div className="space-y-12">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-300 mb-10">Diálogo e Reflexões ({comments.length})</h3>
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-6 group">
                  <div className="size-10 rounded-full bg-cover bg-center shrink-0 shadow-lg ring-1 ring-black/5 dark:ring-white/5" style={{ backgroundImage: `url("${comment.authorAvatar}")` }} />
                  <div className="space-y-3 flex-1 pb-10 border-b border-gray-50 dark:border-white/[0.02] last:border-none">
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-black dark:text-white uppercase tracking-tight">{comment.authorName}</span>
                      <span className="text-[9px] font-bold text-slate-300 uppercase">Há pouco</span>
                    </div>
                    <p className="text-[17px] text-slate-600 dark:text-slate-400 leading-relaxed font-serif">{comment.text}</p>
                    <div className="flex items-center gap-6 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[10px] font-black uppercase tracking-widest text-primary/50 hover:text-primary transition-colors">Responder</button>
                      <button className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-500 transition-colors">Gostar</button>
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-gray-50 dark:border-white/[0.02] rounded-[40px]">
                  <p className="text-slate-300 font-serif italic text-lg">Inicie a conversa...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </article>
    </section>
  );
};

export default ArticleView;
