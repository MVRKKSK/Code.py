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

export interface PracticeTest {
  id: string;
  title: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  questions: CodeExercise[];
  totalQuestions: number;
}

export interface UserProgress {
  totalAttempts: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  lastPracticeDate: string;
  exerciseHistory: ExerciseAttempt[];
  testHistory: TestAttempt[];
}

export interface ExerciseAttempt {
  exerciseId: string;
  userAnswer: string;
  correctAnswer: string;
  similarityScore: number;
  timestamp: string;
  wasCorrect: boolean;
}

export interface TestAttempt {
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timestamp: string;
  duration: number;
}
