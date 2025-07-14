import React from 'react';

const FeedbackPanel = ({ feedbackData, onNextQuestion, showNextButton }) => {
  if (!feedbackData) return null;

  return (
    <div className={`
      rounded-2xl p-8 mb-8 text-center border-2
      ${feedbackData.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}
    `}>
      <div className="text-5xl mb-4">
        {feedbackData.isCorrect ? '✅' : '❌'}
      </div>
      <div className="text-2xl font-bold mb-3">
        {feedbackData.isCorrect ? 'Correct!' : 'Incorrect'}
      </div>
      <div className="text-gray-600 text-lg leading-relaxed mb-6">
        {feedbackData.explanation}
      </div>
      {showNextButton && (
        <button
          onClick={onNextQuestion}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
        >
          Next Question →
        </button>
      )}
    </div>
  );
};

export default FeedbackPanel;
