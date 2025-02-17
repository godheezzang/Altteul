// 닫기 버튼, 뒤로가기 버튼

import React from 'react';
import backIcon from '@assets/icon/friend/back.svg';
import exitlineIcon from '@assets/icon/friend/exit_line.svg';

type ModalHeaderProps = {
  showBackButton?: boolean;
  onClose: () => void;
  onBack?: () => void;
};

const ModalHeader = ({
  showBackButton,
  onClose,
  onBack,
}: ModalHeaderProps) => {

  return (
    <>
      {/* 뒤로가기 버튼 */}
      {showBackButton && (
        <button
          onClick={onBack}
          className="absolute top-3 left-3 text-primary-orange hover:opacity-80"
        >
          <img src={backIcon} alt="뒤로가기" className="w-6 h-6" />
        </button>
      )}

      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-primary-orange hover:opacity-80"
      >
        <img src={exitlineIcon} alt="닫기" className="w-6 h-6" />
      </button>
    </>
  );
};

export default ModalHeader;
