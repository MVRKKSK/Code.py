import { CodeExercise, UserProgress, PracticeTest } from './types';

const allExercises: CodeExercise[] = [
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
  },
  {
    id: '7',
    language: 'Python',
    difficulty: 'easy',
    tags: ['strings', 'methods'],
    code: `text = "hello"
result = text.upper()
print(result)`,
    expectedOutput: 'HELLO',
    explanation: 'The upper() method converts all characters in a string to uppercase.',
    executionTrace: [
      { line: 1, variables: { text: '"hello"' }, description: 'Initialize text' },
      { line: 2, variables: { text: '"hello"', result: '"HELLO"' }, description: 'Convert to uppercase' },
      { line: 3, variables: { text: '"hello"', result: '"HELLO"' }, output: 'HELLO', description: 'Print result' }
    ]
  },
  {
    id: '8',
    language: 'Python',
    difficulty: 'medium',
    tags: ['lists', 'comprehension'],
    code: `nums = [1, 2, 3, 4]
evens = [n for n in nums if n % 2 == 0]
print(evens)`,
    expectedOutput: '[2, 4]',
    explanation: 'List comprehension filters even numbers from the list.',
    executionTrace: [
      { line: 1, variables: { nums: '[1, 2, 3, 4]' }, description: 'Create list' },
      { line: 2, variables: { nums: '[1, 2, 3, 4]', evens: '[2, 4]' }, description: 'Filter even numbers' },
      { line: 3, variables: { nums: '[1, 2, 3, 4]', evens: '[2, 4]' }, output: '[2, 4]', description: 'Print evens' }
    ]
  },
  {
    id: '9',
    language: 'JavaScript',
    difficulty: 'medium',
    tags: ['objects', 'destructuring'],
    code: `const person = { name: "Alice", age: 25 };
const { name, age } = person;
console.log(name, age);`,
    expectedOutput: 'Alice 25',
    explanation: 'Destructuring extracts properties from an object into variables.',
    executionTrace: [
      { line: 1, variables: { person: '{name: "Alice", age: 25}' }, description: 'Create object' },
      { line: 2, variables: { person: '{name: "Alice", age: 25}', name: '"Alice"', age: 25 }, description: 'Destructure object' },
      { line: 3, variables: { person: '{name: "Alice", age: 25}', name: '"Alice"', age: 25 }, output: 'Alice 25', description: 'Log values' }
    ]
  },
  {
    id: '10',
    language: 'Python',
    difficulty: 'easy',
    tags: ['boolean', 'logic'],
    code: `a = True
b = False
print(a and b)
print(a or b)`,
    expectedOutput: 'False\nTrue',
    explanation: 'Boolean AND returns False if any value is False, OR returns True if any value is True.',
    executionTrace: [
      { line: 1, variables: { a: true }, description: 'Set a to True' },
      { line: 2, variables: { a: true, b: false }, description: 'Set b to False' },
      { line: 3, variables: { a: true, b: false }, output: 'False', description: 'True AND False = False' },
      { line: 4, variables: { a: true, b: false }, output: 'True', description: 'True OR False = True' }
    ]
  },
  {
    id: '11',
    language: 'JavaScript',
    difficulty: 'hard',
    tags: ['closures', 'functions'],
    code: `function counter() {
    let count = 0;
    return function() {
        return ++count;
    };
}
const c = counter();
console.log(c());
console.log(c());`,
    expectedOutput: '1\n2',
    explanation: 'Closure captures the count variable, maintaining state between calls.',
    executionTrace: [
      { line: 7, variables: { c: 'function' }, description: 'Create counter' },
      { line: 8, variables: { count: 1 }, output: '1', description: 'First call increments count to 1' },
      { line: 9, variables: { count: 2 }, output: '2', description: 'Second call increments count to 2' }
    ]
  },
  {
    id: '12',
    language: 'Python',
    difficulty: 'medium',
    tags: ['dictionaries', 'methods'],
    code: `data = {'a': 1, 'b': 2}
print(data.get('c', 0))
print(data.get('a'))`,
    expectedOutput: '0\n1',
    explanation: 'The get() method returns the value for a key, or a default if the key does not exist.',
    executionTrace: [
      { line: 1, variables: { data: "{'a': 1, 'b': 2}" }, description: 'Create dictionary' },
      { line: 2, variables: { data: "{'a': 1, 'b': 2}" }, output: '0', description: 'Key c not found, return default 0' },
      { line: 3, variables: { data: "{'a': 1, 'b': 2}" }, output: '1', description: 'Key a exists, return 1' }
    ]
  },
  {
    id: '13',
    language: 'JavaScript',
    difficulty: 'easy',
    tags: ['arrays', 'length'],
    code: `let arr = [10, 20, 30];
console.log(arr.length);
arr.push(40);
console.log(arr.length);`,
    expectedOutput: '3\n4',
    explanation: 'Array length property returns the number of elements. Push adds an element.',
    executionTrace: [
      { line: 1, variables: { arr: '[10, 20, 30]' }, description: 'Create array' },
      { line: 2, variables: { arr: '[10, 20, 30]' }, output: '3', description: 'Array has 3 elements' },
      { line: 3, variables: { arr: '[10, 20, 30, 40]' }, description: 'Add 40 to array' },
      { line: 4, variables: { arr: '[10, 20, 30, 40]' }, output: '4', description: 'Array now has 4 elements' }
    ]
  },
  {
    id: '14',
    language: 'Python',
    difficulty: 'hard',
    tags: ['generators', 'yield'],
    code: `def gen():
    yield 1
    yield 2
    yield 3

for i in gen():
    print(i)`,
    expectedOutput: '1\n2\n3',
    explanation: 'Generators use yield to produce values one at a time without storing the entire sequence.',
    executionTrace: [
      { line: 6, variables: {}, description: 'Start iteration' },
      { line: 2, variables: { i: 1 }, output: '1', description: 'First yield returns 1' },
      { line: 3, variables: { i: 2 }, output: '2', description: 'Second yield returns 2' },
      { line: 4, variables: { i: 3 }, output: '3', description: 'Third yield returns 3' }
    ]
  },
  {
    id: '15',
    language: 'JavaScript',
    difficulty: 'medium',
    tags: ['spread', 'arrays'],
    code: `let a = [1, 2];
let b = [3, 4];
let c = [...a, ...b];
console.log(c);`,
    expectedOutput: '[1, 2, 3, 4]',
    explanation: 'Spread operator (...) expands arrays into individual elements, combining them.',
    executionTrace: [
      { line: 1, variables: { a: '[1, 2]' }, description: 'Create array a' },
      { line: 2, variables: { a: '[1, 2]', b: '[3, 4]' }, description: 'Create array b' },
      { line: 3, variables: { a: '[1, 2]', b: '[3, 4]', c: '[1, 2, 3, 4]' }, description: 'Spread both arrays into c' },
      { line: 4, variables: { a: '[1, 2]', b: '[3, 4]', c: '[1, 2, 3, 4]' }, output: '[1, 2, 3, 4]', description: 'Log combined array' }
    ]
  }
];

