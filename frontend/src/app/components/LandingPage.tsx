import { Link } from 'react-router';
import { Button } from './ui/button';
import { Code2, Target, TrendingUp, Zap } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <Code2 className="h-20 w-20 text-primary" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl">
            Master Code Comprehension
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Read code, predict outputs, and improve your programming intuition through 
            deliberate practice with instant feedback and step-by-step execution traces.
          </p>
          
          <div className="pt-4">
            <Link to="/practice">
              <Button size="lg" className="text-lg px-8 py-6">
                <Target className="h-5 w-5 mr-2" />
                Start Practice
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3>Read & Predict</h3>
              <p className="text-muted-foreground">
                Analyze code snippets and predict their output before execution
              </p>
            </div>
            
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3>Instant Feedback</h3>
              <p className="text-muted-foreground">
                Get similarity scores and detailed explanations for each attempt
              </p>
            </div>
            
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3>Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your accuracy, streaks, and improvement over time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
