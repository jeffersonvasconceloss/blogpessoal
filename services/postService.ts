
import { Article } from '../types';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export class PostService {
    async getPosts(all: boolean = false): Promise<Article[]> {
        const url = all ? `${API_URL}/posts?all=true` : `${API_URL}/posts`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        return data.map(this.mapToArticle);
    }

    async getPostById(id: string): Promise<Article | undefined> {
        const response = await fetch(`${API_URL}/posts/${id}`);
        if (!response.ok) return undefined;
        const data = await response.json();
        return this.mapToArticle(data);
    }

    async savePost(post: Partial<Article>): Promise<Article> {
        const method = post.id ? 'PUT' : 'POST';
        const url = post.id ? `${API_URL}/posts/${post.id}` : `${API_URL}/posts`;

        console.log(`Saving post: ${method} to ${url}`, post);

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        });

        if (!response.ok) throw new Error('Failed to save post');
        const data = await response.json();
        return this.mapToArticle(data);
    }

    async deletePost(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/posts/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete post');
    }

    async likePost(id: string): Promise<number> {
        const response = await fetch(`${API_URL}/posts/${id}/like`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to like post');
        const data = await response.json();
        return data.likes;
    }

    async getComments(postId: string): Promise<any[]> {
        const response = await fetch(`${API_URL}/posts/${postId}/comments`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        return await response.json();
    }

    async addComment(postId: string, comment: { authorName: string; text: string; parentId?: string }): Promise<any> {
        const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comment)
        });
        if (!response.ok) throw new Error('Failed to add comment');
        return await response.json();
    }

    private mapToArticle(data: any): Article {
        return {
            ...data,
            id: data.id,
            author: {
                name: data.authorName,
                role: data.authorRole,
                avatar: data.authorAvatar,
                email: data.authorEmail,
                bio: data.authorBio
            },
            // Prisma returns Date object or string for date, normalize to locale string if needed
            // but the frontend seems to expect a specific string format.
            date: new Date(data.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
        };
    }
}

export const postService = new PostService();
