import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { CodeExercise, PracticeTest } from '../types';

interface GenerateTestModalProps {
  onClose: () => void;
}

export function GenerateTestModal({ onClose }: GenerateTestModalProps) {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('Python');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

const handleGenerate = async (e: FormEvent) => {
  e.preventDefault();
  if (!prompt.trim()) return;

  setIsGenerating(true);

  try {
    const res = await fetch(`${BASE_URL}/api/tests/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        prompt,
        language,
        difficulty,
        count: Number(questionCount) // 🔥 IMPORTANT FIX
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      alert("Failed to generate test");
      return;
    }

    // ✅ navigate to REAL test
    navigate(`/test/${data.test_id}`);

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  } finally {
    setIsGenerating(false);
  }
};
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl">Generate Custom Test with AI</h2>
            </div>
            <p className="text-muted-foreground">
              Describe what you want to practice and AI will generate a custom test for you
            </p>
          </div>

          {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a demo version with mock generation. Connect to Supabase and add an AI API key to enable real AI-powered test generation with Claude or GPT.
            </p>
          </div> */}

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">What do you want to practice?</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Python loops and conditionals, JavaScript array methods, recursion problems, object-oriented programming concepts..."
                className="min-h-[120px]"
                required
              />
              <p className="text-xs text-muted-foreground">
                Be specific about topics, concepts, or skills you want to focus on
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={difficulty} onValueChange={(val) => setDifficulty(val as 'easy' | 'medium' | 'hard')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Questions</label>
                <Select
  value={String(questionCount)}
  onValueChange={(value) => setQuestionCount(Number(value))}
>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!prompt.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Test
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="border-t border-border pt-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Example prompts:</strong></p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setPrompt('Python list comprehensions and filtering')}
                >
                  List comprehensions
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setPrompt('JavaScript async/await and promises')}
                >
                  Async programming
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setPrompt('Recursion and base cases')}
                >
                  Recursion
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setPrompt('Object-oriented programming concepts')}
                >
                  OOP concepts
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
