import Header from '@components/Modal/FriendChat/Shared/Header';
import React from 'react';

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
};

const BaseModal = ({ isOpen, onClose, children, showBackButton, onBack }: BaseModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed right-4 bottom-4 flex  bg-primary-black bg-opacity-50 z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-gray-06 border-2 border-primary-orange rounded-lg w-[90vw] max-w-md h-[90vh] max-h-[80vh] p-4 shadow-lg relative flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <Header showBackButton={true} onClose={onClose} />
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
