import React from "react";
import "./Input.css";

type InputProps = {
  type: "text" | "password" | "search";
  placeholder: string;
  value: string;
  onChange: () => void;
  name: string;
  width?: string;
  height?: string; // 여기도 목업 확정될때까지 props로 크기 변경할 수 있게 해둘게게
  className?: string;
};

const Input = ({
  type,
  placeholder,
  value,
  onChange,
  name,
  width = "500px",
  height = "70px",
  className = "",
}: InputProps) => {
  return (
    <input
      className={`input ${className}`.trim()} // .trim() : className이 비어 있어도 공백이 남지 않도록
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
