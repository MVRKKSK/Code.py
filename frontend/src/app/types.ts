export interface CodeExercise {
  id: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  code: string;
  expectedOutput: string;
  explanation: string;
  executionTrace: ExecutionStep[];
}

export interface ExecutionStep {
  line: number;
  variables: Record<string, any>;
  output?: string;
  description: string;
}

export interface UserProgress {
  totalAttempts: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  lastPracticeDate: string;
  exerciseHistory: ExerciseAttempt[];
}

export interface ExerciseAttempt {
  exerciseId: string;
  userAnswer: string;
  correctAnswer: string;
  similarityScore: number;
  confidence: number;
  timestamp: string;
  wasCorrect: boolean;
}
