import React, { useState } from 'react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import VoiceRecognitionPanel from './components/VoiceRecognitionPanel';
import VoiceCommandGuide from './components/VoiceCommandGuide';
import FeedbackPanel from './components/FeedbackPanel';
import ProgressBar from './components/ProgressBar';
import StatsPanel from './components/StatsPanel';
import { questions } from './data/questions';

const LearningPlatform = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ isCorrect: false, explanation: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [stats, setStats] = useState({
    correct: 0,
    voiceResponses: 0,
    totalConfidence: 0,
    responseCount: 0
  });

  const speechRecognition = useSpeechRecognition();
  const speechSynthesis = useSpeechSynthesis();

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(false);
    
    // Auto-check answer after selection
    setTimeout(() => checkAnswer(answer), 1000);
  };

  const handleVoiceAnswerSelect = (answer) => {
    handleAnswerSelect(answer);
    updateStats(speechRecognition.confidence);
    speechSynthesis.speak(`You selected option ${answer}`);
  };

  const handleVoiceCommand = (command) => {
    switch (command) {
      case 'repeat':
        playQuestion();
        break;
      case 'next':
        if (selectedAnswer) {
          checkAnswer();
        }
        break;
    }
  };

  const playQuestion = () => {
    const currentQ = questions[currentQuestion];
    speechSynthesis.speak(currentQ.text, {
      rate: 0.9,
      pitch: 1.0,
      volume: 0.8,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false)
    });
  };

  const checkAnswer = (answer = selectedAnswer) => {
    const currentQ = questions[currentQuestion];
    const isCorrect = answer === currentQ.correct;
    
    setShowFeedback(true);
    setFeedbackData({
      isCorrect,
      explanation: currentQ.explanation
    });

    if (isCorrect) {
      setStats(prev => ({
        ...prev,
        correct: prev.correct + 1
      }));
    }

    speechSynthesis.speak(isCorrect ? "Correct!" : "Incorrect", {
      rate: 0.9,
      pitch: isCorrect ? 1.2 : 0.8,
      volume: 0.7
    });
  };

  const updateStats = (confidence) => {
    setStats(prev => ({
      ...prev,
      voiceResponses: prev.voiceResponses + 1,
      totalConfidence: prev.totalConfidence + confidence,
      responseCount: prev.responseCount + 1
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleStartListening = () => {
    speechRecognition.startListening(handleVoiceAnswerSelect, handleVoiceCommand);
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <Header />
        
        <div className="p-10">
          <QuestionCard
            question={currentQ}
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            showFeedback={showFeedback}
            onOptionSelect={handleAnswerSelect}
            onPlayQuestion={playQuestion}
            isPlaying={isPlaying}
          />

          <VoiceRecognitionPanel
            isListening={speechRecognition.isListening}
            voiceStatus={speechRecognition.voiceStatus}
            transcript={speechRecognition.transcript}
            confidence={speechRecognition.confidence}
            speechSupported={speechRecognition.speechSupported}
            permissionDenied={speechRecognition.permissionDenied}
            onStartListening={handleStartListening}
            onStopListening={speechRecognition.stopListening}
          />

          <VoiceCommandGuide />

          {showFeedback && (
            <FeedbackPanel
              feedbackData={feedbackData}
              onNextQuestion={nextQuestion}
              showNextButton={currentQuestion < questions.length - 1}
            />
          )}

          <ProgressBar current={currentQuestion} total={questions.length} />

          <StatsPanel stats={stats} totalQuestions={questions.length} />
        </div>
      </div>
    </div>
  );
};

export default LearningPlatform;
