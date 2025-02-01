// 모달 내 버튼 컴포넌트

import React from "react";
import "./Button.css";
import "@/styles/base/colors.css";

type ButtonProps = {
  onClick?: () => void; // 버튼 클릭 시 동작
  type?: "button" | "submit";
  children: React.ReactNode; // 버튼에 표시될 텍스트
  backgroundColor?: string;
  fontColor?: string;
  width: string; // w, h는 목업 확정되면 기본값 추가하겠음!
  height: string;
  fontSize?: string;
  className?: string;
};

const Button = ({
  onClick,
  type = "button", // 기본값 = button
  children,
  backgroundColor = "var(--primary-orange)",
  fontColor = "var(--gray-01)",
  width,
  height,
  fontSize = "22px", // 목업에서 일단 22px라서 22px로 해둠
  className = "",
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      style={{
        backgroundColor,
        color: fontColor,
        width,
        height,
        fontSize,
      }}
      className={`button ${className}`} // className 확장 가능
    >
      {children}
    </button>
  );
};

export default Button;
