import React, { Children } from "react";
import Button from "@components/Common/Button/Button";

type FriendModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const FriendModal = ({ isOpen, onClose, children }: FriendModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative w-[90vw] max-w-md h-[90vh] max-h-[876px] bg-[#FFEBE0] rounded-lg border-2 border-primary-orange shadow-lg">
        <button onClick={onClose} className="close-btn">
          닫기
        </button>
        {children}
      </div>
    </div>
  );
};

export default FriendModal;
