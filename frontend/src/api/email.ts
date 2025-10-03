import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const emailAPI = {
  getEmails: async (page: number = 1, limit: number = 20) => {
    const response = await api.get(`/email?page=${page}&limit=${limit}`);
    return response.data;
  },

  sendEmail: async (recipient: string, subject: string, body: string) => {
    const response = await api.post('/email/send', {
      recipient,
      subject,
      body
    });
    return response.data;
  },

  calculateSpamScore: async (subject: string, body: string) => {
    const response = await api.post('/email/score', {
      subject,
      body
    });
    return response.data;
  },

  refineEmail: async (subject: string, body: string) => {
    const response = await api.post('/email/refine', {
      subject,
      body
    });
    return response.data;
  },

  getEmailStats: async () => {
    const response = await api.get('/email/stats');
    return response.data;
  }
};
