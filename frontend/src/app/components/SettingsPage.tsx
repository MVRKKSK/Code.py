import { Card } from './ui/card';
import { Button } from './ui/button';
import { Settings as SettingsIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';

const STORAGE_KEY = 'codelens_progress';

export function SettingsPage() {
  const [resetConfirm, setResetConfirm] = useState(false);
  
  const handleResetProgress = () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }
    
    localStorage.removeItem(STORAGE_KEY);
    setResetConfirm(false);
    window.location.reload();
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your Code.py preferences and data
          </p>
        </div>
        
        {/* About Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <h2>About Code.py</h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Code.py is an educational tool designed to help you improve your code reading 
              and comprehension skills through deliberate practice.
            </p>
            <p>
              By predicting code outputs before seeing the results, you train your brain to 
              trace execution paths, understand variable state changes, and develop stronger 
              programming intuition.
            </p>
          </div>
        </Card>
        
        {/* Data Management */}
        <Card className="p-6">
          <h2 className="mb-4">Data Management</h2>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 p-4 border border-border rounded-lg">
              <div className="flex-1">
                <h3 className="text-base mb-2">Reset Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Clear all your practice history, statistics, and streaks. This action cannot be undone.
                </p>
              </div>
              <Button
                variant={resetConfirm ? 'destructive' : 'outline'}
                onClick={handleResetProgress}
                onBlur={() => setTimeout(() => setResetConfirm(false), 200)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {resetConfirm ? 'Click to Confirm' : 'Reset'}
              </Button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💾 Your progress is stored locally in your browser. It will not sync across devices.
              </p>
            </div>
          </div>
        </Card>
        
        {/* How to Use */}
        <Card className="p-6">
          <h2 className="mb-4">How to Use Code.py</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-base">1. Choose an Exercise</h3>
              <p className="text-sm text-muted-foreground">
                Browse available exercises filtered by language, difficulty, and topic tags.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base">2. Read and Predict</h3>
              <p className="text-sm text-muted-foreground">
                Carefully read the code snippet and predict what it will output. Set your confidence level.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base">3. Submit Your Answer</h3>
              <p className="text-sm text-muted-foreground">
                Submit your predicted output and receive instant feedback with a similarity score.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base">4. Learn from Execution Trace</h3>
              <p className="text-sm text-muted-foreground">
                View the step-by-step execution trace to understand how the code runs line by line.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base">5. Track Your Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your accuracy, streaks, and improvement over time in the Progress dashboard.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
