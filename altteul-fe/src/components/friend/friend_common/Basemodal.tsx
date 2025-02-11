import React from "react";

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const BaseModal = ({ isOpen, onClose, children }: BaseModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-primary-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-06 border-2 border-primary-orange rounded-lg w-[90vw] max-w-md h-[90vh] max-h-[80vh] p-4 shadow-lg relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-primary-orange hover:opacity-80"
        >
          <img
            src="/src/assets/icon/exit_line.svg"
            alt="닫기"
            className="w-6 h-6"
          />
        </button>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;