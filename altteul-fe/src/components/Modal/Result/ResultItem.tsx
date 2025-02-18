import SmallButton from '@components/Common/Button/SmallButton ';
import { SortedPlayer } from '@components/Modal/Result/ResultList';
import useAuthStore from '@stores/authStore';
import useModalStore from '@stores/modalStore';
import { COMMON_MODAL_TYPES, GAME_TYPES, MODAL_TYPES } from 'types/modalTypes';
import checkbox from '@assets/icon/result/checkbox.svg';
import Bronze from '@assets/icon/badge/Badge_01.svg';
import Silver from '@assets/icon/badge/Badge_04.svg';
import Gold from '@assets/icon/badge/Badge_05.svg';
import Platinum from '@assets/icon/badge/Badge_07.svg';
import Diamond from '@assets/icon/badge/Badge_08.svg';
import useGameStore from '@stores/useGameStore';
import { useState } from 'react';
import { api } from '@utils/Api/commonApi';
import ErrorPage from '@pages/Error/ErrorPage';

interface ResultItemProps {
  player: SortedPlayer;
  rank: number;
}
const ResultItem = ({ player, rank }: ResultItemProps) => {
  const { userId } = useAuthStore();
  const { openModal } = useModalStore();
  const { gameId, userRoomId } = useGameStore();
  const [isLoading, setIsLoading] = useState(false);

  // console.log(player);

  //TODO: 코드 확인 버튼 클릭시 로직
  const handleOpponentCode = () => {
    openModal(MODAL_TYPES.COMMON, {
      type: GAME_TYPES.SINGLE,
      modalType: COMMON_MODAL_TYPES.CODE,
    });
  };

  //TODO: AI 코칭 버튼 클릭시 로직
  const handleAiCoaching = () => {
    openModal(MODAL_TYPES.COMMON, {
      type: GAME_TYPES.SINGLE,
      modalType: COMMON_MODAL_TYPES.COACHING,
    });
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
            {player.nickname}
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
    </>
  );
};

export default ResultItem;
