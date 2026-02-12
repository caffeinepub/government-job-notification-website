import { useState } from 'react';
import { useDailyQuiz } from '../../hooks/useDailyQuiz';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';

export default function DailyQuizSection() {
  const { quiz } = useDailyQuiz();
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  if (!quiz) {
    return (
      <Card className="kbc-quiz-container">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-white">
            आज का सवाल (Today's Question)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-white/80 text-lg">
            No quiz available at the moment. Check back soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  const options = [
    { key: 'A' as const, text: quiz.optionA },
    { key: 'B' as const, text: quiz.optionB },
    { key: 'C' as const, text: quiz.optionC },
    { key: 'D' as const, text: quiz.optionD },
  ];

  const handleOptionClick = (option: 'A' | 'B' | 'C' | 'D') => {
    if (selectedOption === null) {
      setSelectedOption(option);
    }
  };

  const isCorrect = (option: 'A' | 'B' | 'C' | 'D') => option === quiz.correctAnswer;
  const isSelected = (option: 'A' | 'B' | 'C' | 'D') => option === selectedOption;

  const getOptionClassName = (option: 'A' | 'B' | 'C' | 'D') => {
    const baseClasses = 'kbc-option-button w-full text-left transition-all duration-300';
    
    if (selectedOption === null) {
      return `${baseClasses} hover:scale-105 hover:shadow-lg`;
    }

    // After selection
    if (isSelected(option)) {
      if (isCorrect(option)) {
        return `${baseClasses} kbc-option-correct`;
      } else {
        return `${baseClasses} kbc-option-wrong`;
      }
    }

    // Highlight correct answer if wrong option was selected
    if (selectedOption !== null && isCorrect(option)) {
      return `${baseClasses} kbc-option-correct`;
    }

    return `${baseClasses} opacity-60`;
  };

  return (
    <Card className="kbc-quiz-container">
      <CardHeader>
        <CardTitle className="text-center text-2xl md:text-3xl font-bold text-white mb-2">
          आज का सवाल (Today's Question)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question */}
        <div className="kbc-question-box">
          <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
            {quiz.question}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option) => (
            <Button
              key={option.key}
              onClick={() => handleOptionClick(option.key)}
              disabled={selectedOption !== null}
              className={getOptionClassName(option.key)}
              variant="outline"
              size="lg"
            >
              <div className="flex items-center gap-3 w-full">
                <span className="kbc-option-label">{option.key}:</span>
                <span className="flex-1">{option.text}</span>
                {selectedOption !== null && isSelected(option.key) && (
                  <>
                    {isCorrect(option.key) ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                  </>
                )}
                {selectedOption !== null && !isSelected(option.key) && isCorrect(option.key) && (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Explanation (shown after selection) */}
        {selectedOption !== null && (
          <div className="kbc-explanation-box animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white mb-2 text-lg">Explanation:</h4>
                <p className="text-white/90 leading-relaxed">{quiz.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
