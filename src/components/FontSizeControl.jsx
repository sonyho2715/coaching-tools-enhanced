import React from 'react';
import { Type, Plus, Minus, RotateCcw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const FontSizeControl = () => {
  const [fontSize, setFontSize] = useLocalStorage('coaching_font_size', 'medium');

  const fontSizes = {
    small: { label: 'Nhỏ', value: '14px', class: 'text-sm' },
    medium: { label: 'Trung bình', value: '16px', class: 'text-base' },
    large: { label: 'Lớn', value: '18px', class: 'text-lg' },
    xlarge: { label: 'Rất lớn', value: '20px', class: 'text-xl' }
  };

  const increaseFontSize = () => {
    const sizes = Object.keys(fontSizes);
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      const newSize = sizes[currentIndex + 1];
      setFontSize(newSize);
      applyFontSize(newSize);
    }
  };

  const decreaseFontSize = () => {
    const sizes = Object.keys(fontSizes);
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      const newSize = sizes[currentIndex - 1];
      setFontSize(newSize);
      applyFontSize(newSize);
    }
  };

  const resetFontSize = () => {
    setFontSize('medium');
    applyFontSize('medium');
  };

  const applyFontSize = (size) => {
    const root = document.documentElement;
    root.style.setProperty('--base-font-size', fontSizes[size].value);

    // Update body font size
    document.body.style.fontSize = fontSizes[size].value;
  };

  // Apply font size on mount
  React.useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  const sizes = Object.keys(fontSizes);
  const currentIndex = sizes.indexOf(fontSize);
  const canIncrease = currentIndex < sizes.length - 1;
  const canDecrease = currentIndex > 0;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-800">Kích thước chữ</span>
        </div>
        <button
          onClick={resetFontSize}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition"
          title="Đặt lại kích thước mặc định"
        >
          <RotateCcw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={decreaseFontSize}
          disabled={!canDecrease}
          className={`p-2 rounded-lg border-2 transition ${
            canDecrease
              ? 'border-gray-300 hover:bg-gray-100 text-gray-700'
              : 'border-gray-200 text-gray-300 cursor-not-allowed'
          }`}
          title="Giảm kích thước chữ"
        >
          <Minus className="w-5 h-5" />
        </button>

        <div className="flex-1 text-center">
          <div className="text-sm font-medium text-gray-600 mb-1">
            {fontSizes[fontSize].label}
          </div>
          <div className="flex gap-1 justify-center">
            {sizes.map((size, index) => (
              <div
                key={size}
                className={`h-2 w-2 rounded-full transition ${
                  index <= currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={increaseFontSize}
          disabled={!canIncrease}
          className={`p-2 rounded-lg border-2 transition ${
            canIncrease
              ? 'border-gray-300 hover:bg-gray-100 text-gray-700'
              : 'border-gray-200 text-gray-300 cursor-not-allowed'
          }`}
          title="Tăng kích thước chữ"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Quick select buttons */}
      <div className="grid grid-cols-4 gap-2 mt-3">
        {Object.entries(fontSizes).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => {
              setFontSize(key);
              applyFontSize(key);
            }}
            className={`py-1.5 px-2 text-xs rounded-lg border-2 transition ${
              fontSize === key
                ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                : 'border-gray-300 hover:bg-gray-50 text-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Kích thước chữ sẽ được lưu tự động
      </p>
    </div>
  );
};

export default FontSizeControl;
