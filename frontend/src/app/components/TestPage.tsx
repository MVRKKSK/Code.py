import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { practiceTests, calculateSimilarity, initialUserProgress } from '../data';
import { PracticeTest, CodeExercise } from '../types';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Code2, Send, Eye, ArrowLeft, ArrowRight, CheckCircle2, XCircle, Trophy } from 'lucide-react';

const STORAGE_KEY = 'codelens_progress';

interface QuestionResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  similarityScore: number;
  wasCorrect: boolean;
}

export function TestPage() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState<PracticeTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [showTrace, setShowTrace] = useState(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [answers, setAnswers] = useState<{ questionId: string; isCorrect: boolean }[]>([]);
  const [finalStats, setFinalStats] = useState({
  score: 0,
  correct: 0,
  incorrect: 0
});

useEffect(() => {
  const fetchTest = async () => {
    const res = await fetch(`${BASE_URL}/api/problems/tests/${testId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    const data = await res.json();

    const formatted = {
      ...data,
      questions: data.questions.map((q: any) => ({
        id: q.id,
        language: q.language,
        difficulty: q.difficulty,
        tags: q.tags,
        code: q.code,
        expectedOutput: q.expected_output,
        explanation: q.explanation,
        executionTrace: q.execution_trace
      }))
    };

    setTest(formatted);
  };

  fetchTest();
}, [testId]); // ✅ FIXED

  const currentQuestion = test?.questions[currentQuestionIndex];

const handleSubmit = () => {
  if (!currentQuestion || !userAnswer.trim()) return;

  const score = calculateSimilarity(userAnswer, currentQuestion.expectedOutput);
  setSimilarityScore(score);
  setSubmitted(true);

  const wasCorrect = score >= 80;

  const result: QuestionResult = {
    questionId: currentQuestion.id,
    userAnswer,
    correctAnswer: currentQuestion.expectedOutput,
    similarityScore: score,
    wasCorrect
  };

  setResults(prev => [...prev, result]);
};

const handleNext = async () => {
  if (!test) return;

  const currentQ = test.questions[currentQuestionIndex];

  // 🔥 1. Evaluate answer
  const similarity = calculateSimilarity(userAnswer, currentQ.expectedOutput);
  const isCorrect = similarity >= 80;

  // optional: store similarity in UI
  setSimilarityScore(similarity);

  try {
    // 🔥 2. Send to backend (exercise history + progress)
    await fetch(`${BASE_URL}/api/progress/exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
      problem_id: currentQ.id,
      was_correct: isCorrect,
      similarity_score: similarity,
      code: userAnswer,
      language: currentQ.language
    })
    });
  } catch (err) {
    console.error('Progress update failed', err);
  }

  // 🔥 3. Store locally for test result
  setAnswers(prev => [
    ...prev,
    { questionId: currentQ.id, isCorrect }
  ]);

  // 🔥 4. Move to next question or complete test
  if (currentQuestionIndex < test.questions.length - 1) {
    setCurrentQuestionIndex(prev => prev + 1);
    setUserAnswer('');
    setSubmitted(false);
    setSimilarityScore(null);
    setShowTrace(false);
  } else {
    completeTest(); // will handle test_history
  }
};

