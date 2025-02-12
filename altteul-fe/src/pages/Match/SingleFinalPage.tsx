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
  const socket = useSocketStore()

  const roomId = store.matchData.roomId;
  const [leaderId] = useState(store.matchData.leaderId);
  // Store에 저장된 데이터로 초기 세팅
  const [waitUsers, setWaitUsers] = useState(store.matchData.users.filter((user) => user.userId !== leaderId));
  const [headUser, setHeadUser] = useState<User>(store.matchData.users.find(user => user.userId === leaderId));
  // console.log("전달 받은 데이터::", store.matchData)
  const { setGameInfo, setUsers, setProblem, setTestcases } = useGameStore();

  const { c_waitUsers, c_leaderId, count, isStart, gameData } = useMatchWebSocket(roomId);

  const [seconds, setSeconds] = useState<number>(10)

  useEffect(() => {
    if (c_waitUsers && c_leaderId) {
      console.log('유저정보 Update');
      console.log('대기 유저 정보: ', c_waitUsers);
      console.log('방장 ID: ', c_leaderId);
      setHeadUser(c_waitUsers.find(user => user.userId === c_leaderId));
      setWaitUsers(c_waitUsers.filter(user => user.userId !== c_leaderId));
    }
  }, [c_waitUsers, c_leaderId]);

  //응답 데이터 수신에 따른 count 변화
  useEffect(() => {
    setSeconds((count))
  }, [count])

  // 소켓 연결 관리 부분
  useEffect(() => {
    //소켓 연결 유지는 페이지 넘어가기 전에만 설정, 초기에는 false
    //정상적인 페이지 이동이 아닌 경우 Defalut로 연결 끊기 위함
    socket.setKeepConnection(false);
    return () => {
      // 소켓 연결 유지 선언을 하지 않았다면 연결 유지 초기화(소켓 끊음)
      if (!socket.keepConnection) {
        console.log('!!연결 유지 선언이 없어서 소켓 연결을 초기화 합니다!!');
        socket.resetConnection();
        navigate('/match/select');
      }
    };
  },[])

  // GAME_START 수신 시 페이지 이동 처리
  useEffect(() => {
    if (isStart) {  //소켓에서 GAME_START 수신 시
      // IDE에서 쓸 데이터 setting
      setGameInfo(gameData.gameId, roomId);
      setUsers(gameData.users);
      setProblem(gameData.problem);
      setTestcases(gameData.testcases);
      socket.setKeepConnection(true); //정상 이동, 소켓 연결 유지

      setTimeout(() => {
        console.log('IDE 페이지 이동');
        navigate(`/game/single/${gameData.gameId}/${roomId}`);
      }, 100); // 데이터 저장 후 안전하게 페이지 이동
    }
  }, [
    isStart,
    roomId,
    gameData,
    setGameInfo,
    setProblem,
    setTestcases,
    setUsers,
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

        <div className="text-white text-4xl mb-8">{seconds}</div>

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
