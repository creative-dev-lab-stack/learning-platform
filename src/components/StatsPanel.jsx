import React from 'react';

const StatsPanel = ({ stats, totalQuestions }) => {
  const avgConfidence = stats.responseCount > 0 ? Math.round((stats.totalConfidence / stats.responseCount) * 100) : 0;

  const statItems = [
    { label: "Correct", value: stats.correct },
    { label: "Voice Responses", value: stats.voiceResponses },
    { label: "Avg Confidence", value: `${avgConfidence}%` },
    { label: "Total Questions", value: totalQuestions }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {statItems.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-6 text-center border border-gray-200">
          <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.value}</div>
          <div className="text-gray-600 text-sm font-semibold">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;
