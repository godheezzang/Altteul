// src/components/common/Modal/GameNavigateModal.tsx
import React from 'react';
import Modal from '@components/Common/Modal';
import Button from '@components/Common/Button/Button';
import useModalStore from '@stores/modalStore';
import { useNavigate } from 'react-router-dom';
import { GAME_TYPES, COMMON_MODAL_TYPES, GameType } from 'types/modalTypes';
import { api } from '@utils/Api/commonApi';
import useGameStore from '@stores/useGameStore';
import useAuthStore from '@stores/authStore';
import { useSocketStore } from '@stores/socketStore';
import ErrorPage from '@pages/Error/ErrorPage';

type NavigateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: GameType;
};

const NavigateModal = ({ isOpen, onClose, type }: NavigateModalProps) => {
  const { openModal } = useModalStore();
  const { myTeam, userRoomId, gameId, matchId } = useGameStore();
  const { token } = useAuthStore();
  const socket = useSocketStore();
  const navigate = useNavigate();
  const isTeam = location.pathname.includes('/game/team');

  // 한 문제 더 도전하기
  const handleContinue = async () => {
    if (userRoomId) {
      try {
        const response = await api.post(
          '/game/leave',
          {
            roomId: isTeam ? myTeam.roomId : userRoomId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          socket.unsubscribe(`/sub/game/${gameId}/submission/result`);
          socket.unsubscribe(`/sub/${gameId}/${userRoomId}/team-submission/result`);
          socket.unsubscribe(`/sub/${gameId}/${userRoomId}/side-problem/receive`);
          if (!isTeam) {
            socket.unsubscribe(`/sub/single/room/${gameId}`);
          } else if (isTeam) {
            socket.unsubscribe(`/sub/${gameId}/${userRoomId}/opponent-submission/result`);
            socket.unsubscribe(`/sub/team/room/${matchId}`);
          }
          onClose();
          navigate('/match/select');
        }
      } catch (error) {
        console.error(error);
        <ErrorPage />;
      }
    }
  };

  // AI 코칭 결과 보기
  const handleAiCoaching = () => {
    onClose();
    openModal('game-common', {
      type: type,
      modalType: COMMON_MODAL_TYPES.COACHING,
    });
  };

  // 상대 코드 보기
  const handleOpponentCode = () => {
    onClose();
    openModal('game-common', {
      type: type,
      modalType: COMMON_MODAL_TYPES.CODE,
    });
  };

  const handleNavigateMain = async () => {
    if (userRoomId) {
      try {
        const response = await api.post(
          '/game/leave',
          {
            roomId: isTeam ? myTeam.roomId : userRoomId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          socket.unsubscribe(`/sub/game/${gameId}/submission/result`);
          socket.unsubscribe(`/sub/${gameId}/${userRoomId}/team-submission/result`);
          socket.unsubscribe(`/sub/${gameId}/${userRoomId}/side-problem/receive`);
          if (!isTeam) {
            socket.unsubscribe(`/sub/single/room/${gameId}`);
          } else if (isTeam) {
            socket.unsubscribe(`/sub/${gameId}/${userRoomId}/opponent-submission/result`);
            socket.unsubscribe(`/sub/team/room/${matchId}`);
          }
          onClose();
          navigate('/');
        }
      } catch (error) {
        console.error(error);
        <ErrorPage />;
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      minHeight="8rem"
      className="bg-primary-black relative overflow-hidden border-2 border-primary-orange shadow-orange p-12"
    >
      <div className="flex flex-col items-center justify-center h-full w-full gap-4">
        {/* 한 문제 더 도전하기 - 공통 */}
        <Button
          onClick={handleContinue}
          backgroundColor="primary-orange"
          className="px-8 py-2 w-80"
        >
          한 문제 더 도전하기
        </Button>

        {/* 팀전일 때만 보이는 버튼들 */}
        {type === GAME_TYPES.TEAM && (
          <>
            <Button
              onClick={handleAiCoaching}
              backgroundColor="primary-orange"
              className="px-8 py-2 w-80"
            >
              AI 코칭 결과 보기
            </Button>

            <Button
              onClick={handleOpponentCode}
              backgroundColor="primary-orange"
              className="px-8 py-2 w-80"
            >
              상대 팀 코드 보기
            </Button>
          </>
        )}

        {/* 메인으로 - 공통 */}
        <Button
          onClick={handleNavigateMain}
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
