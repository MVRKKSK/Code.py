import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router';
// import { practiceTests } from '../data';
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
import { BookOpen, Play } from 'lucide-react';


export function PracticeSelection() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [practiceTests, setPracticeTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPracticeTests = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/problems/practice`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch tests');

        const data = await res.json();
        console.log(data)
        setPracticeTests(data);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeTests();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  const languages = ['all', ...Array.from(new Set(practiceTests.map(t => t.language)))];
  const difficulties = ['all', 'easy', 'medium', 'hard'];
  const allTags = Array.from(new Set(practiceTests.flatMap(t => t.tags)));
  

  const filteredTests = practiceTests.filter(test => {
    const languageMatch = selectedLanguage === 'all' || test.language === selectedLanguage;
    const difficultyMatch = selectedDifficulty === 'all' || test.difficulty === selectedDifficulty;
    const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => test.tags.includes(tag));
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
        <div>
          <h1 className="mb-2">Practice Tests</h1>
          <p className="text-muted-foreground">
            Select a practice test to begin. Each test contains 10-15 questions.
          </p>
        </div>

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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">
              Available Tests ({filteredTests.length})
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTests.map(test => (
              <Card key={test.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{test.title}</h3>
                    </div>
                    <Badge className={getDifficultyColor(test.difficulty)}>
                      {test.difficulty}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Language:</span>
                      <span className="font-medium text-foreground">{test.language}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Questions:</span>
                      <span className="font-medium text-foreground">{test.total_questions}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {test.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {test.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{test.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => navigate(`/test/${test.id}`)}
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Test
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredTests.length === 0 && (
            <Card className="p-12">
              <div className="text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tests match your filters</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
