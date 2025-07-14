import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState({ status: 'idle', text: 'Ready to listen' });
  const [transcript, setTranscript] = useState('Say "A", "B", "C", or "D" for your answer, or speak your full response...');
  const [confidence, setConfidence] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const recognitionRef = useRef(null);

  const voicePatterns = {
    answers: {
      'A': [/^a$/i, /answer\s+a/i, /option\s+a/i, /choose\s+a/i, /think.*a/i, /correct.*a/i],
      'B': [/^b$/i, /answer\s+b/i, /option\s+b/i, /choose\s+b/i, /think.*b/i, /correct.*b/i],
      'C': [/^c$/i, /answer\s+c/i, /option\s+c/i, /choose\s+c/i, /think.*c/i, /correct.*c/i],
      'D': [/^d$/i, /answer\s+d/i, /option\s+d/i, /choose\s+d/i, /think.*d/i, /correct.*d/i]
    },
    commands: {
      'repeat': [/repeat/i, /play.*again/i, /again/i, /once.*more/i],
      'next': [/next/i, /continue/i, /move.*on/i]
    }
  };

  const processVoiceResponse = useCallback((transcript, confidence, onAnswerSelect, onCommand) => {
    setVoiceStatus({ status: 'processing', text: 'Processing response...' });
    
    const cleanTranscript = transcript.toLowerCase().trim();
    let recognizedAnswer = null;
    let isCommand = false;

    // Check for answer patterns
    for (const [answer, patterns] of Object.entries(voicePatterns.answers)) {
      if (patterns.some(pattern => pattern.test(cleanTranscript))) {
        recognizedAnswer = answer;
        break;
      }
    }

    // Check for commands
    for (const [command, patterns] of Object.entries(voicePatterns.commands)) {
      if (patterns.some(pattern => pattern.test(cleanTranscript))) {
        onCommand(command);
        isCommand = true;
        break;
      }
    }

    if (recognizedAnswer) {
      onAnswerSelect(recognizedAnswer);
      setVoiceStatus({ status: 'recognized', text: `Recognized: ${recognizedAnswer}` });
    } else if (!isCommand) {
      setVoiceStatus({ status: 'idle', text: 'Response not recognized' });
    }

    setTimeout(() => {
      if (!isCommand) {
        setVoiceStatus({ status: 'idle', text: 'Ready to listen' });
      }
    }, 2000);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus({ status: 'listening', text: 'Listening for your response...' });
        setPermissionDenied(false);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }

          setConfidence(confidence || 0.5);
        }

        setTranscript(finalTranscript || interimTranscript || 'Listening...');
      };

      recognition.onerror = (event) => {
        console.error('Recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setPermissionDenied(true);
          setVoiceStatus({ status: 'idle', text: 'Microphone permission denied' });
        } else {
          setVoiceStatus({ status: 'idle', text: 'Error occurred' });
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (!permissionDenied) {
          setVoiceStatus({ status: 'idle', text: 'Ready to listen' });
        }
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
      setVoiceStatus({ status: 'idle', text: 'Speech recognition not supported' });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = (onAnswerSelect, onCommand) => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (!recognitionRef.current) {
      alert('Speech recognition is not initialized. Please refresh the page.');
      return;
    }

    // Override the result handler to include callbacks
    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          processVoiceResponse(transcript, confidence || 0.8, onAnswerSelect, onCommand);
        } else {
          interimTranscript += transcript;
        }

        setConfidence(confidence || 0.5);
      }

      setTranscript(finalTranscript || interimTranscript || 'Listening...');
    };

    try {
      recognitionRef.current.start();
      setTranscript('Listening...');
      setConfidence(0);
    } catch (error) {
      console.error('Error starting recognition:', error);
      setVoiceStatus({ status: 'idle', text: 'Error starting recognition' });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return {
    isListening,
    voiceStatus,
    transcript,
    confidence,
    speechSupported,
    permissionDenied,
    startListening,
    stopListening
  };
};
