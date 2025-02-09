import React from "react";
import Modal from "@components/common/Modal";
import SmallButton from "@components/Common/Button/Button";
import useModalStore from "@stores/modalStore";
import { MODAL_TYPES, GAME_TYPES, COMMON_MODAL_TYPES } from "types/modalTypes";
type ResultDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ResultDetailModal = ({ isOpen, onClose }: ResultDetailModalProps) => {
  const { openModal } = useModalStore();

  //TODO: 다음 버튼 클릭시 로직
  const handleContinue = () => {
    onClose();
    openModal(MODAL_TYPES.NAVIGATE, { type: GAME_TYPES.SINGLE });
  };

  //TODO: 코드 확인 버튼 클릭시 로직
  const handleOpponentCode = () => {
    onClose();
    openModal(MODAL_TYPES.COMMON, {
      type: GAME_TYPES.SINGLE,
      modalType: COMMON_MODAL_TYPES.CODE
    });
  };

  //TODO: AI 코칭 버튼 클릭시 로직
  const handleAiCoaching = () => {
    onClose();
    openModal(MODAL_TYPES.COMMON, {
      type: GAME_TYPES.SINGLE,
      modalType: COMMON_MODAL_TYPES.COACHING
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="26rem"
      height="25rem"
      title="게임결과"  //반영이 안되네
      className="bg-primary-black relative overflow-hidden border-2 border-primary-orange shadow-orange"
    >
      <div className="flex flex-col items-center justify-center h-full w-full">

        {/* WIN! text with glow */}
        <div className="mb-2 text-4xl font-bold text-white">게임결과창 만들어야함</div>



        {/* 코드 확인 버튼 */}
        <SmallButton
          onClick={handleOpponentCode}
          backgroundColor="primary-orange"
          className="px-8 py-2 relative"
          children="코드 확인"
        >
        </SmallButton>

        {/* AI 코칭 버튼 */}
        <SmallButton
          onClick={handleAiCoaching}
          backgroundColor="primary-orange"
          className="px-8 py-2 relative"
          children="AI 코칭"
        >
        </SmallButton>

        {/* 다음 버튼 */}
        <SmallButton
          onClick={handleContinue}
          backgroundColor="primary-orange"
          className="px-8 py-2 relative"
          children="다음"
        >
        </SmallButton>

      </div>
    </Modal>
  );
};

export default ResultDetailModal;
