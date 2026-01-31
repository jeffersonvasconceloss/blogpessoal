
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
  const [isSaving, setIsSaving] = useState(false);
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

  const handlePublish = async () => {
    setIsSaving(true);
    const content = contentValueRef.current;

    // Auto-fill title and excerpt for library posts if hidden
    const finalTitle = category === 'Biblioteca' ? `Notas de Leitura: ${bookTitle}` : title;
    const finalExcerpt = category === 'Biblioteca' ? `${bookAuthor} - ${bookStatus}` : (excerpt || (content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'));

    const slug = finalTitle.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    await postService.savePost({
      id: article?.id,
      title: finalTitle,
      content,
      excerpt: finalExcerpt,
      category,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      slug,
      readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min`,
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

    setIsSaving(false);
    onPublish();
  };

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
    document.execCommand(command, false, value);
    if (contentEditableRef.current) {
      contentValueRef.current = contentEditableRef.current.innerHTML;
      contentEditableRef.current.focus();
    }
  };

  const applyHeading = (level: string) => {
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

  const insertButton = (type: 'primary' | 'outline') => {
    const text = prompt('Texto do Botão:', 'Clique Aqui');
    const url = prompt('URL do Botão:', 'https://');
    if (text && url) {
      const style = type === 'primary'
        ? 'background: #f45d2f; color: white; padding: 12px 24px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; margin: 10px 0;'
        : 'background: transparent; color: #f45d2f; border: 2px solid #f45d2f; padding: 10px 22px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block; margin: 10px 0;';
      insertHTML(`<a href="${url}" target="_blank" style="${style}">${text}</a>&nbsp;`);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden bg-white dark:bg-background-dark">
      {/* Top Bar: Actions */}
      <nav className="flex items-center justify-between px-6 py-2 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-background-dark">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors text-gray-400 dark:text-slate-500"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-none">Guardado</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-[12px] font-bold text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
            Rascunho
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving || !title}
            className="px-8 py-2 bg-[#ff6b00] hover:bg-[#e66000] text-white text-[11px] font-black rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-50 uppercase tracking-[0.1em]"
          >
            {isSaving ? 'Aguarde...' : 'PUBLICAR'}
          </button>
        </div>
      </nav>

      {/* Main Formatting Toolbar */}
      <div className="flex items-center justify-center border-b border-gray-100 dark:border-white/5 py-1.5 px-4 bg-white dark:bg-background-dark overflow-x-auto no-scrollbar shadow-sm">
        <div className="flex items-center gap-1">
          <ToolbarBtn icon="undo" onClick={() => applyFormatting('undo')} />
          <ToolbarBtn icon="redo" onClick={() => applyFormatting('redo')} />
          <Divider />
          <ToolbarDropdown label="Estilo" items={[
            { label: 'Título Grande', action: () => applyHeading('h1') },
            { label: 'Título Médio', action: () => applyHeading('h2') },
            { label: 'Título Pequeno', action: () => applyHeading('h3') },
            { label: 'Texto Normal', action: () => applyHeading('p') }
          ]} />
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => applyHeading('h1')}
              className="px-3 py-1 text-[12px] font-black bg-gray-50 dark:bg-white/5 hover:bg-primary/10 rounded-lg text-gray-500 dark:text-slate-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5"
              title="Título Grande (H1)"
            >
              H1
            </button>
            <button
              onClick={() => applyHeading('h2')}
              className="px-3 py-1 text-[12px] font-black bg-gray-50 dark:bg-white/5 hover:bg-primary/10 rounded-lg text-gray-500 dark:text-slate-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5"
              title="Título Médio (H2)"
            >
              H2
            </button>
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
          <ToolbarBtn icon="format_strikethrough" onClick={() => applyFormatting('strikeThrough')} />
          <ToolbarBtn icon="code" onClick={() => applyFormatting('formatBlock', '<pre>')} />
          <Divider />
          <ToolbarBtn icon="link" onClick={() => {
            const url = prompt('Inserir Link:');
            if (url) applyFormatting('createLink', url);
          }} />
          <ToolbarBtn icon="image" onClick={() => {
            const url = prompt('URL da Imagem:');
            if (url) applyFormatting('insertImage', url);
          }} />
          <ToolbarBtn icon="headphones" onClick={() => {
            const url = prompt('URL do Áudio (MP3):');
            if (url) insertHTML(`<audio src="${url}" controls style="width: 100%; margin: 10px 0; border-radius: 12px;"></audio><br/>`);
          }} />
          <ToolbarBtn icon="videocam" onClick={() => {
            const url = prompt('URL do Vídeo (Youtube ou MP4):');
            if (url) {
              if (url.includes('youtube.com') || url.includes('youtu.be')) {
                const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
                insertHTML(`<div style="position: relative; padding-bottom: 56.25%; height: 0; margin: 20px 0; border-radius: 16px; overflow: hidden;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe></div><br/>`);
              } else {
                insertHTML(`<video src="${url}" controls style="width: 100%; margin: 10px 0; border-radius: 16px;"></video><br/>`);
              }
            }
          }} />
          <ToolbarBtn icon="format_quote" onClick={() => applyHeading('blockquote')} />
          <Divider />
          <ToolbarBtn icon="format_list_bulleted" onClick={() => applyFormatting('insertUnorderedList')} />
          <ToolbarBtn icon="format_list_numbered" onClick={() => applyFormatting('insertOrderedList')} />
          <Divider />
          <ToolbarDropdown label="Botão" items={[
            { label: 'Botão Principal', action: () => insertButton('primary') },
            { label: 'Botão Minimalista', action: () => insertButton('outline') }
          ]} />
          <Divider />
          <ToolbarDropdown label="Mais" items={[
            { label: 'Divisor', action: () => applyFormatting('insertHorizontalRule') },
            { label: 'Limpar Formatação', action: () => applyFormatting('removeFormat') }
          ]} />
          <Divider />
          <button
            onClick={() => setShowAI(!showAI)}
            className={`p-2 rounded-lg transition-all flex items-center gap-1 ${showAI ? 'bg-orange-50 dark:bg-primary/20 text-[#ff6b00]' : 'text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
          >
            <span className={`material-symbols-outlined text-[18px] ${showAI ? 'filled-icon font-bold' : ''}`}>auto_awesome</span>
            <span className="text-[10px] font-bold uppercase tracking-wider hidden md:block">Inspirar</span>
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-background-dark no-scrollbar scroll-smooth">
        <main className="max-w-[800px] mx-auto w-full px-8 py-10 animate-fade-in relative">

          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500 group cursor-pointer hover:text-gray-600 dark:hover:text-slate-300 transition-colors w-fit">
              <span className="material-symbols-outlined text-[18px]">email</span>
              <span className="text-[13px] font-medium border-b border-transparent group-hover:border-gray-300">Cabeçalho / rodapé de e-mail</span>
            </div>

            <CategoryDropdown
              value={category}
              onChange={setCategory}
              options={['Pensamento', 'Escrita', 'Biblioteca', 'Projeto']}
            />
          </div>

          {/* ... (category === 'Biblioteca' remains the same but updated to use bookCover state) */}
          {/* Dynamic Component: Biblioteca */}
          {category === 'Biblioteca' && (
            <div className="mb-12 p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 animate-slide-up grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Ficha Técnica do Livro</h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Título da Obra</label>
                    <input
                      type="text"
                      placeholder="Ex: Meditações"
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      className="w-full bg-white dark:bg-background-dark border border-gray-100 dark:border-white/5 focus:border-primary/40 rounded-xl px-4 py-3 text-[14px] font-medium dark:text-white outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Autor / Escritor</label>
                    <input
                      type="text"
                      placeholder="Ex: Marco Aurélio"
                      value={bookAuthor}
                      onChange={(e) => setBookAuthor(e.target.value)}
                      className="w-full bg-white dark:bg-background-dark border border-gray-100 dark:border-white/5 focus:border-primary/40 rounded-xl px-4 py-3 text-[14px] font-medium dark:text-white outline-none transition-all shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Status</label>
                      <select
                        value={bookStatus}
                        onChange={(e) => setBookStatus(e.target.value as any)}
                        className="w-full bg-white dark:bg-background-dark border border-gray-100 dark:border-white/5 focus:border-primary/40 rounded-xl px-4 py-3 text-[14px] font-medium dark:text-white outline-none transition-all shadow-sm"
                      >
                        <option value="Lendo">Lendo</option>
                        <option value="Lido">Lido</option>
                        <option value="Quero Ler">Quero Ler</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Rating (0-10)</label>
                      <div className="flex items-center gap-1 bg-white dark:bg-background-dark px-4 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                        <input
                          type="number"
                          step="0.1"
                          min="0" max="10"
                          value={bookRating}
                          onChange={(e) => setBookRating(Number(e.target.value))}
                          className="w-full bg-transparent text-[14px] font-bold text-primary outline-none"
                        />
                        <span className="text-slate-400 text-xs font-bold">/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Capa & Visual</h4>
                <div
                  onClick={() => document.getElementById('cover-upload')?.click()}
                  className={`relative aspect-[3/4] w-[160px] mx-auto rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden ${bookCover ? 'border-primary/20 bg-primary/5' : 'border-gray-200 dark:border-white/10 hover:border-primary/40 hover:bg-primary/5'}`}
                >
                  {bookCover ? (
                    <>
                      <img src={bookCover} alt="Capa" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">edit</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-4xl">add_photo_alternate</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Capa</span>
                    </>
                  )}
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setBookCover(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <p className="text-center text-[10px] text-slate-400 font-medium italic">Importe uma imagem de alta qualidade para a estante.</p>
              </div>
            </div>
          )}

          {/* Dynamic Component: Projeto */}
          {category === 'Projeto' && (
            <div className="mb-12 p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 animate-slide-up space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Configuração do Projeto</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Status de Desenvolvimento</label>
                  <select
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value as any)}
                    className="w-full bg-white dark:bg-background-dark border border-gray-100 dark:border-white/5 focus:border-primary/40 rounded-xl px-4 py-3 text-[14px] font-medium dark:text-white outline-none"
                  >
                    <option value="Em Desenvolvimento">Em Desenvolvimento</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Pausado">Pausado</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Tech Stack (Separado por vírgula)</label>
                  <input
                    type="text"
                    placeholder="Ex: React, Tailwind, GCP"
                    value={projectTech}
                    onChange={(e) => setProjectTech(e.target.value)}
                    className="w-full bg-white dark:bg-background-dark border border-gray-100 dark:border-white/5 focus:border-primary/40 rounded-xl px-4 py-3 text-[14px] font-medium dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Link do Site / Demo</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    className="w-full bg-white dark:bg-background-dark border border-gray-100 dark:border-white/5 focus:border-primary/40 rounded-xl px-4 py-3 text-[14px] font-medium dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Github Repository</label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={projectGithub}
                    onChange={(e) => setProjectGithub(e.target.value)}
                    className="w-full bg-white dark:bg-background-dark border border-gray-100 dark:border-white/5 focus:border-primary/40 rounded-xl px-4 py-3 text-[14px] font-medium dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Component: Pensamento */}
          {category === 'Pensamento' && (
            <div className="mb-12 p-8 bg-orange-50/30 dark:bg-primary/5 rounded-[40px] border border-orange-100/50 dark:border-primary/10 animate-slide-up space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Insight Central</h4>
              <textarea
                placeholder="Qual é a ideia principal desta reflexão?"
                value={thoughtInsight}
                onChange={(e) => setThoughtInsight(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-xl font-serif italic text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-white/10 resize-none min-h-[100px] leading-relaxed"
              />
              <div className="pt-4 border-t border-orange-100/50 dark:border-primary/10 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[18px]">lightbulb</span>
                <input
                  type="text"
                  placeholder="Fonte de Inspiração (Opcional)"
                  value={thoughtSource}
                  onChange={(e) => setThoughtSource(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[12px] font-bold uppercase tracking-widest text-slate-500 placeholder:text-slate-300"
                />
              </div>
            </div>
          )}

          {/* Dynamic Component: Escrita */}
          {category === 'Escrita' && (
            <div className="mb-12 p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 animate-slide-up grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Gênero / Estilo</label>
                <input
                  type="text"
                  placeholder="Ex: Ensaio, Conto, Ensaio Técnico"
                  value={writingGenre}
                  onChange={(e) => setWritingGenre(e.target.value)}
                  className="w-full bg-white dark:bg-background-dark border border-gray-100 dark:border-white/5 focus:border-primary/40 rounded-xl px-4 py-3 text-[14px] font-medium dark:text-white outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Público-Alvo</label>
                <input
                  type="text"
                  placeholder="Ex: Estudantes, Desenvolvedores, Geral"
                  value={writingAudience}
                  onChange={(e) => setWritingAudience(e.target.value)}
                  className="w-full bg-white dark:bg-background-dark border border-gray-100 dark:border-white/5 focus:border-primary/40 rounded-xl px-4 py-3 text-[14px] font-medium dark:text-white outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-8">
            {category !== 'Biblioteca' && (
              <>
                <textarea
                  ref={titleRef}
                  placeholder="Título da Postagem"
                  className="w-full bg-transparent border-none focus:ring-0 text-[32px] md:text-[42px] font-newsreader font-bold text-[#111] dark:text-white placeholder-gray-100 dark:placeholder-white/10 resize-none p-0 leading-[1.2] selection:bg-orange-100 dark:selection:bg-primary/30 no-scrollbar"
                  value={title}
                  rows={1}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                  ref={excerptRef}
                  placeholder="Adicionar um subtítulo cativante..."
                  className="w-full bg-transparent border-none focus:ring-0 text-[21px] md:text-[25px] font-serif text-slate-500 dark:text-slate-400 placeholder-slate-200 dark:placeholder-white/10 resize-none p-0 leading-relaxed italic selection:bg-orange-100 dark:selection:bg-primary/30 no-scrollbar"
                  value={excerpt}
                  rows={1}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </>
            )}

            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/5 group cursor-default">
                <span className="text-[12px] font-medium text-gray-500 dark:text-slate-400">Jefferson Vasconcelos</span>
                <button className="flex text-gray-300 dark:text-slate-600 hover:text-gray-600 dark:hover:text-slate-300">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
              <button className="w-8 h-8 rounded-full border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-all hover:scale-105 active:scale-95">
                <span className="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>

            <div className={`mt-12 pt-12 border-t border-gray-100 dark:border-white/5 transition-all duration-700 rounded-3xl ${isFocused ? 'bg-gray-50/50 dark:bg-white/[0.02] shadow-inner px-4 md:px-8 -mx-4 md:-mx-8' : ''}`}>
              <div
                ref={contentEditableRef}
                contentEditable
                suppressContentEditableWarning
                spellCheck="true"
                lang="pt-BR"
                data-placeholder="Escreva sua reflexão aqui..."
                onInput={(e) => {
                  contentValueRef.current = e.currentTarget.innerHTML;
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent border-none focus:outline-none font-serif text-[#1a1a1a] dark:text-slate-200 placeholder:text-slate-200 dark:placeholder:text-white/10 min-h-[60vh] pb-64 selection:bg-orange-100 dark:selection:bg-primary/30 no-scrollbar leading-[1.8] outline-none"
                style={{ direction: 'ltr', textAlign: 'left', fontSize: `${fontSize}px` }}
              ></div>
            </div>
          </div>
        </main>
      </div>

      {/* AI Inspiration Panel */}
      {showAI && (
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
      )}
    </div>
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
        className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-2 transition-all ${isOpen ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-white/10 text-gray-400 dark:text-slate-500 hover:border-primary/40'}`}
      >
        <span className="text-[11px] font-black uppercase tracking-[0.2em]">{value}</span>
        <span className={`material-symbols-outlined text-[18px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-[150] py-2 animate-fade-in overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => { onChange(option as Category); setIsOpen(false); }}
              className={`w-full text-left px-5 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${value === option ? 'text-primary bg-primary/5' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Divider = () => <div className="w-px h-6 bg-gray-100 dark:bg-white/10 mx-1"></div>;

export default EditorView;
