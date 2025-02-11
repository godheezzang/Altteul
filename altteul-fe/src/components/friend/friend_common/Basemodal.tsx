import React from 'react';
import backIcon from '@assets/icon/friend/back.svg';
import exitlineIcon from '@assets/icon/friend/exit_line.svg';

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showBackButton?: boolean; // 뒤로가기 버튼 표시 여부
  onBack?: () => void; // 뒤로가기 핸들러
};

const BaseModal = ({ isOpen, onClose, children, showBackButton, onBack }: BaseModalProps) => {
  if (!isOpen) return null;

  // 뒤로가기 핸들러 내부 로직 추가

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-primary-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-06 border-2 border-primary-orange rounded-lg w-[90vw] max-w-md h-[90vh] max-h-[80vh] p-4 shadow-lg relative flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 뒤로가기 버튼 */}
        {showBackButton && (
          <button
            onClick={onBack}
            className="absolute top-2 left-2 text-primary-orange hover:opacity-80"
          >
            <img src={backIcon} alt="뒤로가기" className="w-6 h-6" />
          </button>
        )}

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-primary-orange hover:opacity-80"
        >
          <img src={exitlineIcon} alt="닫기" className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