const completeTest = async () => {
  if (!test) return;

  // 🔥 1. Calculate stats
  const total = test.questions.length;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const incorrectCount = total - correctCount;

  const score = total > 0
    ? Math.round((correctCount / total) * 100)
    : 0;

  // 👉 OPTIONAL: store in state if you want to show later
  setFinalStats({
    score,
    correct: correctCount,
    incorrect: incorrectCount
  });

  try {
    await fetch(`${BASE_URL}/api/progress/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        test_id: test.id,
        score: correctCount,
        correct_answers: correctCount,
        total_questions: total,
        duration: Date.now() - startTime
      })
    });

  } catch (err) {
    console.error('Test save failed', err);
  }

  setTestCompleted(true);
};

  if (!test || !currentQuestion) {
    return null;
  }

  if (testCompleted) {
    const correctCount = results.filter(r => r.wasCorrect).length;
    const scorePercentage = Math.round((correctCount / test.total_questions) * 100);

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
            </div>

            <div>
              <h1 className="mb-2">Test Complete!</h1>
              <p className="text-muted-foreground">{test.title}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-3xl font-bold text-primary">{finalStats.score}%</div>
                <div className="text-sm text-muted-foreground mt-1">Score</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">{finalStats.correct}</div>
                <div className="text-sm text-muted-foreground mt-1">Correct</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-3xl font-bold text-red-600">{finalStats.incorrect}</div>
                <div className="text-sm text-muted-foreground mt-1">Incorrect</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {result.wasCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="text-sm">Question {idx + 1}</span>
                  </div>
                  <span className="text-sm font-medium">{result.similarityScore}%</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => navigate('/practice')} className="flex-1">
                Back to Tests
              </Button>
              <Button onClick={() => navigate('/progress')} variant="outline" className="flex-1">
                View Progress
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return '';
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / test.total_questions) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/practice')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Test
          </Button>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {test.total_questions}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h1>{test.title}</h1>
            <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
              {currentQuestion.difficulty}
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="mb-4">Code</h3>
            <div className="bg-muted rounded-lg overflow-hidden">
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm">
                  {currentQuestion.code.split('\n').map((line, i) => (
                    <div key={i} className="flex">
                      <span className="inline-block w-8 text-muted-foreground select-none">
                        {i + 1}
                      </span>
                      <span>{line}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Your Answer</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm">Predicted Output</label>
                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter what you think this code will output..."
                  className="min-h-[200px] font-mono text-sm bg-input-background"
                  disabled={submitted}
                />
              </div>

              <div className="flex gap-3">
                {!submitted ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!userAnswer.trim()}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Answer
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleNext}
                      className="flex-1"
                    >
                      {currentQuestionIndex < test.questions.length - 1 ? (
                        <>
                          Next Question
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        'Complete Test'
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowTrace(!showTrace)}
                      variant="secondary"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {showTrace ? 'Hide' : 'Show'} Trace
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>

        {submitted && similarityScore !== null && (
          <Card className="p-6">
            <h3 className="mb-4">Feedback</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Similarity Score</span>
                  <div className="flex items-center gap-2">
                    {similarityScore >= 80 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-semibold">{similarityScore}%</span>
                  </div>
                </div>
                <Progress
                  value={similarityScore}
                  className="h-2"
                  indicatorClassName={similarityScore >= 80 ? 'bg-green-600' : 'bg-red-600'}
                />
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Your Answer</label>
                  <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                    {userAnswer}
                  </pre>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Correct Output</label>
                  <pre className="bg-green-50 border border-green-200 p-3 rounded text-sm overflow-x-auto">
                    {currentQuestion.expectedOutput}
                  </pre>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm mb-2 text-blue-900">Explanation</h4>
                <p className="text-sm text-blue-800">{currentQuestion.explanation}</p>
              </div>
            </div>
          </Card>
        )}

        {showTrace && submitted && (
          <Card className="p-6">
            <h3 className="mb-4">Step-by-Step Execution Trace</h3>
            <div className="space-y-4">
              {currentQuestion.executionTrace.map((step, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Line {step.line}</Badge>
                    <span className="text-sm text-muted-foreground">{step.description}</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Variables</label>
                      <div className="bg-muted rounded p-3 space-y-1">
                        {Object.entries(step.variables).map(([key, value]) => (
                          <div key={key} className="text-sm font-mono">
                            <span className="text-primary">{key}</span>
                            <span className="text-muted-foreground"> = </span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {step.output && (
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">Output</label>
                        <div className="bg-green-50 border border-green-200 rounded p-3">
                          <pre className="text-sm font-mono">{step.output}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
