import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base URL is always the production URL as specified in the requirements
const API_BASE_URL = 'http://localhost:8001/api/v1';

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
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    return axios.post(`${API_BASE_URL}/auth/login`, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  
  getCurrentUser: async () => {
    return api.get('/users/me');
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

// Interview related API calls
export const interviewApi = {
  getAdminInterviews: async (params = {}) => {
    return api.get('/interviews', { params });
  },
  
  getInterviewById: async (id: string) => {
    return api.get(`/interviews/${id}`);
  },
  
  updateInterviewStatus: async (id: string, data: any) => {
    return api.patch(`/interviews/${id}`, data);
  },
  
  deleteInterview: async (id: string) => {
    return api.delete(`/interviews/${id}`);
  },
}; 