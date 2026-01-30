
import { Article, Author, Comment } from './types';

export const ME: Author = {
  name: "Jefferson Vasconcelos",
  role: "Escritor e Pesquisador",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcszohosg4-q1KLMozO6Xqme6Z_NiOQIKkm91m13xPYaRyUjjtYb9R_RpF7efF1MjXRpYIpOFPOfgse_fs8iILRN0eq2CHH2vVN2sUNk6WX_oYQuGR5dIdDSOK7nS-FsbaF9PnGu_gyXFj9paP7RcQ2bgFfxPyoB5H9WsEZdNLwgNAkF4rOyKLujYNgIAQ2Ypf48dq62OFGJJ2mgk7mtgSKbzJvuXQGyR3fmEWKm-sQhM-GEujFjqJWsdDfLPYtTwhrsoH8_MEIqCD",
  email: "contato@jefferson.com",
  bio: "Cultural critic and philosopher focused on the intersection of classical wisdom and digital life. Exploring the nature of creative thought and intellectual production."
};

export const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "A Arquitetura do Silêncio: Sobre o Estoicismo Moderno",
    slug: "arquitetura-do-silencio",
    excerpt: "Em uma era de ruído perpétuo, como projetamos nossos espaços internos para resistir à erosão da atenção?",
    content: "Falar de silêncio no século XXI é falar de um recurso em extinção. Somos a primeira geração a viver em um estado de disponibilidade digital contínua, onde as fronteiras entre o eu privado e a esfera pública não apenas se confundiram, mas colapsaram inteiramente. O estoicismo moderno oferece um plano — não para a retirada, mas para uma reestruturação consciente de nossa arquitetura cognitiva. Sugere que a 'cidadela interior' descrita por Marco Aurélio não é uma fortaleza construída uma vez e deixada de pé, mas uma estrutura viva que requer manutenção diária.",
    category: "Filosofia",
    date: "24 Out, 2024",
    readTime: "12 min",
    imageUrl: "https://picsum.photos/seed/silence/800/450",
    author: ME,
    likes: 1200,
    commentsCount: 48
  },
  {
    id: "2",
    title: "A Estética do Minimalismo Literário",
    slug: "estetica-minimalismo",
    excerpt: "Como a redução de ruído visual transforma a experiência de leitura e escrita contemporânea. O poder do que não é dito.",
    content: "O minimalismo não é sobre ter menos, é sobre criar espaço para mais clareza intelectual. Na literatura, isso se traduz na precisão cirúrgica da palavra. Exploramos por que o silêncio entre as linhas é tão importante quanto as palavras na página.",
    category: "Escrita",
    date: "12 Out, 2024",
    readTime: "8 min",
    imageUrl: "https://picsum.photos/seed/writing/800/450",
    author: ME,
    likes: 850,
    commentsCount: 22
  },
  {
    id: "3",
    title: "Algoritmos e a Curadoria da Alma",
    slug: "algoritmos-curadoria",
    excerpt: "Refletindo sobre como as recomendações automatizadas moldam nossa identidade intelectual e o que perdemos na serendipidade.",
    content: "Vivemos em bolhas criadas por máquinas. A curadoria da alma requer um esforço consciente de busca pelo inesperado, pelo difícil e pelo sublime fora das recomendações do feed.",
    category: "Tecnologia",
    date: "08 Out, 2024",
    readTime: "15 min",
    imageUrl: "https://picsum.photos/seed/data/800/450",
    author: ME,
    likes: 2100,
    commentsCount: 95
  },
  {
    id: "4",
    title: "A Ética do Minimalismo na Era da Superabundância",
    slug: "etica-minimalismo",
    excerpt: "Por que escolher o 'menos' tornou-se um ato de resistência política e estética no século XXI.",
    content: "O consumo desenfreado de informação e bens materiais nos afasta de nossa essência. O minimalismo surge como uma resposta ética e estética a um mundo que não sabe parar.",
    category: "Ensaio",
    date: "20 Jan, 2024",
    readTime: "10 min",
    imageUrl: "https://picsum.photos/seed/minimal/800/450",
    author: ME,
    likes: 540,
    commentsCount: 14
  },
  {
    id: "5",
    title: "Oatmeal & Abs",
    slug: "oatmeal-abs",
    excerpt: "Personal reflections on nutrition and consistency in a distracting world.",
    content: "Content about health and fitness consistency...",
    category: "Biblioteca",
    date: "1/27/26",
    readTime: "2 min",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=300",
    author: ME,
    likes: 120,
    commentsCount: 5,
    bookInfo: {
      title: "Oatmeal & Abs",
      author: "Parker Klein",
      rating: 3.5,
      status: "Lido",
      coverUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=300"
    }
  },
  {
    id: "6",
    title: "Marketing Lessons from the Grateful Dead",
    slug: "marketing-grateful-dead",
    excerpt: "What every business can learn from the most iconic band in history.",
    content: "Deep dive into community marketing...",
    category: "Biblioteca",
    date: "1/24/26",
    readTime: "3 min",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300",
    author: ME,
    likes: 340,
    commentsCount: 12,
    bookInfo: {
      title: "Marketing Lessons from the Grateful Dead",
      author: "David Meerman Scott",
      rating: 6.4,
      status: "Lido",
      coverUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300"
    }
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    authorName: "Julian Vance",
    authorAvatar: "https://picsum.photos/seed/julian/40/40",
    date: "2 horas atrás",
    text: "A justaposição da arquitetura brutalista com o crescimento orgânico da paisagem em sua análise é particularmente marcante. Parece uma metáfora para as estruturas rígidas de pensamento que frequentemente impomos a uma realidade intrinsecamente caótica.",
    likes: 42,
    isAuthor: true,
    replies: [
      {
        id: "c1r1",
        authorName: "Elena Ross",
        authorAvatar: "https://picsum.photos/seed/elena/40/40",
        date: "1 hora atrás",
        text: "Precisamente, Julian. Lembra-me a 'máquina de morar' de Le Corbusier, mas até essas máquinas acabam sendo tomadas por heras e musgos. A entropia é a parte mais bela.",
        likes: 12
      }
    ]
  },
  {
    id: "c2",
    authorName: "Marcus Thorne",
    authorAvatar: "https://picsum.photos/seed/marcus/40/40",
    date: "4 horas atrás",
    text: "Excelente peça. Uma coisa que acho que falta é o contexto socioeconômico dessas estruturas. O Brutalismo não foi apenas uma escolha estética; foi muitas vezes um compromisso radical com a habitação pública e o bem-estar comunitário que abandonamos amplamente.",
    likes: 28
  }
];
