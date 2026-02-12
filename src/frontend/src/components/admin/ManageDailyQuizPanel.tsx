import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useDailyQuiz } from '../../hooks/useDailyQuiz';
import { Brain, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageDailyQuizPanel() {
  const { quiz, publish } = useDailyQuiz();
  const [formData, setFormData] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '' as 'A' | 'B' | 'C' | 'D' | '',
    explanation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    if (!formData.optionA.trim() || !formData.optionB.trim() || !formData.optionC.trim() || !formData.optionD.trim()) {
      toast.error('Please fill in all options (A, B, C, D)');
      return;
    }
    if (!formData.correctAnswer) {
      toast.error('Please select the correct answer');
      return;
    }
    if (!formData.explanation.trim()) {
      toast.error('Please provide an explanation');
      return;
    }

    // Publish quiz
    publish({
      question: formData.question.trim(),
      optionA: formData.optionA.trim(),
      optionB: formData.optionB.trim(),
      optionC: formData.optionC.trim(),
      optionD: formData.optionD.trim(),
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation.trim(),
    });

    toast.success('Daily Quiz published successfully!');

    // Reset form
    setFormData({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      explanation: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          📢 Manage Quiz
        </CardTitle>
        <CardDescription>Create and publish today's question for students</CardDescription>
      </CardHeader>
      <CardContent>
        {quiz && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Current quiz published on {new Date(quiz.publishedAt).toLocaleString()}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question">Question Text</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter the quiz question..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="optionA">Option A</Label>
              <Input
                id="optionA"
                value={formData.optionA}
                onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                placeholder="Enter option A"
                required
              />
            </div>
            <div>
              <Label htmlFor="optionB">Option B</Label>
              <Input
                id="optionB"
                value={formData.optionB}
                onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                placeholder="Enter option B"
                required
              />
            </div>
            <div>
              <Label htmlFor="optionC">Option C</Label>
              <Input
                id="optionC"
                value={formData.optionC}
                onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                placeholder="Enter option C"
                required
              />
            </div>
            <div>
              <Label htmlFor="optionD">Option D</Label>
              <Input
                id="optionD"
                value={formData.optionD}
                onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                placeholder="Enter option D"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="correctAnswer">Select Correct Answer (A/B/C/D)</Label>
            <Select
              value={formData.correctAnswer}
              onValueChange={(value) => setFormData({ ...formData, correctAnswer: value as 'A' | 'B' | 'C' | 'D' })}
              required
            >
              <SelectTrigger id="correctAnswer">
                <SelectValue placeholder="Select the correct answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="explanation">Explanation (Why is it correct?)</Label>
            <Textarea
              id="explanation"
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Explain why this is the correct answer..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            PUBLISH QUIZ
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
