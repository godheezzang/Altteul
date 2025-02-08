// focus했을 때 주황 테두리 되도록 해야함

import React from "react";

type InputProps = {
  type: "text" | "password" | "search";
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  width?: string;
  height?: string;
  className?: string;
};

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  width = "23.5rem",
  height = "3rem",
  className = "",
}: InputProps) => {
  return (
    <input
      className={`text-lg font-light text-primary-black bg-primary-white border-2 border-gray-02 rounded-lg px-4 py-2 w-full focus:ring-3 focus:ring-primary-orange focus:outline-none ${className}`.trim()}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      style={{ width, height }}
    />
  );
};

export default Input;
