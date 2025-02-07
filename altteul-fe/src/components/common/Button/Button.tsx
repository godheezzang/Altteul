// 모달 내 버튼 컴포넌트

import React from "react";

type ButtonProps = {
  onClick?: () => void; // 버튼 클릭 시 동작
  type?: "button" | "submit";
  children: React.ReactNode; // 필수, 버튼에 표시될 텍스트
  width: string; // 필수
  height: string; // 필수
  className?: string; // 추가적인 클래스 이름
  img?: string;
};

const Button = ({
  onClick,
  type = "button", // 기본값 = button
  children,
  width,
  height,
  className = "bg-primary-orange",
  img,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`rounded-lg cursor-pointer font-medium px-5 py-2 ${className}`}
      style={{ width, height }} // 동적 width, height 적용
    >
      {img && <img src={img} alt="button icon" className="h-5 w-12 inline" />}
      {children}
    </button>
  );
};

export default Button;
