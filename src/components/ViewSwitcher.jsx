import { User, UserCog } from 'lucide-react';

const ViewSwitcher = ({ currentView, onViewChange }) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-full shadow-lg border-2 border-gray-200 p-1 flex gap-1">
      <button
        onClick={() => onViewChange('coach')}
        className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
          currentView === 'coach'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <UserCog className="w-4 h-4" />
        <span>Coach View</span>
      </button>
      <button
        onClick={() => onViewChange('client')}
        className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
          currentView === 'client'
            ? 'bg-purple-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <User className="w-4 h-4" />
        <span>Client View</span>
      </button>
    </div>
  );
};

export default ViewSwitcher;
