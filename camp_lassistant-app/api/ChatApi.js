// ChatApi.js – minimal GitHub API wrapper stub
import { github_api } from 'github';

export default class ChatAPI {
    async sendMessage(user, text) {
        const res = await fetch('/api/chat/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, text })
        });
        return res.json();
    }

    async getMessages() {
        const res = await fetch('/api/chat/messages');
        return res.json();
    }

    // token method stub
    getUserToken() {
        return Promise.resolve('token-placeholder');
    }
} 
