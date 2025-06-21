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

// Lesson interfaces
export interface ExpectedComponent {
  id: string;
  description: string;
}

export interface Question {
  text: string;
  expected_components: ExpectedComponent[];
}

export interface Phase {
  type: string;
  content?: string;
  questions?: Question[];
}

export interface LessonBody {
  phases: Phase[];
  voice_id: string;
}

export interface Lesson {
  id: string;
  title: string;
  difficulty: string;
  company: string;
  body: LessonBody;
  created_at?: string;
  image_url: string;
  short_description: string;
  long_description: string;
}

export interface LessonFilters {
  skip?: number;
  limit?: number;
}

// User interfaces
export interface User {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  subscription_status?: string;
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
  refresh_token: string;
  token_type: string;
}

// Interview interfaces
export interface Interview {
  id: string;
  user_id: string;
  lesson_id: string;
  status: string;
  started_at: string;
  ended_at?: string;
  duration_sec?: number;
  overall_score?: any;
  turns?: any[];
}

// Error interfaces
export interface ApiError {
  detail: string;
} 