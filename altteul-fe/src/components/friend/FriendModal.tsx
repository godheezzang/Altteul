import React, { Children } from "react";

type FriendModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const FriendModal = ({ isOpen, onClose, children }: FriendModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="friend-modal-overlay">
      <div className="friend-modal-content">
        <button onClick={onClose} className="close-btn">
          닫기
        </button>
        {children}
      </div>
    </div>
  );
};

export default FriendModal;
