// src/components/common/Modal/GameNavigateModal.tsx
import React from "react";
import Modal from "@components/common/Modal";
import Button from "@components/common/Button/Button";
import useModalStore from "@stores/modalStore";
import { useNavigate } from "react-router-dom";
import { GAME_TYPES, COMMON_MODAL_TYPES, GameType } from "types/modalTypes";

type NavigateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: GameType;
};

const NavigateModal = ({ isOpen, onClose, type }: NavigateModalProps) => {
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  // 한 문제 더 도전하기
  const handleContinue = () => {
    onClose();
    navigate("/match/select");
  };

  // AI 코칭 결과 보기
  const handleAiCoaching = () => {
    onClose();
    openModal("game-common", {
      type: type,
      modalType: COMMON_MODAL_TYPES.COACHING
    });
  };

  // 상대 코드 보기
  const handleOpponentCode = () => {
    onClose();
    openModal("game-common", {
      type: type,
      modalType: COMMON_MODAL_TYPES.CODE
    });
  };

  // 메인으로
  const handleMain = () => {
    onClose();
    navigate("/");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="26rem"
      height="25rem"
      className="bg-primary-black relative overflow-hidden border-2 border-primary-orange shadow-orange"
    >
      <div className="flex flex-col items-center justify-center h-full w-full gap-4">
        {/* 한 문제 더 도전하기 - 공통 */}
        <Button
          onClick={handleContinue}
          backgroundColor="primary-orange"
          className="px-8 py-2 relative w-80"
        >
          한 문제 더 도전하기
        </Button>

        {/* 팀전일 때만 보이는 버튼들 */}
        {type === GAME_TYPES.TEAM && (
          <>
            <Button
              onClick={handleAiCoaching}
              backgroundColor="primary-orange"
              className="px-8 py-2 relative w-80"
            >
              AI 코칭 결과 보기
            </Button>

            <Button
              onClick={handleOpponentCode}
              backgroundColor="primary-orange"
              className="px-8 py-2 relative w-80"
            >
              상대 팀 코드 보기
            </Button>
          </>
        )}

        {/* 메인으로 - 공통 */}
        <Button
          onClick={handleMain}
          backgroundColor="primary-orange"
          className="px-8 py-2 relative w-80"
        >
          메인으로
        </Button>
      </div>
    </Modal>
  );
};

export default NavigateModal;