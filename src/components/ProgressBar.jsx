import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;
  
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
      <div 
        className="h-full bg-gradient-to-r from-indigo-600 to-purple-700 transition-all duration-500 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
