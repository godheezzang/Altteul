import SmallButton from '@components/Common/Button/SmallButton ';
import { SortedPlayer } from '@components/Modal/Result/ResultList';
import useAuthStore from '@stores/authStore';
import checkbox from '@assets/icon/result/checkbox.svg';
import Bronze from '@assets/icon/badge/Badge_01.svg';
import Silver from '@assets/icon/badge/Badge_04.svg';
import Gold from '@assets/icon/badge/Badge_05.svg';
import Platinum from '@assets/icon/badge/Badge_07.svg';
import Diamond from '@assets/icon/badge/Badge_08.svg';
import { useState } from 'react';
import { api } from '@utils/Api/commonApi';
import useGameStore from '@stores/useGameStore';
import ErrorPage from '@pages/Error/ErrorPage';
import LoadingSpinner from '@components/Common/LoadingSpinner';

interface ResultItemProps {
  player: SortedPlayer;
  rank: number;
}

const ResultItem = ({ player, rank }: ResultItemProps) => {
  const { userId } = useAuthStore();
  const { gameId, userRoomId } = useGameStore();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const isTeam = location.pathname.includes('game/team');
  const [modalType, setModalType] = useState<'Feedback' | 'OpponentCode' | null>(null);
  const [userCodes, setUserCodes] = useState<{ nickname: string; code: string }[]>([]);

  const handleOpponentCode = async () => {
    setShowModal(true);
    setModalType('OpponentCode');

    try {
      setIsLoading(true);
      const response = await api.get(`/game/code/${userRoomId}`, {
        params: {
          type: isTeam ? 'T' : 'S',
          gameId: gameId,
        },
      });

      setUserCodes(response.data.data.userCodes || []);
    } catch (error) {
      console.error(error);
      <ErrorPage />;
    } finally {
      setIsLoading(false);
    }
  };

  //TODO: AI 코칭 버튼 클릭시 로직
  const handleAiCoaching = async () => {
    setShowModal(true);
    setModalType('Feedback');
    try {
      setIsLoading(true);
      const response = await api.get(`/game/result/feedback`, {
        params: {
          gameId: gameId,
          teamId: userRoomId, // TODO: gameId만 보낼 때 삭제
        },
      });

      console.log('ai 코칭 결과:', response);
      setFeedback(JSON.parse(response?.data.data.content));
    } catch (error) {
      console.error(error);
      <ErrorPage />;
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const tier =
    player.tierId == 1
      ? Bronze
      : player.tierId == 2
        ? Silver
        : player.tierId == 4
          ? Gold
          : player.tierId == 3
            ? Platinum
            : player.tierId == 5
              ? Diamond
              : '';

  if (isLoading) {
    return <LoadingSpinner loading={isLoading} />;
  }

  return (
    <>
      <li className="flex text-primary-white justify-between items-center  mb-4 ">
        <div className="flex justify-between items-center bg-gray-06 p-4 rounded-lg w-[53rem]">
          <p className="w-8 text-center">{rank > 0 ? rank : '-'}</p>
          <div className="flex gap-2 items-center justify-center w-40">
            <div
              className="ml-1 mr-3
          ' relative border rounded-full"
            >
              <img
                src={player.profileImage}
                alt={player.nickname}
                className="w-10 h-10 rounded-full"
              />
              <img src={tier} alt="Tier" className="absolute -bottom-1 -right-1 w-6 h-6" />
            </div>
            <p className={player.userId === userId ? 'text-primary-orange' : ''}>
              {player.nickname}
            </p>
          </div>
          <p className="w-16 text-center">{player.point}</p>
          <p className="w-16 text-center">{player.duration}</p>
          <p className="w-8 flex justify-center">
            {player.passRate === 100 ? <img src={checkbox} alt="해결 " /> : '-'}
          </p>
          <p className="w-16 text-center">{player.passRate}%</p>
          <p className="w-16 text-center">{player.lang}</p>
          <p className="w-16 text-center">{player.executeTime ? player.executeTime : '-'}</p>
          <p className="w-16 text-center">{player.executeMemory ? player.executeMemory : '-'}</p>
        </div>

        <div className="w-20">
          {Number(userId) === player.userId ? (
            <SmallButton
              onClick={handleAiCoaching}
              backgroundColor="primary-orange"
              className="w-[5.3rem]"
              children="AI 코칭"
            ></SmallButton>
          ) : (
            <SmallButton
              onClick={handleOpponentCode}
              backgroundColor="primary-orange"
              className="w-[5.3rem]"
              children="코드 확인"
            ></SmallButton>
          )}
        </div>
      </li>
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          style={{ zIndex: 999 }}
        >
          <div
            className="bg-primary-black p-8 rounded-md shadow-side min-w-[30rem] max-w-[50rem] shadow-gray-03 text-center min-h-[20rem] flex flex-col"
            style={{ zIndex: 60 }}
          >
            {modalType === 'Feedback' ? (
              <>
                <h2 className="text-lg font-semibold text-primary-white mb-8">AI 코칭 결과</h2>
                <div className="bg-primary-black text-primary-white overflow-auto text-left flex-1">
                  <p className="min-h-[10rem] max-h-[30rem] text-center">
                    {feedback ? feedback : '코칭 정보가 없습니다.'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-primary-white mb-8">
                  {player.nickname}님의 코드
                </h2>
                <div className="bg-primary-black text-primary-white overflow-auto text-left flex-1">
                  {userCodes
                    .filter(code => code.nickname === player.nickname)
                    .map((code, index) => (
                      <pre key={index} className="bg-gray-06 min-h-full">
                        <code>{code.code || '코드 정보가 없습니다.'}</code>
                      </pre>
                    ))}
                </div>
              </>
            )}
            <div>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-primary-orange text-primary-white rounded-md hover:bg-secondary-orange transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResultItem;
