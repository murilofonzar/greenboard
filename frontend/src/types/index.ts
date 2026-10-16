// Objetos const em vez de enum: o tsconfig usa erasableSyntaxOnly
export const ActivityType = {
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  WORD_SEARCH: "WORD_SEARCH",
} as const;
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const EducationLevel = {
  ENSINO_FUNDAMENTAL: "ENSINO_FUNDAMENTAL",
  ENSINO_MEDIO: "ENSINO_MEDIO",
} as const;
export type EducationLevel = (typeof EducationLevel)[keyof typeof EducationLevel];

export const GradeGroup = {
  ANOS_INICIAIS: "ANOS_INICIAIS",
  ANOS_FINAIS: "ANOS_FINAIS",
  ENSINO_MEDIO: "ENSINO_MEDIO",
} as const;
export type GradeGroup = (typeof GradeGroup)[keyof typeof GradeGroup];

export const Grade = {
  PRIMEIRO_ANO: "PRIMEIRO_ANO",
  SEGUNDO_ANO: "SEGUNDO_ANO",
  TERCEIRO_ANO: "TERCEIRO_ANO",
  QUARTO_ANO: "QUARTO_ANO",
  QUINTO_ANO: "QUINTO_ANO",
  SEXTO_ANO: "SEXTO_ANO",
  SETIMO_ANO: "SETIMO_ANO",
  OITAVO_ANO: "OITAVO_ANO",
  NONO_ANO: "NONO_ANO",
} as const;
export type Grade = (typeof Grade)[keyof typeof Grade];

export const HighSchoolGrade = {
  PRIMEIRO: "PRIMEIRO",
  SEGUNDO: "SEGUNDO",
  TERCEIRO: "TERCEIRO",
} as const;
export type HighSchoolGrade = (typeof HighSchoolGrade)[keyof typeof HighSchoolGrade];

export const Role = {
  PROFESSOR: "PROFESSOR",
  ALUNO: "ALUNO",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  educationLevel?: EducationLevel;
  gradeGroup?: GradeGroup;
  grade?: Grade;
  highSchoolYear?: HighSchoolGrade;
}

export interface Question {
  id: string;
  statement: string;
  options: string[];
  answer?: number;
  imageUrl?: string | null;
  audioUrl?: string | null;
}

export type MediaType = "IMAGE" | "AUDIO";

export interface ActivityMedia {
  id?: string;
  type: MediaType;
  url: string;
  caption?: string | null;
  mimeType?: string | null;
}

export interface MediaUploadResponse {
  url: string;
  type: MediaType;
  mimeType: string;
  size: number;
  originalName: string;
}

export interface WordSearch {
  id: string;
  grid: string[];
  words: string[];
  orientation: string[];
  positions: string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  status: "DRAFT" | "PUBLISHED";
  educationLevel: EducationLevel;
  gradeGroup?: GradeGroup;
  grade?: Grade;
  highSchoolYear?: HighSchoolGrade;
  professorId: string;
  questions?: Question[];
  wordSearch?: WordSearch;
  media?: ActivityMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  studentId: string;
  activityId: string;
  answers?: number[];
  foundWords?: string[];
  score?: number;
  feedback?: string;
  status: "PENDING" | "CORRECTED";
  createdAt: string;
  correctedAt?: string;
}
