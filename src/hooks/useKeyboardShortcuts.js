import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
      const modKey = ctrlKey || metaKey; // Support both Ctrl (Windows/Linux) and Cmd (Mac)

      shortcuts.forEach(({ keys, action, preventDefault = true }) => {
        const matchesModifiers =
          (keys.ctrl === undefined || keys.ctrl === modKey) &&
          (keys.shift === undefined || keys.shift === shiftKey) &&
          (keys.alt === undefined || keys.alt === altKey);

        const matchesKey = keys.key.toLowerCase() === key.toLowerCase();

        if (matchesModifiers && matchesKey) {
          if (preventDefault) {
            event.preventDefault();
          }
          action(event);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Common keyboard shortcuts configuration
export const defaultShortcuts = (handlers) => [
  {
    keys: { ctrl: true, key: 's' },
    action: handlers.save,
    description: 'Lưu dữ liệu'
  },
  {
    keys: { ctrl: true, key: 'p' },
    action: handlers.print,
    description: 'In / Xuất file'
  },
  {
    keys: { ctrl: true, key: 'n' },
    action: handlers.newClient,
    description: 'Khách hàng mới'
  },
  {
    keys: { ctrl: true, key: 'k' },
    action: handlers.search,
    description: 'Tìm kiếm'
  },
  {
    keys: { ctrl: true, shift: true, key: 'd' },
    action: handlers.toggleDark,
    description: 'Chuyển chế độ tối'
  },
  {
    keys: { key: '/' },
    action: handlers.help,
    description: 'Hiển thị trợ giúp',
    preventDefault: true
  }
];
