// OrderAPI.js – minimal GitHub API wrapper stub
import { github_api } from 'github';

export default class OrderAPI {
    async submitOrder(order) {
        // order may contain item, quantity, type, pickup, destination, campus
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        return res.json();
    }

    async listOrders() {
        const res = await fetch('/api/orders');
        return res.json();
    }

    async assignOrder(id, runner) {
        const res = await fetch(`/api/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ runner, status: 'assigned' })
        });
        return res.json();
    }

    async updateOrder(id, updates) {
        const res = await fetch(`/api/orders/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        return res.json();
    }
} 
