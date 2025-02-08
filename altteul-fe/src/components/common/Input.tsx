import React from "react";

type InputProps = {
  type?: "text" | "password" | "search";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  width?: string;
  height?: string;
  className?: string;
};

const DEFAULT_INPUT_STYLE =
  "text-lg font-light text-primary-black bg-primary-white border-2 border-gray-02 rounded-lg px-4 py-2 w-full focus:ring-3 focus:ring-primary-orange focus:outline-none";

const Input = ({
  type = "text",
  placeholder = "내용을 입력하세요",
  value,
  onChange,
  name,
  width = "23.5rem",
  height = "3rem",
  className = "",
}: InputProps) => {
  return (
    <input
      className={`${DEFAULT_INPUT_STYLE} w-[${width}] h-[${height}] ${className}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
    />
  );
};

export default Input;
