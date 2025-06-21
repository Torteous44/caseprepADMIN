import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base URL is always the production URL as specified in the requirements
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Create an axios instance with default configs
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Handle unauthorized errors (401)
    if (error.response?.status === 401) {
      // Clear token and redirect to login page
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Auth related API calls
export const authApi = {
  login: async (email: string, password: string) => {
    // Use form data for login as required by the FastAPI backend
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    return axios.post(`${API_BASE_URL}/auth/login`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  
  signup: async (email: string, password: string, full_name: string) => {
    return axios.post(`${API_BASE_URL}/auth/signup`, {
      email,
      password,
      full_name
    });
  },

  refreshToken: async (refreshToken: string) => {
    return axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken
    });
  },
  
  getCurrentUser: async () => {
    return api.get('/users/me');
  },
};

// User management API calls
export const userApi = {
  getUsers: async (params = {}) => {
    return api.get('/users', { params });
  },
  
  updateUser: async (userId: string, userData: any) => {
    return api.patch(`/users/${userId}`, userData);
  },
};

// Lesson related API calls
export const lessonApi = {
  getLessons: async (params = {}) => {
    return api.get('/lessons', { params });
  },
  
  getLessonById: async (id: string) => {
    return api.get(`/lessons/${id}`);
  },
  
  createLesson: async (lessonData: any) => {
    return api.post('/lessons', lessonData);
  },
  
  updateLesson: async (id: string, lessonData: any) => {
    return api.patch(`/lessons/${id}`, lessonData);
  },
  
  deleteLesson: async (id: string) => {
    return api.delete(`/lessons/${id}`);
  },
};

// Interview related API calls
export const interviewApi = {
  createInterview: async (lessonId: string) => {
    return api.post('/interviews', { lesson_id: lessonId });
  },
  
  getInterviews: async (params = {}) => {
    return api.get('/interviews', { params });
  },
  
  getInterviewById: async (id: string) => {
    return api.get(`/interviews/${id}`);
  },
};

// Embedding generation API calls
export const embeddingApi = {
  generateEmbedding: async (text: string) => {
    return api.post('/interviews/embeddings', { text });
  },
  
  generateBatchEmbeddings: async (texts: string[]) => {
    return api.post('/interviews/embeddings/batch', { texts });
  },
};

// Subscription management API calls
export const subscriptionApi = {
  createCheckoutSession: async (plan: string, successUrl: string, cancelUrl: string) => {
    return api.post('/billing/checkout', {
      plan,
      success_url: successUrl,
      cancel_url: cancelUrl
    });
  },
  
  createBillingPortalSession: async (returnUrl: string = "https://app.caseprepared.com/account") => {
    return api.post('/billing/portal', {}, { params: { return_url: returnUrl } });
  },
};

// Template related API calls - using the correct endpoints
export const templateApi = {
  getTemplates: async (params = {}) => {
    return api.get('/templates', { params });
  },
  
  getTemplateById: async (id: string) => {
    return api.get(`/templates/${id}`);
  },
  
  createTemplate: async (templateData: any) => {
    return api.post('/templates', templateData);
  },
  
  updateTemplate: async (id: string, templateData: any) => {
    return api.put(`/templates/${id}`, templateData);
  },
  
  deleteTemplate: async (id: string) => {
    return api.delete(`/templates/${id}`);
  },
}; 