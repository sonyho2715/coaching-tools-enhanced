import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const ProgressIndicator = ({ sections, currentSection, onSectionClick }) => {
  const calculateProgress = () => {
    const completed = sections.filter(s => s.completed).length;
    return Math.round((completed / sections.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="fixed top-20 right-4 bg-white shadow-lg rounded-lg border-2 border-gray-200 p-4 w-64 z-40 max-h-[80vh] overflow-y-auto">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Tiến Độ</span>
          <span className="text-lg font-bold text-indigo-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              currentSection === section.id
                ? 'bg-indigo-100 border-2 border-indigo-500'
                : section.completed
                ? 'bg-green-50 border-2 border-green-300 hover:bg-green-100'
                : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              {section.completed ? (
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {section.name}
                </p>
                {section.subtitle && (
                  <p className="text-xs text-gray-500 truncate">{section.subtitle}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
