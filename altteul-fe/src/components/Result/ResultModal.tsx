// src/components/common/Modal/ResultModal.tsx
import React from 'react';
import Modal from '@components/Common/Modal';
import SmallButton from '@components/Common/Button/Button';
import win from '@assets/icon/result/win.svg';
import lose from '@assets/icon/result/lose.svg';
import useModalStore from '@stores/modalStore';

import { GAME_TYPES, RESULT_TYPES, GameType, ResultType, MODAL_TYPES } from 'types/modalTypes';

type ResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: GameType;
  result: ResultType;
};

const ResultModal = ({ isOpen, onClose, type, result }: ResultModalProps) => {
  const { openModal } = useModalStore();

  // 결과에 따른 UI 설정
  //성공 유무 1차 필터링
  //싱글인지 팀인지 2차 필터링
  const getResultConfig = () => {
    const isSuccess = result === RESULT_TYPES.SUCCESS;
    return {
      image: isSuccess ? win : lose,
      imageAlt: isSuccess ? '성공' : '실패',
      glowColor: isSuccess ? 'primary-orange' : 'primary-blue',
      borderColor: isSuccess ? 'primary-orange' : 'gray-01',
      shadowClass: isSuccess ? 'shadow-orange' : 'shadow-blue',

      mainText: isSuccess
        ? type === GAME_TYPES.SINGLE
          ? 'SUCCESS!'
          : 'WIN!'
        : type === GAME_TYPES.SINGLE
          ? 'FAIL...'
          : 'LOSE...',

      subText: isSuccess
        ? type === GAME_TYPES.SINGLE
          ? '해결했습니다!'
          : '승리했습니다!'
        : type === GAME_TYPES.SINGLE
          ? '해결하지 못했습니다'
          : '패배했습니다',
      pointText: isSuccess ? '100 포인트를 얻었습니다.' : null,
    };
  };

  const config = getResultConfig();

  const handleContinue = () => {
    onClose();
    // 게임 타입에 따라 다른 모달 열기
    if (type === GAME_TYPES.SINGLE) {
      openModal(MODAL_TYPES.LIST); // 성공/실패 상관없이 결과 목록으로 이동
    } else {
      openModal(MODAL_TYPES.NAVIGATE, { type: GAME_TYPES.TEAM });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="26rem"
      height="25rem"
      className={`bg-primary-black relative overflow-hidden border-2 border-${config.borderColor} ${config.shadowClass}`}
    >
      <div className="flex flex-col items-center justify-center h-full w-full">
        {/* 이미지 */}
        <div className="relative">
          <img src={config.image} alt={config.imageAlt} className="w-40 h-40 relative z-10" />
          <div className={`absolute inset-0 bg-${config.glowColor} opacity-30 blur-xl`} />
        </div>

        {/* 메인 텍스트 */}
        <div className="mb-2 text-4xl font-bold text-white">{config.mainText}</div>

        {/* 서브 텍스트 */}
        <div className="text-white text-xl">{config.subText}</div>

        {/* 포인트 텍스트 */}
        {config.pointText && <div className="text-white text-sm mb-1">{config.pointText}</div>}

        {/* 안내 텍스트 */}
        <div className="text-gray-02 text-sm mb-3">
          계속하려면 Enter키나 다음 버튼을 눌러주세요.
        </div>

        {/* 다음 버튼 */}
        <SmallButton
          onClick={handleContinue}
          backgroundColor="primary-orange"
          className="px-8 py-2 relative"
        >
          다음
        </SmallButton>
      </div>
    </Modal>
  );
};

export default ResultModal;
