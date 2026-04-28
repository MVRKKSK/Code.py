import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockExercises } from '../data';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Code2 } from 'lucide-react';

export function PracticeSelection() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Get unique values
  const languages = ['all', ...Array.from(new Set(mockExercises.map(e => e.language)))];
  const difficulties = ['all', 'easy', 'medium', 'hard'];
  const allTags = Array.from(new Set(mockExercises.flatMap(e => e.tags)));
  
  // Filter exercises
  const filteredExercises = mockExercises.filter(exercise => {
    const languageMatch = selectedLanguage === 'all' || exercise.language === selectedLanguage;
    const difficultyMatch = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => exercise.tags.includes(tag));
    return languageMatch && difficultyMatch && tagMatch;
  });
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  
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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="mb-2">Practice Selection</h1>
          <p className="text-muted-foreground">
            Choose an exercise to test your code reading skills
          </p>
        </div>
        
        {/* Filters */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm">Language</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(diff => (
                      <SelectItem key={diff} value={diff}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm">Topics</label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Exercise List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">
              Available Exercises ({filteredExercises.length})
            </h2>
          </div>
          
          <div className="grid gap-4">
            {filteredExercises.map(exercise => (
              <Card key={exercise.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Code2 className="h-5 w-5 text-primary" />
                      <span className="font-medium">{exercise.language}</span>
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                    
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{exercise.code}</code>
                    </pre>
                    
                    <div className="flex flex-wrap gap-2">
                      {exercise.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button onClick={() => navigate(`/exercise/${exercise.id}`)}>
                    Start
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          {filteredExercises.length === 0 && (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No exercises match your filters</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
