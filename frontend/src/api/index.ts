const BASE_URL = `http://${window.location.hostname}:8000/api/v1`;

export const apiService = {
  fetchHistory: async (user: string) => {
    const res = await fetch(`${BASE_URL}/chat/history/${user}`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },
  
  sendMessage: async (message: string, userId: string) => {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, user_id: userId }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  fetchUsers: async () => {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  fetchTelegramGroups: async () => {
    const res = await fetch(`${BASE_URL}/telegram/groups`);
    if (!res.ok) throw new Error('Failed to fetch telegram groups');
    return res.json();
  },

  fetchTelegramMembers: async (chatId: number) => {
    const res = await fetch(`${BASE_URL}/telegram/groups/${chatId}/members`);
    if (!res.ok) throw new Error('Failed to fetch telegram members');
    return res.json();
  },

  login: async (username: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Login failed');
    return data;
  },

  register: async (username: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Registration failed');
    return data;
  },

  linkTelegram: async (username: string, telegramId: string) => {
    const res = await fetch(`${BASE_URL}/auth/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, telegram_id: telegramId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Linking failed');
    return data;
  },

  fetchEmployees: async () => {
    const res = await fetch(`${BASE_URL}/employees`);
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  updateEmployee: async (username: string, employee: any) => {
    const res = await fetch(`${BASE_URL}/employees/${username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee)
    });
    if (!res.ok) throw new Error('Failed to update employee');
    return res.json();
  },

  updateUser: async (username: string, user: any) => {
    const res = await fetch(`${BASE_URL}/users/${username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },

  deleteUser: async (username: string) => {
    const res = await fetch(`${BASE_URL}/users/${username}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },

  fetchProductionTimes: async () => {
    const res = await fetch(`${BASE_URL}/production-times`);
    if (!res.ok) throw new Error('Failed to fetch production times');
    return res.json();
  },

  updateProductionTime: async (productType: string, minDays: number, maxDays: number) => {
    const res = await fetch(`${BASE_URL}/production-times/${productType}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_type: productType, min_days: minDays, max_days: maxDays })
    });
    if (!res.ok) throw new Error('Failed to update production time');
    return res.json();
  }
};
