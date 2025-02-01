// 모달의 기본 컴포넌트

import React from "react";
import "./Modal.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode; // 내용
  width?: string; // 기본: 560px - 회원가입 목업 기준
  height?: string; // 기본:600px - 회원가입 목업 기준
  className?: string;
};

const Modal = ({
  isOpen, // 모달이 열렸는지
  onClose,
  title,
  children, // 모달 내부에 표시할 내용
  width = "560px",
  height = "600px",
  className = "",
}: ModalProps) => {
  if (!isOpen) return null; // isOpen이 false이면 모달을 렌더링하지 않음음

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className={`modal-content ${className}`.trim()}
        onMouseDown={(e) => e.stopPropagation()} // 내부 클릭시 닫히지 않도록
        style={{ width, height }}
      >
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
