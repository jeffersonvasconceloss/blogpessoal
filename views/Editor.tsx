
import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { postService } from '../services/postService';
import { Article, Category } from '../types';

interface EditorProps {
  article?: Article | null;
  onPublish: () => void;
  onCancel: () => void;
}

const EditorView: React.FC<EditorProps> = ({ article, onPublish, onCancel }) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [category, setCategory] = useState<Category>(article?.category || 'Pensamento');
  const [imageUrl, setImageUrl] = useState(article?.imageUrl || '');
  const [postId, setPostId] = useState(article?.id || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [lastSavedContent, setLastSavedContent] = useState(article?.content || '');
  const [showAI, setShowAI] = useState(false);
  const [inspirations, setInspirations] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  // Book Specific State
  const [bookTitle, setBookTitle] = useState(article?.bookInfo?.title || '');
  const [bookAuthor, setBookAuthor] = useState(article?.bookInfo?.author || '');
  const [bookRating, setBookRating] = useState(article?.bookInfo?.rating || 5);
  const [bookStatus, setBookStatus] = useState<'Lendo' | 'Lido' | 'Quero Ler'>(article?.bookInfo?.status || 'Lido');
  const [bookCover, setBookCover] = useState(article?.bookInfo?.coverUrl || '');

  // Project Specific State
  const [projectStatus, setProjectStatus] = useState<any>(article?.projectInfo?.status || 'Em Desenvolvimento');
  const [projectTech, setProjectTech] = useState(article?.projectInfo?.techStack?.join(', ') || '');
  const [projectLink, setProjectLink] = useState(article?.projectInfo?.link || '');
  const [projectGithub, setProjectGithub] = useState(article?.projectInfo?.github || '');

  // Thought Specific State
  const [thoughtInsight, setThoughtInsight] = useState(article?.thoughtInfo?.coreInsight || '');
  const [thoughtSource, setThoughtSource] = useState(article?.thoughtInfo?.inspirationSource || '');

  // Writing Specific State
  const [writingGenre, setWritingGenre] = useState(article?.writingInfo?.genre || '');
  const [writingAudience, setWritingAudience] = useState(article?.writingInfo?.targetAudience || '');
  const [fontSize, setFontSize] = useState(16);
  const [isFocused, setIsFocused] = useState(false);
  const [activeModal, setActiveModal] = useState<'link' | 'image' | 'audio' | 'video' | 'button' | null>(null);
  const [modalData, setModalData] = useState({ title: '', url: '', type: '' });

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const excerptRef = useRef<HTMLTextAreaElement>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const contentValueRef = useRef(article?.content || '');

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setExcerpt(article.excerpt);
      setCategory(article.category);
      setImageUrl(article.imageUrl);

      contentValueRef.current = article.content;
      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = article.content;
      }

      if (article.bookInfo) {
        setBookTitle(article.bookInfo.title);
        setBookAuthor(article.bookInfo.author);
        setBookRating(article.bookInfo.rating);
        setBookStatus(article.bookInfo.status);
        setBookCover(article.bookInfo.coverUrl || '');
      }
      if (article.projectInfo) {
        setProjectStatus(article.projectInfo.status);
        setProjectTech(article.projectInfo.techStack.join(', '));
        setProjectLink(article.projectInfo.link || '');
        setProjectGithub(article.projectInfo.github || '');
      }
      if (article.thoughtInfo) {
        setThoughtInsight(article.thoughtInfo.coreInsight);
        setThoughtSource(article.thoughtInfo.inspirationSource || '');
      }
      if (article.writingInfo) {
        setWritingGenre(article.writingInfo.genre);
        setWritingAudience(article.writingInfo.targetAudience || '');
      }
    }

    // Set default paragraph separator for better structure
    document.execCommand('defaultParagraphSeparator', false, 'p');
  }, [article]);

  const handleSave = async (isFinal: boolean = false) => {
    if (isFinal) setIsSaving(true);
    else setIsAutosaving(true);

    const content = contentValueRef.current;

    // Auto-fill title and excerpt for special categories
    const finalTitle =
      category === 'Biblioteca' ? (bookTitle ? `Notas de Leitura: ${bookTitle}` : 'Notas de Leitura') :
        category === 'Pensamento' ? (thoughtInsight ? `Reflexão: ${thoughtInsight.substring(0, 50)}${thoughtInsight.length > 50 ? '...' : ''}` : 'Nova Reflexão') :
          title;

    const finalExcerpt =
      category === 'Biblioteca' ? `${bookAuthor || 'Autor desconhecido'} - ${bookStatus}` :
        category === 'Pensamento' ? thoughtInsight :
          (excerpt || (content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'));

    const slug = (finalTitle || 'rascunho').toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    try {
      const savedPost = await postService.savePost({
        id: postId || undefined,
        title: finalTitle || 'Sem título',
        content,
        excerpt: finalExcerpt,
        category,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        slug: slug || `rascunho-${Date.now()}`,
        readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min`,
        published: isFinal,
        author: article?.author || {
          name: 'Jefferson Vasconcelos',
          role: 'Escritor e Filósofo',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jefferson',
          email: 'contato@jefferson.com',
          bio: 'Explorando a intersecção entre pensamento clássico e modernidade tecnológica.'
        },
        bookInfo: category === 'Biblioteca' ? {
          title: bookTitle,
          author: bookAuthor,
          rating: bookRating,
          status: bookStatus,
          coverUrl: bookCover
        } : undefined,
        projectInfo: category === 'Projeto' ? {
          status: projectStatus,
          techStack: projectTech.split(',').map(s => s.trim()),
          link: projectLink,
          github: projectGithub
        } : undefined,
        thoughtInfo: category === 'Pensamento' ? {
          coreInsight: thoughtInsight,
          inspirationSource: thoughtSource
        } : undefined,
        writingInfo: category === 'Escrita' ? {
          genre: writingGenre,
          targetAudience: writingAudience
        } : undefined
      });

      setPostId(savedPost.id);
      setLastSavedContent(content);

      if (!isFinal) {
        setLastSavedAt(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        setIsAutosaving(false);
      } else {
        setIsSaving(false);
        onPublish();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setIsSaving(false);
      setIsAutosaving(false);
    }
  };

  // Autosave Effect
  useEffect(() => {
    const timer = setInterval(() => {
      const currentContent = contentValueRef.current;
      if (currentContent !== lastSavedContent && currentContent.length > 10) {
        handleSave(false);
      }
    }, 10000); // Tenta salvar a cada 10 segundos se houver mudanças

    return () => clearInterval(timer);
  }, [lastSavedContent, title, bookTitle, category]);

  const getInspiration = async () => {
    setLoadingAI(true);
    const res = await geminiService.getWritingInspiration(title || "filosofia e tecnologia");
    setInspirations(res);
    setLoadingAI(false);
  };

  const adjustHeight = (ref: React.RefObject<HTMLTextAreaElement>) => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight(titleRef);
    adjustHeight(excerptRef);
  }, [title, excerpt]);

  // Rich Text Formatting Logic
  const applyFormatting = (command: string, value: string = '') => {
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
    document.execCommand(command, false, value);
    if (contentEditableRef.current) {
      contentValueRef.current = contentEditableRef.current.innerHTML;
    }
  };

  const applyHeading = (level: string) => {
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
    document.execCommand('formatBlock', false, level);
    if (contentEditableRef.current) {
      contentValueRef.current = contentEditableRef.current.innerHTML;
    }
  };

  const insertHTML = (html: string) => {
    document.execCommand('insertHTML', false, html);
    if (contentEditableRef.current) {
      contentValueRef.current = contentEditableRef.current.innerHTML;
      contentEditableRef.current.focus();
    }
  };

  const insertButton = (text: string, url: string, type: string) => {
    if (text && url) {
      const style = type === 'primary'
        ? 'background: #f45d2f; color: white; padding: 12px 24px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; margin: 10px 0;'
        : 'background: transparent; color: #f45d2f; border: 2px solid #f45d2f; padding: 10px 22px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; margin: 10px 0;';
      insertHTML(`<a href="${url}" target="_blank" rel="noopener noreferrer" style="${style}">${text}</a>&nbsp;`);
    }
  };

  const handleModalConfirm = () => {
    if (activeModal === 'link') {
      applyFormatting('createLink', modalData.url);
    } else if (activeModal === 'image') {
      applyFormatting('insertImage', modalData.url);
    } else if (activeModal === 'audio') {
      insertHTML(`<audio src="${modalData.url}" controls style="width: 100%; margin: 10px 0; border-radius: 12px;"></audio><br/>`);
    } else if (activeModal === 'video') {
      const url = modalData.url;
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
        insertHTML(`<div style="position: relative; padding-bottom: 56.25%; height: 0; margin: 20px 0; border-radius: 16px; overflow: hidden;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe></div><br/>`);
      } else {
        insertHTML(`<video src="${url}" controls style="width: 100%; margin: 10px 0; border-radius: 16px;"></video><br/>`);
      }
    } else if (activeModal === 'button') {
      insertButton(modalData.title, modalData.url, modalData.type);
    }
    setActiveModal(null);
    setModalData({ title: '', url: '', type: '' });
  };

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden bg-white dark:bg-background-dark">
      {/* Top Bar: Minimalist Actions */}
      <nav className="flex items-center justify-between px-8 py-3 bg-white dark:bg-background-dark border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-6">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            <span>Fechar</span>
          </button>
          <div className="w-px h-4 bg-gray-100 dark:bg-white/10"></div>
          <CategoryDropdown
            value={category}
            onChange={setCategory}
            options={['Pensamento', 'Escrita', 'Biblioteca', 'Projeto']}
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] font-medium text-gray-400 dark:text-slate-500 italic transition-all">
            {isAutosaving ? (
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Salvando...
              </span>
            ) : lastSavedAt ? (
              `Salvo às ${lastSavedAt}`
            ) : (
              'Salvo automaticamente'
            )}
          </span>
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving || (category !== 'Biblioteca' && !title)}
            className="px-6 py-2 bg-[#1a1a1a] dark:bg-white text-white dark:text-black text-[11px] font-black rounded-full hover:opacity-90 transition-all active:scale-95 disabled:opacity-30 uppercase tracking-widest min-w-[120px]"
          >
            {isSaving ? 'Salvando...' : 'Publicar'}
          </button>
        </div>
      </nav>

      {/* Main Formatting Toolbar - More discrete */}
      <div className="flex items-center justify-center py-2 px-4 bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-0.5 max-w-[1000px] w-full justify-center">
          <ToolbarBtn icon="undo" onClick={() => applyFormatting('undo')} />
          <ToolbarBtn icon="redo" onClick={() => applyFormatting('redo')} />
          <Divider />
          <div className="flex items-center gap-0.5 mx-1">
            <button
              onClick={() => applyHeading('h1')}
              className="px-2.5 py-1 text-[11px] font-black hover:bg-gray-200 dark:hover:bg-white/10 rounded-md text-gray-500 dark:text-slate-400 transition-colors"
            >H1</button>
            <button
              onClick={() => applyHeading('h2')}
              className="px-2.5 py-1 text-[11px] font-black hover:bg-gray-200 dark:hover:bg-white/10 rounded-md text-gray-500 dark:text-slate-400 transition-colors"
            >H2</button>
          </div>
          <Divider />
          <ToolbarDropdown label={`${fontSize}px`} items={[
            { label: '13px', action: () => setFontSize(13) },
            { label: '14px', action: () => setFontSize(14) },
            { label: '15px', action: () => setFontSize(15) },
            { label: '16px', action: () => setFontSize(16) }
          ]} />
          <Divider />
          <ToolbarBtn icon="format_bold" onClick={() => applyFormatting('bold')} />
          <ToolbarBtn icon="format_italic" onClick={() => applyFormatting('italic')} />
          <ToolbarBtn icon="code" onClick={() => applyFormatting('formatBlock', '<pre>')} />
          <Divider />
          <ToolbarBtn icon="link" onClick={() => setActiveModal('link')} />
          <ToolbarBtn icon="image" onClick={() => setActiveModal('image')} />
          <ToolbarBtn icon="headphones" onClick={() => setActiveModal('audio')} />
          <ToolbarBtn icon="videocam" onClick={() => setActiveModal('video')} />
          <ToolbarBtn icon="format_quote" onClick={() => applyHeading('blockquote')} />
          <Divider />
          <ToolbarBtn icon="format_list_bulleted" onClick={() => applyFormatting('insertUnorderedList')} />
          <ToolbarDropdown label="Botão" items={[
            { label: 'Principal', action: () => { setModalData(d => ({ ...d, type: 'primary' })); setActiveModal('button'); } },
            { label: 'Minimalista', action: () => { setModalData(d => ({ ...d, type: 'outline' })); setActiveModal('button'); } }
          ]} />
          <Divider />
          <button
            onClick={() => setShowAI(!showAI)}
            className={`p-2 rounded-lg transition-all flex items-center gap-1 ${showAI ? 'bg-primary text-white' : 'text-gray-400 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-white/10'}`}
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-background-dark no-scrollbar scroll-smooth">
        <main className="max-w-[720px] mx-auto w-full px-8 py-16 animate-fade-in relative">

          {/* Dynamic Component: Biblioteca (Compact Notion Style) */}
          {category === 'Biblioteca' && (
            <div className="mb-14 p-8 bg-gray-50/50 dark:bg-white/[0.02] rounded-[32px] border border-gray-100 dark:border-white/5 flex gap-10 items-start group animate-slide-up">
              <div
                onClick={() => document.getElementById('cover-upload')?.click()}
                className="relative w-[140px] aspect-[2/3] rounded-2xl shadow-2xl overflow-hidden cursor-pointer flex-shrink-0 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 group-hover:scale-[1.02] transition-transform duration-500"
              >
                {bookCover ? (
                  <img src={bookCover} alt="Capa" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                    <span className="material-symbols-outlined text-4xl mb-2">add_photo_alternate</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">Capa</span>
                  </div>
                )}
                <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setBookCover(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
              </div>
              <div className="flex-1 space-y-6 pt-2">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Título da Obra</span>
                  <input
                    type="text"
                    placeholder="Ex: O Alquimista"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-3xl font-newsreader font-bold text-slate-900 dark:text-white placeholder:text-gray-200 dark:placeholder:text-white/5"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Autor</span>
                  <input
                    type="text"
                    placeholder="Ex: Paulo Coelho"
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg font-newsreader italic text-slate-500 placeholder:text-gray-200 dark:placeholder:text-white/5"
                  />
                </div>
                <div className="flex items-center gap-10 pt-2">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Leitura</span>
                    <select
                      value={bookStatus}
                      onChange={(e) => setBookStatus(e.target.value as any)}
                      className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2 text-[12px] font-bold text-primary cursor-pointer outline-none focus:border-primary/40 appearance-none min-w-[120px]"
                    >
                      <option value="Lendo">Lendo</option>
                      <option value="Lido">Lido</option>
                      <option value="Quero Ler">Quero Ler</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Avaliação (0-10)</span>
                    <input
                      type="number" step="0.5" min="0" max="10"
                      value={bookRating}
                      onChange={(e) => setBookRating(Number(e.target.value))}
                      className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-2 text-[12px] font-bold text-primary w-20 outline-none focus:border-primary/40"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Component: Projeto */}
          {category === 'Projeto' && (
            <div className="mb-14 p-8 bg-gray-50/50 dark:bg-white/[0.02] rounded-[32px] border border-gray-100 dark:border-white/5 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Status do Projeto</span>
                  <select
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value as any)}
                    className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] font-bold dark:text-white outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Em Desenvolvimento">Em Desenvolvimento</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Pausado">Pausado</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tecnologias</span>
                  <input
                    type="text"
                    placeholder="Ex: React, AWS, Tailwind..."
                    value={projectTech}
                    onChange={(e) => setProjectTech(e.target.value)}
                    className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] font-bold dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/10 outline-none focus:border-primary/40 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Live Link</span>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-blue-500/50">link</span>
                    <input
                      type="text"
                      placeholder="https://meuprojeto.com"
                      value={projectLink}
                      onChange={(e) => setProjectLink(e.target.value)}
                      className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-[13px] font-bold text-blue-500 placeholder:text-gray-300 dark:placeholder:text-white/10 outline-none focus:border-primary/40 transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Repositório Github</span>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">code</span>
                    <input
                      type="text"
                      placeholder="https://github.com/..."
                      value={projectGithub}
                      onChange={(e) => setProjectGithub(e.target.value)}
                      className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-[13px] font-bold dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/10 outline-none focus:border-primary/40 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Component: Pensamento */}
          {category === 'Pensamento' && (
            <div className="mb-14 p-10 bg-[#1a0f0f]/30 dark:bg-white/[0.02] rounded-[32px] border border-gray-100 dark:border-white/5 animate-slide-up relative overflow-hidden group">
              <span className="material-symbols-outlined absolute -top-4 -left-2 text-[100px] text-primary/5 rotate-12 select-none group-hover:scale-110 transition-transform duration-700">format_quote</span>

              <div className="relative z-10 space-y-8">
                <textarea
                  placeholder="Qual o insight principal?"
                  value={thoughtInsight}
                  onChange={(e) => setThoughtInsight(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 p-0 text-2xl md:text-3xl font-newsreader italic text-slate-800 dark:text-white/90 placeholder:text-gray-200 dark:placeholder:text-white/10 resize-none leading-relaxed text-center"
                  rows={2}
                />

                <div className="flex flex-col items-center gap-4">
                  <div className="h-[1px] w-12 bg-primary/20"></div>
                  <input
                    type="text"
                    placeholder="Fonte de inspiração..."
                    value={thoughtSource}
                    onChange={(e) => setThoughtSource(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 p-0 text-[10px] font-black uppercase tracking-[0.25em] text-primary/60 placeholder:text-primary/20 text-center w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Component: Escrita */}
          {category === 'Escrita' && (
            <div className="mb-14 p-8 bg-gray-50/50 dark:bg-white/[0.02] rounded-[32px] border border-gray-100 dark:border-white/5 animate-slide-up grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Gênero / Estilo Literário</span>
                <input
                  type="text"
                  placeholder="Ex: Ensaio, Conto, Ensaio Técnico"
                  value={writingGenre}
                  onChange={(e) => setWritingGenre(e.target.value)}
                  className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] font-bold dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/10 outline-none focus:border-primary/40 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Público-Alvo</span>
                <input
                  type="text"
                  placeholder="Ex: Estudantes, Desenvolvedores, Geral"
                  value={writingAudience}
                  onChange={(e) => setWritingAudience(e.target.value)}
                  className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] font-bold dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/10 outline-none focus:border-primary/40 transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {category !== 'Biblioteca' && category !== 'Pensamento' && (
              <>
                <textarea
                  ref={titleRef}
                  placeholder="Título sem nome"
                  className="w-full bg-transparent border-none focus:ring-0 text-[42px] font-newsreader font-bold text-[#1a1a1a] dark:text-white placeholder-gray-100 dark:placeholder-white/10 resize-none p-0 leading-tight no-scrollbar"
                  value={title}
                  rows={1}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                  ref={excerptRef}
                  placeholder="Adicionar subtítulo..."
                  className="w-full bg-transparent border-none focus:ring-0 text-xl font-medium text-gray-400 dark:text-slate-500 placeholder-gray-100 dark:placeholder-white/10 resize-none p-0 leading-relaxed no-scrollbar"
                  value={excerpt}
                  rows={1}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </>
            )}

            <div className={`mt-10 transition-all duration-500 ${isFocused ? 'opacity-100' : 'opacity-90'}`}>
              <div
                ref={contentEditableRef}
                contentEditable
                suppressContentEditableWarning
                spellCheck="true"
                lang="pt-BR"
                data-placeholder={category === 'Pensamento' ? "Desenvolva sua reflexão aqui..." : "Escreva seu ensaio aqui..."}
                onInput={(e) => {
                  contentValueRef.current = e.currentTarget.innerHTML;
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent border-none focus:outline-none font-serif text-[#1a1a1a] dark:text-slate-200 placeholder:text-gray-100 dark:placeholder:text-white/5 min-h-[50vh] pb-64 no-scrollbar leading-[1.8] outline-none"
                style={{ direction: 'ltr', textAlign: 'left', fontSize: `${fontSize}px` }}
              ></div>
            </div>
          </div>
        </main>
      </div >

      {/* Insert Modal */}
      {
        activeModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center animate-fade-in p-6">
            <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-[440px] rounded-[32px] p-8 shadow-2xl animate-slide-up">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[18px] font-bold text-white font-newsreader">
                  {activeModal === 'link' && 'Inserir link'}
                  {activeModal === 'image' && 'Inserir imagem'}
                  {activeModal === 'audio' && 'Inserir áudio'}
                  {activeModal === 'video' && 'Inserir vídeo'}
                  {activeModal === 'button' && 'Configurar botão'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="space-y-6">
                {activeModal === 'button' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">Texto do Botão</label>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Clique Aqui"
                      value={modalData.title}
                      onChange={(e) => setModalData(d => ({ ...d, title: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 focus:border-primary/40 rounded-2xl px-5 py-4 text-[14px] font-medium text-white outline-none transition-all placeholder:text-white/10"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">
                    {activeModal === 'link' ? 'URL do Link' : activeModal === 'image' ? 'URL da Imagem' : activeModal === 'audio' ? 'URL do MP3' : activeModal === 'video' ? 'URL do vídeo (Youtube/MP4)' : 'Link de Destino'}
                  </label>
                  <input
                    autoFocus={activeModal !== 'button'}
                    type="text"
                    placeholder="https://..."
                    value={modalData.url}
                    onChange={(e) => setModalData(d => ({ ...d, url: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleModalConfirm()}
                    className="w-full bg-white/5 border border-white/10 focus:border-primary/40 rounded-2xl px-5 py-4 text-[14px] font-medium text-white outline-none transition-all placeholder:text-white/10"
                  />
                </div>
              </div>

              <button
                onClick={handleModalConfirm}
                className="w-full mt-10 py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-[13px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all shadow-lg active:scale-[0.98] shadow-blue-500/20"
              >
                OK
              </button>
            </div>
          </div>
        )
      }

      {/* AI Inspiration Panel */}
      {
        showAI && (
          <div className="fixed bottom-12 right-12 w-80 bg-white dark:bg-background-dark border border-gray-100 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden z-[100] animate-slide-up">
            <div className="p-4 bg-orange-50/50 dark:bg-primary/10 border-b border-orange-100 dark:border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff6b00] text-[18px] font-bold">auto_awesome</span>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ff6b00]">Poder Criativo</h4>
              </div>
              <button onClick={() => setShowAI(false)} className="text-orange-300 dark:text-primary/40 hover:text-[#ff6b00] dark:hover:text-primary">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <button
                onClick={getInspiration}
                disabled={loadingAI}
                className="w-full py-3.5 bg-[#1a1a1a] dark:bg-primary text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {loadingAI ? <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> : null}
                {loadingAI ? 'Invocando...' : 'Pedir Ajuda à Musa'}
              </button>

              {inspirations.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 no-scrollbar scroll-smooth">
                  {inspirations.map((insp, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-[13px] text-gray-600 dark:text-slate-300 italic border border-gray-100/50 dark:border-white/5 leading-relaxed cursor-pointer hover:bg-orange-50 dark:hover:bg-primary/10 transition-colors">
                      "{insp}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      }
    </div >
  );
};

interface ToolbarBtnProps {
  icon: string;
  active?: boolean;
  onClick: () => void;
}

const ToolbarBtn: React.FC<ToolbarBtnProps> = ({ icon, active, onClick }) => (
  <button
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`p-2 rounded-lg transition-colors ${active ? 'bg-gray-100 dark:bg-white/10 text-[#ff6b00]' : 'text-gray-500 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-slate-300'}`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
  </button>
);

interface DropdownItem {
  label: string;
  action: () => void;
}

const ToolbarDropdown: React.FC<{ label: string; items: DropdownItem[] }> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-0.5 px-2 py-2 text-[13px] font-bold text-gray-600 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors hover:text-gray-700 dark:hover:text-slate-300"
      >
        <span>{label}</span>
        <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-background-dark border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-[150] py-2 animate-fade-in">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => { item.action(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-[12px] font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryDropdown: React.FC<{ value: Category; onChange: (v: Category) => void; options: string[] }> = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
      >
        <span className={`w-2 h-2 rounded-full ${value === 'Biblioteca' ? 'bg-blue-500' : value === 'Projeto' ? 'bg-green-500' : value === 'Pensamento' ? 'bg-orange-500' : 'bg-purple-500'}`}></span>
        <span className="text-[12px] font-bold text-gray-600 dark:text-slate-300">{value}</span>
        <span className="material-symbols-outlined text-[16px] text-gray-400">expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-xl shadow-2xl z-[150] py-1 animate-fade-in overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => { onChange(option as Category); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-[12px] font-medium transition-colors ${value === option ? 'text-primary bg-primary/5' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Divider = () => <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-1"></div>;

export default EditorView;
