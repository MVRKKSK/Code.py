import { CodeExercise, UserProgress } from './types';

export const mockExercises: CodeExercise[] = [
  {
    id: '1',
    language: 'Python',
    difficulty: 'easy',
    tags: ['variables', 'arithmetic'],
    code: `x = 5
y = 10
z = x + y
print(z)`,
    expectedOutput: '15',
    explanation: 'This code adds two numbers (5 + 10) and prints the result.',
    executionTrace: [
      { line: 1, variables: { x: 5 }, description: 'Initialize x to 5' },
      { line: 2, variables: { x: 5, y: 10 }, description: 'Initialize y to 10' },
      { line: 3, variables: { x: 5, y: 10, z: 15 }, description: 'Calculate z = x + y = 15' },
      { line: 4, variables: { x: 5, y: 10, z: 15 }, output: '15', description: 'Print z' }
    ]
  },
  {
    id: '2',
    language: 'JavaScript',
    difficulty: 'easy',
    tags: ['strings', 'concatenation'],
    code: `let greeting = "Hello";
let name = "World";
let message = greeting + " " + name;
console.log(message);`,
    expectedOutput: 'Hello World',
    explanation: 'This code concatenates two strings with a space between them.',
    executionTrace: [
      { line: 1, variables: { greeting: '"Hello"' }, description: 'Initialize greeting' },
      { line: 2, variables: { greeting: '"Hello"', name: '"World"' }, description: 'Initialize name' },
      { line: 3, variables: { greeting: '"Hello"', name: '"World"', message: '"Hello World"' }, description: 'Concatenate strings' },
      { line: 4, variables: { greeting: '"Hello"', name: '"World"', message: '"Hello World"' }, output: 'Hello World', description: 'Log message' }
    ]
  },
  {
    id: '3',
    language: 'Python',
    difficulty: 'medium',
    tags: ['loops', 'range'],
    code: `for i in range(3):
    print(i * 2)`,
    expectedOutput: '0\n2\n4',
    explanation: 'This loop iterates from 0 to 2 and prints each value multiplied by 2.',
    executionTrace: [
      { line: 1, variables: { i: 0 }, description: 'First iteration, i = 0' },
      { line: 2, variables: { i: 0 }, output: '0', description: 'Print 0 * 2 = 0' },
      { line: 1, variables: { i: 1 }, description: 'Second iteration, i = 1' },
      { line: 2, variables: { i: 1 }, output: '2', description: 'Print 1 * 2 = 2' },
      { line: 1, variables: { i: 2 }, description: 'Third iteration, i = 2' },
      { line: 2, variables: { i: 2 }, output: '4', description: 'Print 2 * 2 = 4' }
    ]
  },
  {
    id: '4',
    language: 'JavaScript',
    difficulty: 'medium',
    tags: ['arrays', 'methods'],
    code: `let nums = [1, 2, 3];
let doubled = nums.map(n => n * 2);
console.log(doubled);`,
    expectedOutput: '[2, 4, 6]',
    explanation: 'This code uses the map method to double each element in an array.',
    executionTrace: [
      { line: 1, variables: { nums: '[1, 2, 3]' }, description: 'Create array nums' },
      { line: 2, variables: { nums: '[1, 2, 3]', doubled: '[2, 4, 6]' }, description: 'Map each element n to n * 2' },
      { line: 3, variables: { nums: '[1, 2, 3]', doubled: '[2, 4, 6]' }, output: '[2, 4, 6]', description: 'Log doubled array' }
    ]
  },
  {
    id: '5',
    language: 'Python',
    difficulty: 'hard',
    tags: ['conditionals', 'logic'],
    code: `x = 7
if x > 5:
    if x < 10:
        print("Between 5 and 10")
    else:
        print("Greater than 10")
else:
    print("5 or less")`,
    expectedOutput: 'Between 5 and 10',
    explanation: 'Nested conditionals check if x is in a specific range.',
    executionTrace: [
      { line: 1, variables: { x: 7 }, description: 'Initialize x to 7' },
      { line: 2, variables: { x: 7 }, description: 'Check if x > 5 (True)' },
      { line: 3, variables: { x: 7 }, description: 'Check if x < 10 (True)' },
      { line: 4, variables: { x: 7 }, output: 'Between 5 and 10', description: 'Print result' }
    ]
  },
  {
    id: '6',
    language: 'JavaScript',
    difficulty: 'hard',
    tags: ['functions', 'recursion'],
    code: `function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
console.log(factorial(4));`,
    expectedOutput: '24',
    explanation: 'Recursive function calculates factorial: 4! = 4 * 3 * 2 * 1 = 24',
    executionTrace: [
      { line: 5, variables: { n: 4 }, description: 'Call factorial(4)' },
      { line: 2, variables: { n: 4 }, description: 'n > 1, continue to recursion' },
      { line: 3, variables: { n: 4 }, description: 'Return 4 * factorial(3)' },
      { line: 3, variables: { n: 3 }, description: 'Return 3 * factorial(2)' },
      { line: 3, variables: { n: 2 }, description: 'Return 2 * factorial(1)' },
      { line: 2, variables: { n: 1 }, description: 'Base case: return 1' },
      { line: 5, variables: {}, output: '24', description: 'Final result: 24' }
    ]
  }
];

export const initialUserProgress: UserProgress = {
  totalAttempts: 0,
  correctAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPracticeDate: '',
  exerciseHistory: []
};

export function calculateSimilarity(userAnswer: string, correctAnswer: string): number {
  const normalize = (str: string) => str.toLowerCase().trim().replace(/\s+/g, ' ');
  const user = normalize(userAnswer);
  const correct = normalize(correctAnswer);
  
  if (user === correct) return 100;
  
  // Levenshtein distance for similarity
  const len1 = user.length;
  const len2 = correct.length;
  const matrix: number[][] = [];
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (user.charAt(i - 1) === correct.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  const similarity = ((maxLen - distance) / maxLen) * 100;
  
  return Math.max(0, Math.round(similarity));
}
