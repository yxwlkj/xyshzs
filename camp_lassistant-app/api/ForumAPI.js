// ForumAPI.js – minimal GitHub API wrapper stub
import { github_api } from 'github';

export default class ForumAPI {
    async addPost(author, content) {
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author, content })
        });
        return res.json();
    }

    async getPosts() {
        const res = await fetch('/api/posts');
        return res.json();
    }

    async addReply(postId, author, content) {
        const res = await fetch(`/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author, content })
        });
        return res.json();
    }
} 
