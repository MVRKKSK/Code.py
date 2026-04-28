import { useEffect, useState } from 'react';
import { initialUserProgress } from '../data';
import { UserProgress } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, Target, Flame, Calendar, Award, BarChart3 } from 'lucide-react';

const STORAGE_KEY = 'codelens_progress';

export function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress>(initialUserProgress);
  
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProgress(JSON.parse(stored));
    }
  }, []);
  
  const accuracy = progress.totalAttempts > 0
    ? Math.round((progress.correctAnswers / progress.totalAttempts) * 100)
    : 0;
  
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
        
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2>Recent Activity</h2>
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
                      <Badge variant={attempt.wasCorrect ? 'default' : 'secondary'}>
                        {attempt.wasCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Exercise #{attempt.exerciseId}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(attempt.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Similarity: </span>
                        <span className="font-medium">{attempt.similarityScore}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Confidence: </span>
                        <span className="font-medium">{attempt.confidence}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time: </span>
                        <span className="font-medium">
                          {new Date(attempt.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div
                      className={`text-2xl ${
                        attempt.similarityScore >= 80
                          ? 'text-green-600'
                          : attempt.similarityScore >= 50
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {attempt.similarityScore}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        {/* Performance Insights */}
        {progress.totalAttempts > 0 && (
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
              
              {progress.currentStreak >= 3 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-800">
                    🔥 You're on fire! {progress.currentStreak} day streak and counting!
                  </p>
                </div>
              )}
              
              {progress.totalAttempts >= 10 && accuracy < 50 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 Tip: Take your time to analyze each line of code. Use the execution trace feature to understand how the code runs step by step.
                  </p>
                </div>
              )}
              
              {progress.currentStreak === 0 && progress.bestStreak > 0 && (
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
