// Template interfaces
export interface QuestionStructure {
  prompt: string;
  context: string;
}

export interface Template {
  id?: string;
  case_type: string;
  lead_type: string;
  difficulty: string;
  company: string;
  industry: string;
  prompt: string;
  structure: {
    [key: string]: QuestionStructure;
  };
  image_url: string;
  version: string;
  title: string;
  description_short: string;
  description_long: string;
  duration: number;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateFilters {
  case_type?: string;
  lead_type?: string;
  difficulty?: string;
  company?: string;
  industry?: string;
  skip?: number;
  limit?: number;
}

// User interfaces
export interface User {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

// Auth interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Error interfaces
export interface ApiError {
  detail: string;
} 