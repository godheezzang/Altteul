import useGameStore from '@stores/useGameStore';
import { useNavigate, Link } from 'react-router-dom';
import { formatTime } from '@utils/formatTime';
import { useTimer } from '@hooks/useTimer';
import backgroundImage from '@assets/background/single_matching_bg.svg';
import logo from '@assets/icon/Altteul.svg';
import { User } from 'types/types';
import { useMatchStore } from '@stores/matchStore';
import { useState, useEffect } from 'react';
import UserProfile from '@components/Match/UserProfile';
import useMatchWebSocket from '@hooks/useMatchWebSocket';
import { useSocketStore } from '@stores/socketStore';

const SingleFinalPage = () => {
  const navigate = useNavigate();
  const store = useMatchStore();
  const [waitUsers, setWaitUsers] = useState(store.matchData.users);
  const [leaderId] = useState(store.matchData.leaderId);
  const roomId = store.matchData.roomId;
  const gameId = store.matchData.gameId;
  const [headUser, setHeadUser] = useState<User>(waitUsers.find(user => user.userId === leaderId));
  const { resetGameInfo, setGameInfo, setUsers, setProblem, setTestcases } =
    useGameStore.getState();
  const { c_waitUsers, c_leaderId } = useMatchWebSocket(roomId);
  const problem = store.matchData.problem;
  const testcases = store.matchData.testcases;

  useEffect(() => {
    if (c_waitUsers && c_leaderId) {
      console.log('유저정보 Update');
      console.log('대기 유저 정보: ', c_waitUsers);
      console.log('방장 ID: ', c_leaderId);
      setHeadUser(c_waitUsers.find(user => user.userId === c_leaderId));
      setWaitUsers(c_waitUsers.filter(user => user.userId !== c_leaderId));
    }
  }, [c_waitUsers, c_leaderId]);

  // 타이머 완료 여부를 추적하는 상태 추가
  const [isTimeUp, setIsTimeUp] = useState(false);

  const { seconds } = useTimer({
    initialSeconds: 10,
    onComplete: () => {
      setIsTimeUp(true);
    },
  });

  // 타이머 완료 시 페이지 이동 처리
  useEffect(() => {
    if (isTimeUp) {
      store.setMatchData({
        data: {
          gameId: gameId,
          roomId: roomId,
          leaderId: leaderId,
          users: [headUser, ...waitUsers],
          problem: problem,
          testcases: testcases,
        },
      });

      setGameInfo(gameId, roomId);
      setUsers([headUser, ...waitUsers]);
      setProblem(problem);
      setTestcases(testcases);
      useSocketStore.getState().setKeepConnection(true);
      console.log('keepConnection true 완료');

      setTimeout(() => {
        console.log('페이지 이동');
        navigate(`/game/single/${gameId}/${roomId}`);
      }, 100); // 데이터 저장 후 안전하게 페이지 이동
    }
  }, [
    isTimeUp,
    roomId,
    gameId,
    leaderId,
    waitUsers,
    headUser,
    problem,
    setGameInfo,
    setProblem,
    setTestcases,
    setUsers,
    store,
    testcases,
    navigate,
  ]);

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <Link
        to="/"
        className="z-20 absolute top-8 left-8 transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]"
      >
        <img src={logo} alt="홈으로" className="w-full h-full" />
      </Link>

      <div className="relative min-h-screen w-full z-10 flex flex-col items-center justify-center">
        <UserProfile
          nickname={headUser.nickname}
          profileImg={headUser.profileImg}
          tierId={headUser.tierId}
          className="mb-4"
        />

        <div className="text-white text-2xl mb-4">나는 방장</div>

        <div className="text-white text-3xl mb-8 flex flex-col items-center">
          게임이 시작됩니다!
        </div>

        <div className="text-white text-4xl mb-8">{formatTime(seconds)}</div>

        <div className="flex justify-center items-center gap-20">
          {waitUsers.map((user: User) => (
            <UserProfile
              key={user.userId}
              nickname={user.nickname}
              profileImg={user.profileImg}
              tierId={user.tierId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleFinalPage;
