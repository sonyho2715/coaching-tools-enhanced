import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';

const KeyboardShortcutsHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: ['Ctrl', 'S'], description: 'Lưu dữ liệu hiện tại' },
    { keys: ['Ctrl', 'P'], description: 'In / Xuất file PDF' },
    { keys: ['Ctrl', 'N'], description: 'Tạo khách hàng mới' },
    { keys: ['Ctrl', 'K'], description: 'Tìm kiếm' },
    { keys: ['Ctrl', 'Shift', 'D'], description: 'Chuyển chế độ sáng/tối' },
    { keys: ['/'], description: 'Hiển thị phím tắt' },
    { keys: ['Esc'], description: 'Đóng dialog' }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all z-40 hover-lift no-print"
        title="Phím tắt (Nhấn /)"
        aria-label="Hiển thị phím tắt"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn no-print"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Keyboard className="w-6 h-6" />
                Phím Tắt
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {shortcut.description}
                  </span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, i) => (
                      <React.Fragment key={i}>
                        <kbd className="px-2 py-1 text-xs font-semibold bg-white dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 rounded shadow-sm">
                          {key}
                        </kbd>
                        {i < shortcut.keys.length - 1 && (
                          <span className="text-gray-400 mx-1">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center">
              💡 Nhấn <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs">/</kbd> bất kỳ lúc nào để mở hướng dẫn này
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutsHelp;
