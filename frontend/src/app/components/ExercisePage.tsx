import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { mockExercises, calculateSimilarity, initialUserProgress } from '../data';
import { CodeExercise, UserProgress } from '../types';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Code2, Send, Eye, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

const STORAGE_KEY = 'codelens_progress';

export function ExercisePage() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<CodeExercise | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [confidence, setConfidence] = useState([50]);
  const [submitted, setSubmitted] = useState(false);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [showTrace, setShowTrace] = useState(false);
  
  useEffect(() => {
    const found = mockExercises.find(e => e.id === exerciseId);
    if (found) {
      setExercise(found);
    } else {
      navigate('/practice');
    }
  }, [exerciseId, navigate]);
  
  const handleSubmit = () => {
    if (!exercise || !userAnswer.trim()) return;
    
    const score = calculateSimilarity(userAnswer, exercise.expectedOutput);
    setSimilarityScore(score);
    setSubmitted(true);
    
    // Save to progress
    const stored = localStorage.getItem(STORAGE_KEY);
    const progress: UserProgress = stored ? JSON.parse(stored) : initialUserProgress;
    
    const wasCorrect = score >= 80;
    const today = new Date().toISOString().split('T')[0];
    const lastDate = progress.lastPracticeDate;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    progress.totalAttempts++;
    if (wasCorrect) progress.correctAnswers++;
    
    // Update streak
    if (lastDate === today) {
      // Same day, don't update streak
    } else if (lastDate === yesterday) {
      // Consecutive day
      if (wasCorrect) progress.currentStreak++;
    } else {
      // Streak broken
      progress.currentStreak = wasCorrect ? 1 : 0;
    }
    
    if (progress.currentStreak > progress.bestStreak) {
      progress.bestStreak = progress.currentStreak;
    }
    
    progress.lastPracticeDate = today;
    progress.exerciseHistory.unshift({
      exerciseId: exercise.id,
      userAnswer,
      correctAnswer: exercise.expectedOutput,
      similarityScore: score,
      confidence: confidence[0],
      timestamp: new Date().toISOString(),
      wasCorrect
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  };
  
  const handleReset = () => {
    setUserAnswer('');
    setConfidence([50]);
    setSubmitted(false);
    setSimilarityScore(null);
    setShowTrace(false);
  };
  
  if (!exercise) {
    return null;
  }
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return '';
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/practice')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Practice
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <Code2 className="h-6 w-6 text-primary" />
          <h1>{exercise.language} Exercise</h1>
          <Badge className={getDifficultyColor(exercise.difficulty)}>
            {exercise.difficulty}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {exercise.tags.map(tag => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Code Panel */}
          <Card className="p-6">
            <h3 className="mb-4">Code</h3>
            <div className="bg-muted rounded-lg overflow-hidden">
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm">
                  {exercise.code.split('\n').map((line, i) => (
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
          
          {/* Right: Answer Input */}
          <Card className="p-6">
            <h3 className="mb-4">Your Answer</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm">Predicted Output</label>
                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter what you think this code will output..."
                  className="min-h-[150px] font-mono text-sm bg-input-background"
                  disabled={submitted}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm">Confidence Level</label>
                  <span className="text-sm font-medium">{confidence[0]}%</span>
                </div>
                <Slider
                  value={confidence}
                  onValueChange={setConfidence}
                  max={100}
                  step={1}
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
                    <Button onClick={() => navigate('/practice')} variant="outline" className="flex-1">
                      Try Another
                    </Button>
                    <Button
                      onClick={() => setShowTrace(!showTrace)}
                      variant="secondary"
                      className="flex-1"
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
        
        {/* Feedback Section */}
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
                    {exercise.expectedOutput}
                  </pre>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm mb-2 text-blue-900">Explanation</h4>
                <p className="text-sm text-blue-800">{exercise.explanation}</p>
              </div>
            </div>
          </Card>
        )}
        
        {/* Execution Trace */}
        {showTrace && submitted && (
          <Card className="p-6">
            <h3 className="mb-4">Step-by-Step Execution Trace</h3>
            <div className="space-y-4">
              {exercise.executionTrace.map((step, index) => (
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