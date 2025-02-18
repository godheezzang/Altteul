import React, { useEffect, useState } from 'react';
import Modal from '@components/Common/Modal';
import SmallButton from '@components/Common/Button/Button';
import useModalStore from '@stores/modalStore';
import { MODAL_TYPES, GAME_TYPES } from 'types/modalTypes';
import useGameStore from '@stores/useGameStore';
import { api } from '@utils/Api/commonApi';
import LoadingSpinner from '@components/Common/LoadingSpinner';
import ResultList from '@components/Modal/Result/ResultList';

type ResultDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ResultDetailModal = ({ isOpen, onClose }: ResultDetailModalProps) => {
  const { openModal } = useModalStore();
  const { gameId, isFinish } = useGameStore();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const fetchResultData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`game/${gameId}/result`);

      if (response.status === 200) {
        const data = response.data.data;
        setResults(data);
      }
    } catch (error) {
      // TODO: 데이터 불러오는데 실패하면 에러 페이지
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResultData();
  }, [gameId, isFinish]);

  //TODO: 다음 버튼 클릭시 로직
  const handleContinue = () => {
    onClose();
    openModal(MODAL_TYPES.NAVIGATE, { type: GAME_TYPES.SINGLE });
  };

  if (isLoading) {
    return <LoadingSpinner loading={isLoading} />;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // height="50rem"
      title="게임결과" //반영이 안되네 // 되게했지롱
      titleColor="primary-white"
      className="bg-primary-black relative overflow-hidden border-2 border-primary-orange shadow-orange p-10 w-[72rem] justify-center items-center"
    >
      <div className="flex flex-col items-center justify-center h-full w-full">
        {/* WIN! text with glow */}
        <ResultList results={results} />

        {/* 다음 버튼 */}
        <SmallButton
          onClick={handleContinue}
          backgroundColor="primary-orange"
          className="px-8 py-2 relative"
          children="다음"
        ></SmallButton>
      </div>
    </Modal>
  );
};

export default ResultDetailModal;
