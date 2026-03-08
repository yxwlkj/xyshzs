// 订单模块API封装
class OrderAPI {
  constructor() {
    this.baseUrl = '/api';
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // 获取所有订单
  async getOrders() {
    const res = await fetch(`${this.baseUrl}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    return await res.json();
  }

  // 创建新订单
  async createOrder(title, content) {
    const res = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, content })
    });
    return await res.json();
  }

  // 接单
  async takeOrder(orderId) {
    const res = await fetch(`${this.baseUrl}/orders/${orderId}/take`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    return await res.json();
  }

  // 完成订单
  async completeOrder(orderId) {
    const res = await fetch(`${this.baseUrl}/orders/${orderId}/complete`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
    return await res.json();
  }
}

// 全局实例
const orderAPI = new OrderAPI();