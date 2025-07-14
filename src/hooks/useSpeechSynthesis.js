import { useRef } from 'react';

export const useSpeechSynthesis = () => {
  const speechSynthesisRef = useRef(window.speechSynthesis);

  const speak = (text, options = {}) => {
    if (speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 0.8;

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;

    speechSynthesisRef.current.speak(utterance);
  };

  const cancel = () => {
    if (speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
    }
  };

  return { speak, cancel };
};
