import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const articles = [
        {
            title: "A Arquitetura do Silêncio: Sobre o Estoicismo Moderno",
            slug: "arquitetura-do-silencio",
            excerpt: "Em uma era de ruído perpétuo, como projetamos nossos espaços internos para resistir à erosão da atenção?",
            content: "Falar de silêncio no século XXI é falar de um recurso em extinção. Somos a primeira geração a viver em um estado de disponibilidade digital contínua...",
            category: "Pensamento",
            readTime: "12 min",
            imageUrl: "https://picsum.photos/seed/silence/800/450",
            authorName: "Jefferson Vasconcelos",
            authorRole: "Escritor e Pesquisador",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jefferson",
            authorEmail: "contato@jefferson.com",
            authorBio: "Cultural critic and philosopher focused on the intersection of classical wisdom and digital life.",
            likes: 1200,
            commentsCount: 48
        },
        {
            title: "Oatmeal & Abs",
            slug: "oatmeal-abs",
            excerpt: "Personal reflections on nutrition and consistency in a distracting world.",
            content: "Content about health and fitness consistency...",
            category: "Biblioteca",
            readTime: "2 min",
            imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=300",
            authorName: "Jefferson Vasconcelos",
            authorRole: "Escritor e Pesquisador",
            authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jefferson",
            authorEmail: "contato@jefferson.com",
            authorBio: "Cultural critic and philosopher focused on the intersection of classical wisdom and digital life.",
            likes: 120,
            commentsCount: 5,
            bookInfo: {
                title: "Oatmeal & Abs",
                author: "Parker Klein",
                rating: 3.5,
                status: "Lido",
                coverUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=300"
            }
        }
    ];

    for (const article of articles) {
        await prisma.post.upsert({
            where: { slug: article.slug },
            update: {},
            create: article,
        });
    }

    console.log('Seed finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
