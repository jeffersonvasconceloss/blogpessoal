
import React from 'react';
import { ME } from '../constants';


const AboutView: React.FC = () => {
  return (
    <div className="max-w-[800px] mx-auto w-full flex flex-col gap-10 py-8 md:py-12 px-6 animate-fade-in">
      <header className="flex flex-col items-center text-center gap-6 pt-4 md:pt-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-orange-300 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div
            className="relative bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 md:h-48 md:w-48 border-4 border-white dark:border-[#1a1a1a] shadow-2xl"
            style={{ backgroundImage: `url("${ME.avatar}")` }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-5xl font-black leading-tight tracking-tight font-newsreader px-4">Sobre o autor e este laboratório</h1>
          <p className="text-primary text-base md:text-lg italic font-serif flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-primary/30"></span>
            {ME.role}
            <span className="w-8 h-px bg-primary/30"></span>
          </p>
        </div>
      </header>

      <article className="flex flex-col gap-6 text-base md:text-lg leading-relaxed text-slate-700 dark:text-gray-300 font-serif">
        <p className="first-letter-drop">
          Bem-vindo a este espaço de exploração intelectual e produções criativas. Aqui, busco tecer reflexões sobre a condição humana, literatura e filosofia, mantendo um compromisso inegociável com a estética e a profundidade. Cada entrada é um fragmento de um diálogo contínuo, uma tentativa de capturar a beleza e a complexidade do pensamento em forma de palavra escrita.
        </p>
        <p>
          A missão deste blog é oferecer um refúgio para o pensamento lento em uma era de imediatismo. Através de diários intelectuais e ensaios, convido o leitor a mergulhar em temas que transcendem o cotidiano, explorando a intersecção entre a arte clássica e as questões contemporâneas da existência.
        </p>
        <blockquote className="border-l-4 border-primary pl-6 py-4 my-6 italic text-xl md:text-2xl text-slate-800 dark:text-white/80 font-newsreader bg-primary/5 rounded-r-xl pr-6">
          "A escrita não é apenas um registro do que foi pensado, mas o próprio ato de pensar em sua forma mais pura e destilada."
        </blockquote>
        <p>
          Desde 2024, este jornal tem servido como um laboratório de ideias onde a filosofia encontra a narrativa. O objetivo não é apenas informar, mas provocar o espanto necessário para que o pensamento crítico floresça.
        </p>
      </article>

      <section className="mt-8 p-10 rounded-2xl bg-slate-900 dark:bg-white/5 text-white dark:text-white flex flex-col items-center text-center gap-8 shadow-2xl shadow-slate-900/20">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight font-newsreader">Cultive este Pensamento</h2>
          <p className="text-slate-400 max-w-lg text-sm md:text-base font-serif italic">
            Este projeto é independente e mantido por leitores entusiastas. Se você valoriza este conteúdo, considere tornar-se um patrono desta jornada intelectual.
          </p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] py-4 px-12 rounded-xl transition-all transform hover:scale-[1.05] active:scale-95 shadow-xl shadow-primary/20">
          Apoiar agora
        </button>
      </section>

      <footer className="mt-12 pt-12 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 pb-12">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Canais de Diálogo</p>
          <a className="text-lg md:text-xl text-slate-900 dark:text-white hover:text-primary transition-colors underline underline-offset-8 decoration-primary/30 font-newsreader font-bold" href={`mailto:${ME.email}`}>
            {ME.email}
          </a>
        </div>
        <div className="flex gap-4">
          <a className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-primary/10 transition-all group active:scale-90" href="#">
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">alternate_email</span>
          </a>
          <a className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-primary/10 transition-all group active:scale-90" href="#">
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">language</span>
          </a>
        </div>
      </footer>
    </div>
  );
};


export default AboutView;
