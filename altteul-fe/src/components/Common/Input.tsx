import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

type InputProps = {
  type?: 'text' | 'password' | 'search';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  width?: string;
  height?: string;
  className?: string;
  buttonText?: string;
  onButtonClick?: (e: React.MouseEvent) => void;
  showPasswordToggle?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const DEFAULT_INPUT_STYLE =
  'text-lg font-light text-primary-black bg-primary-white border-2 border-gray-02 rounded-lg px-4 py-2 w-full focus:ring-3 focus:ring-primary-orange focus:outline-none';
const BUTTON_STYLE =
  'ml-2 px-3 py-2 border border-primary-orange text-primary-orange bg-primary-white rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border-2 '; // 호버배경 gray-100이 예뻐서 그냥 둠!

const Input = ({
  type = 'text',
  placeholder = '내용을 입력하세요',
  value,
  onChange,
  name,
  width = '23.5rem',
  height = '3rem',
  className = '',
  buttonText,
  onButtonClick,
  showPasswordToggle = false,
  onKeyDown
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="flex items-center w-full relative">
      <div className="flex-grow" style={{ width: `calc(100% - ${buttonText ? '6rem' : '0rem'})` }}>
        <input
          className={`${className || DEFAULT_INPUT_STYLE} ${showPasswordToggle ? 'pr-12' : ''} w-full h-[${height}]`}
          type={showPasswordToggle ? (isPasswordVisible ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          onKeyDown={onKeyDown}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-03 hover:text-gray-02"
          >
            {isPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {buttonText && onButtonClick && (
        <button type="button" onClick={onButtonClick} className={BUTTON_STYLE}>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Input;
