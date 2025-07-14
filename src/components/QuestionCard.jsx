import React from 'react';

const QuestionCard = ({ 
  question, 
  currentQuestion, 
  totalQuestions, 
  selectedAnswer, 
  showFeedback, 
  onOptionSelect, 
  onPlayQuestion, 
  isPlaying 
}) => {
  return (
    <div className="bg-slate-50 rounded-2xl p-8 mb-8 border-l-4 border-indigo-600">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold">
          Question {currentQuestion + 1} of {totalQuestions}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onPlayQuestion}
            disabled={isPlaying}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isPlaying ? '🔊 Playing...' : '🔊 Play Question'}
          </button>
          <button
            onClick={onPlayQuestion}
            disabled={isPlaying}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
          >
            🔄 Repeat
          </button>
        </div>
      </div>
      
      <div className="text-2xl leading-relaxed text-gray-700 mb-8">
        {question.text}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {question.options.map((option, index) => {
          const letter = String.fromCharCode(65 + index);
          const isSelected = selectedAnswer === letter;
          const isCorrect = showFeedback && letter === question.correct;
          const isIncorrect = showFeedback && isSelected && letter !== question.correct;
          
          return (
            <div
              key={letter}
              onClick={() => onOptionSelect(letter)}
              className={`
                bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-0.5
                ${isSelected ? 'border-indigo-600 bg-blue-50' : 'border-gray-200'}
                ${isCorrect ? 'border-green-500 bg-green-50' : ''}
                ${isIncorrect ? 'border-red-500 bg-red-50' : ''}
                hover:border-indigo-600 hover:shadow-lg
              `}
            >
              <div className="font-bold text-indigo-600 text-xl mb-2">{letter})</div>
              <div className="text-gray-600 leading-relaxed">{option}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
