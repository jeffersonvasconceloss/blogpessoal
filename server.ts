import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.get('/api/posts', async (req, res) => {
    try {
        const { all } = req.query;
        const posts = await prisma.post.findMany({
            where: all === 'true' ? {} : { published: true },
            orderBy: { date: 'desc' }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: req.params.id }
        });
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        const {
            title, slug, excerpt, content, category, date, readTime, imageUrl,
            author, bookInfo, projectInfo, thoughtInfo, writingInfo, published
        } = req.body;

        const post = await prisma.post.create({
            data: {
                title: title || 'Sem título',
                slug: slug || `${(title || 'rascunho').toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                excerpt: excerpt || '',
                content: content || '',
                category,
                date: date ? new Date(date) : new Date(),
                readTime: readTime || '1 min',
                imageUrl: imageUrl || '',
                authorName: author?.name || 'Jefferson Vasconcelos',
                authorRole: author?.role || '',
                authorAvatar: author?.avatar || '',
                authorEmail: author?.email || '',
                authorBio: author?.bio || '',
                bookInfo: bookInfo || undefined,
                projectInfo: projectInfo || undefined,
                thoughtInfo: thoughtInfo || undefined,
                writingInfo: writingInfo || undefined,
                published: published ?? false,
            }
        });
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

app.put('/api/posts/:id', async (req, res) => {
    try {
        const {
            title, excerpt, content, category, readTime, imageUrl,
            author, bookInfo, projectInfo, thoughtInfo, writingInfo, published
        } = req.body;

        const post = await prisma.post.update({
            where: { id: req.params.id },
            data: {
                title,
                excerpt,
                content,
                category,
                readTime,
                imageUrl,
                authorName: author?.name,
                authorRole: author?.role,
                authorAvatar: author?.avatar,
                authorEmail: author?.email,
                authorBio: author?.bio,
                bookInfo: bookInfo || undefined,
                projectInfo: projectInfo || undefined,
                thoughtInfo: thoughtInfo || undefined,
                writingInfo: writingInfo || undefined,
                published: published !== undefined ? published : undefined,
            }
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
        await prisma.post.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '..', 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        prisma.$disconnect();
        console.log('Process terminated');
    });
});
