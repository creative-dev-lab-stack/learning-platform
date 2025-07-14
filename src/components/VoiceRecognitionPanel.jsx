import React from 'react';

const WaveBar = ({ active, delay }) => (
  <div 
    className={`w-1 h-2 bg-green-600 mx-0.5 rounded transition-all duration-100 ${
      active ? 'animate-pulse' : ''
    }`}
    style={{ 
      animationDelay: `${delay}ms`,
      transform: active ? 'scaleY(3)' : 'scaleY(1)'
    }}
  />
);

const VoiceRecognitionPanel = ({ 
  isListening, 
  voiceStatus, 
  transcript, 
  confidence, 
  speechSupported, 
  permissionDenied, 
  onStartListening, 
  onStopListening 
}) => {
  return (
    <div className="bg-slate-100 rounded-2xl p-8 mb-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">Voice Response System</h3>
        <div className={`
          flex items-center gap-3 px-5 py-3 rounded-full font-semibold transition-all duration-300
          ${voiceStatus.status === 'idle' ? 'bg-gray-200 text-gray-600' : ''}
          ${voiceStatus.status === 'listening' ? 'bg-yellow-200 text-yellow-700 animate-pulse' : ''}
          ${voiceStatus.status === 'processing' ? 'bg-blue-200 text-blue-700' : ''}
          ${voiceStatus.status === 'recognized' ? 'bg-green-200 text-green-700' : ''}
        `}>
          <span>🎤</span>
          <span>{voiceStatus.text}</span>
        </div>
      </div>

      {!speechSupported && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Speech recognition not supported!</strong> Please use Chrome, Edge, or Safari browsers.
        </div>
      )}

      {permissionDenied && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Microphone permission denied!</strong> Please allow microphone access and refresh the page.
        </div>
      )}

      <div className="flex gap-4 justify-center mb-8">
        <button
          onClick={onStartListening}
          disabled={!speechSupported || isListening || permissionDenied}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          🎤 Start Voice Response
        </button>
        <button
          onClick={onStopListening}
          disabled={!isListening}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          ⏹️ Stop Listening
        </button>
      </div>

      {/* Waveform */}
      <div className="flex items-center justify-center h-10 mb-8">
        {Array.from({ length: 30 }, (_, i) => (
          <WaveBar key={i} active={isListening} delay={i * 50} />
        ))}
      </div>

      {/* Transcript */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
        <div className="text-gray-700 text-lg leading-relaxed min-h-6">
          {transcript}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-gray-600">Confidence:</span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.round(confidence * 100)}%` }}
            />
          </div>
          <span className="text-gray-600 font-semibold">{Math.round(confidence * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecognitionPanel;