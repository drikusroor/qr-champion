import React, { useEffect, useState } from 'react';

type FontSelectorProps = {
  fonts: string[];
  selectedFont: string;
  onFontChange: (font: string) => void;
  label?: string;
  error?: string;
};

const FontSelector: React.FC<FontSelectorProps> = ({ fonts, selectedFont, onFontChange, label = 'Font Style', error }) => {
  const [internalValue, setInternalValue] = useState(selectedFont);

  useEffect(() => {
    if (!internalValue) return;

    const existingLink = document.querySelector(`link[data-font="${internalValue}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${internalValue.replace(/\s+/g, '+')}&display=swap`;
    link.dataset.font = internalValue;
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [internalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onFontChange(newValue);
  };

  return (
    <div className="font-selector">
      <label htmlFor="font-selector" className="mb-1 block">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id="font-selector"
          list="font-options"
          value={internalValue}
          onChange={handleChange}
          className={`p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${error ? 'border-red-500' : ''}`}
          style={{ fontFamily: internalValue || undefined }}
        />
        <datalist id="font-options">
          {fonts.map((font) => (
            <option key={font} value={font} />
          ))}
        </datalist>
      </div>
      {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default FontSelector;