export const practiceTests: PracticeTest[] = [
  {
    id: 'test-1',
    title: 'Practice Test 1',
    language: 'Python',
    difficulty: 'easy',
    tags: ['variables', 'arithmetic', 'strings'],
    totalQuestions: 10,
    questions: allExercises.slice(0, 10).map((ex, idx) => ({ ...ex, id: `test1-q${idx + 1}` }))
  },
  {
    id: 'test-2',
    title: 'Practice Test 2',
    language: 'JavaScript',
    difficulty: 'easy',
    tags: ['arrays', 'strings', 'functions'],
    totalQuestions: 10,
    questions: allExercises.slice(0, 10).map((ex, idx) => ({
      ...ex,
      id: `test2-q${idx + 1}`,
      language: 'JavaScript'
    }))
  },
  {
    id: 'test-3',
    title: 'Practice Test 3',
    language: 'Python',
    difficulty: 'medium',
    tags: ['loops', 'conditionals', 'logic'],
    totalQuestions: 12,
    questions: allExercises.slice(0, 12).map((ex, idx) => ({
      ...ex,
      id: `test3-q${idx + 1}`,
      difficulty: 'medium' as const
    }))
  },
  {
    id: 'test-4',
    title: 'Practice Test 4',
    language: 'JavaScript',
    difficulty: 'medium',
    tags: ['functions', 'arrays', 'objects'],
    totalQuestions: 12,
    questions: allExercises.slice(0, 12).map((ex, idx) => ({
      ...ex,
      id: `test4-q${idx + 1}`,
      language: 'JavaScript',
      difficulty: 'medium' as const
    }))
  },
  {
    id: 'test-5',
    title: 'Practice Test 5',
    language: 'Python',
    difficulty: 'hard',
    tags: ['recursion', 'algorithms', 'data structures'],
    totalQuestions: 15,
    questions: allExercises.slice(0, 15).map((ex, idx) => ({
      ...ex,
      id: `test5-q${idx + 1}`,
      difficulty: 'hard' as const
    }))
  },
  {
    id: 'test-6',
    title: 'Practice Test 6',
    language: 'JavaScript',
    difficulty: 'hard',
    tags: ['recursion', 'closures', 'async'],
    totalQuestions: 15,
    questions: allExercises.slice(0, 15).map((ex, idx) => ({
      ...ex,
      id: `test6-q${idx + 1}`,
      language: 'JavaScript',
      difficulty: 'hard' as const
    }))
  }
];

export const initialUserProgress: UserProgress = {
  totalAttempts: 0,
  correctAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPracticeDate: '',
  exerciseHistory: [],
  testHistory: []
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

  if (maxLen === 0) return 100; 

  const similarity = ((maxLen - distance) / maxLen) * 100;
  
  return Math.max(0, Math.round(similarity));
}
