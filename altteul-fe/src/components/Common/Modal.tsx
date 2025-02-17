import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode; // 내용
  width?: string;
  height?: string;
  className?: string;
  titleColor?: string;
  onReset?: () => void;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = '28rem',
  height = '34.5rem',
  className = '',
  titleColor = '',
  onReset,
}: ModalProps) => {
  if (!isOpen) return null; // isOpen이 false이면 모달을 렌더링하지 않음

  const handleClose = () => {
    onClose();
    onReset && onReset();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-55 flex justify-center items-center z-50"
      onClick={handleClose}
    >
      <div
        className={`flex flex-col items-center text-primary-black rounded-2xl p-5 overflow-auto ${className}`.trim()}
        onClick={e => e.stopPropagation()}
        style={{ width, height }}
      >
        {title && (
          <h2 className={`text-xxl font-bold text-center mt-4 text-${titleColor}`}>{title}</h2>
        )}
        <div className="flex flex-col items-center gap-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
