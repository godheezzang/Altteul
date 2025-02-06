// 모달 내 버튼 컴포넌트

import React from "react";

type ButtonProps = {
  onClick?: () => void; // 버튼 클릭 시 동작
  type?: "button" | "submit";
  children: React.ReactNode; // 필수, 버튼에 표시될 텍스트
  backgroundColor?: string;
  fontColor?: string;
  width: string; // 필수
  height: string; // 필수
  fontSize?: string;
};

const Button = ({
  onClick,
  type = "button", // 기본값 = button
  children,
  backgroundColor = "primary-orange",
  fontColor = "gray-01",
  width,
  height,
  fontSize = "22px", // 목업에서 일단 22px라서 22px로 해둠
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`rounded-lg cursor-pointer font-medium px-5 py-2 
        bg-${backgroundColor} text-${fontColor} 
        w-${width} h-${height} text-[${fontSize} font-sans]`}
    >
      {children}
    </button>
  );
};

export default Button;
