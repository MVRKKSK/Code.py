import { useEffect, useState } from 'react';
import { initialUserProgress } from '../data';
import { UserProgress } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, Target, Flame, Calendar, Award, BarChart3, BookOpen } from 'lucide-react';


export function ProgressPage() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const [progress, setProgress] = useState<UserProgress>({
    totalAttempts: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastPracticeDate: '',
    exerciseHistory: [],
    testHistory: []
  });
useEffect(() => {
  const fetchProgress = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/progress/getProgress`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();

      setProgress({
      totalAttempts: data.progress.total_attempts,
      correctAnswers: data.progress.correct_answers,
      currentStreak: data.progress.current_streak,
      bestStreak: data.progress.best_streak,
      lastPracticeDate: data.progress.last_practice_date, // ✅ FIX
      testHistory: data.testHistory || [],
      exerciseHistory: data.exerciseHistory || []
    });
    console.log(data)
    } catch (err) {
      console.error('Failed to load progress', err);
    }
  };

  fetchProgress();
}, []);

const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);   // ✅ convert ms → sec
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}m ${seconds}s`;
};


  const accuracy = progress.totalAttempts > 0
    ? Math.round((progress.correctAnswers / progress.totalAttempts) * 100)
    : 0;

  const recentTests = (progress.testHistory || []).slice(0, 5);
  const recentHistory = progress.exerciseHistory.slice(0, 10);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your performance and improvement over time
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Attempts</p>
                <p className="text-3xl">{progress.totalAttempts}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-3xl">{accuracy}%</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl">{progress.currentStreak}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Best Streak</p>
                <p className="text-3xl">{progress.bestStreak}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>
        
        {/* Test History */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2>Recent Tests</h2>
          </div>

          {recentTests.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed tests yet</p>
              <p className="text-sm mt-2">Take your first practice test to see results here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTests.map((test, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={test.score >= 80 ? 'default' : 'secondary'}>
                        {test.score >= 80 ? 'Passed' : 'Needs Improvement'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(test.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Score: </span>
                        <span className="font-medium">{test.score * 10}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Correct: </span>
                        <span className="font-medium">{test.correct_answers}/{test.total_questions}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration: </span>
                        <span className="font-medium">
                          {formatDuration(test.duration)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        test.score >= 80
                          ? 'text-green-600'
                          : test.score >= 50
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {test.score * 10}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2>Recent Questions</h2>
          </div>

          {recentHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No practice history yet</p>
              <p className="text-sm mt-2">Start practicing to see your progress here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentHistory.map((attempt, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={attempt.was_correct ? 'default' : 'secondary'}>
                        {attempt.was_correct ? 'Correct' : 'Incorrect'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Question #{attempt.problem_id}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(attempt.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Similarity: </span>
                        <span className="font-medium">{attempt.similarity_score}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time: </span>
                        <span className="font-medium">
                          {new Date(attempt.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-2xl ${
                        attempt.similarity_score >= 80
                          ? 'text-green-600'
                          : attempt.similarity_score >= 50
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {attempt.similarity_score}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        {/* Performance Insights */}
        {progress.total_attempts > 0 && (
          <Card className="p-6">
            <h2 className="mb-4">Insights</h2>
            <div className="space-y-4">
              {accuracy >= 80 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    🎉 Excellent work! Your accuracy is above 80%. Keep up the great work!
                  </p>
                </div>
              )}
              
              {progress.current_streak >= 3 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-800">
                    🔥 You're on fire! {progress.current_streak} day streak and counting!
                  </p>
                </div>
              )}
              
              {progress.total_attempts >= 10 && accuracy < 50 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 Tip: Take your time to analyze each line of code. Use the execution trace feature to understand how the code runs step by step.
                  </p>
                </div>
              )}
              
              {progress.current_streak === 0 && progress.best_streak > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    📅 Your streak is broken. Practice today to start a new one!
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
