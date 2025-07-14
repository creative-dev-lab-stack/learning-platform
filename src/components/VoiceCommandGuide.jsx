import React from 'react';

const VoiceCommandGuide = () => {
  const commandCategories = [
    {
      title: "Quick Answers",
      commands: [
        { pattern: '"A"', description: "Select option A" },
        { pattern: '"B"', description: "Select option B" },
        { pattern: '"C"', description: "Select option C" },
        { pattern: '"D"', description: "Select option D" }
      ]
    },
    {
      title: "Structured Responses",
      commands: [
        { pattern: '"I think the answer is A"', description: "" },
        { pattern: '"The correct answer is B"', description: "" },
        { pattern: '"My answer is C"', description: "" },
        { pattern: '"I choose D"', description: "" }
      ]
    },
    {
      title: "Explained Answers",
      commands: [
        { pattern: '"A because..."', description: "" },
        { pattern: '"I think A is correct because..."', description: "" },
        { pattern: '"The answer is B due to..."', description: "" },
        { pattern: '"B is right since..."', description: "" }
      ]
    },
    {
      title: "Control Commands",
      commands: [
        { pattern: '"Repeat"', description: "Replay question" },
        { pattern: '"Repeat question"', description: "" },
        { pattern: '"Play again"', description: "" },
        { pattern: '"Next question"', description: "" }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {commandCategories.map((category, index) => (
        <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-100">
            {category.title}
          </h4>
          <ul className="space-y-2 text-sm">
            {category.commands.map((command, cmdIndex) => (
              <li 
                key={cmdIndex} 
                className={`text-gray-600 ${cmdIndex < category.commands.length - 1 ? 'border-b border-gray-100 pb-2' : ''}`}
              >
                <strong className="text-indigo-600">{command.pattern}</strong>
                {command.description && ` - ${command.description}`}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default VoiceCommandGuide;
