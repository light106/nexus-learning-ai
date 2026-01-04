export enum Difficulty {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert',
}

export enum Category {
  AI = 'Artificial Intelligence',
  ML = 'Machine Learning',
  DS = 'Data Science',
  Blockchain = 'Blockchain',
  General = 'General Programming',
}

export interface Resource {
  title: string;
  url: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  category: Category;
  difficulty: Difficulty;
  estimatedHours: number;
  keyTopics: string[];
  recommendedResources: Resource[];
}

export interface RoadmapData {
  items: RoadmapItem[];
  totalHours: number;
  summary: string;
}

export interface RoadmapRequest {
  topics: string[];
  startDate: string;
  endDate: string;
  experienceLevel: string;
  hoursPerWeek: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}