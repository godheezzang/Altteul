import useGameStore from '@stores/useGameStore';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '@assets/background/single_matching_bg.svg';
import logo from '@assets/icon/Altteul.svg';
import { Problem, TestCase, User } from 'types/types';
import { useMatchStore } from '@stores/matchStore';
import { useState, useEffect } from 'react';
import UserProfile from '@components/Match/UserProfile';
import useMatchWebSocket from '@hooks/useMatchWebSocket';
import { useSocketStore } from '@stores/socketStore';
import socketResponseMessage from 'types/socketResponseMessage';

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

  // const { c_waitUsers, c_leaderId, count, isStart, gameData } = useMatchWebSocket(roomId);
  const [isStart, setIsStart] = useState(false)
  const [gameData, setGameData] = useState<{gameId:number, users:User[], problem:Problem, testcases:TestCase[]}>()

  const [seconds, setSeconds] = useState<number>(10)

  //구독처리
  useEffect(() => {
    socket.subscribe(`/sub/single/room/${roomId}`, handleMessage)

    //언마운트 시 구독에 대한 콜백함수(handleMessage 정리)
    return () => {
      console.log("singleFinalPage Out, 구독 취소")
      socket.unsubscribe(`/sub/single/room/${roomId}`)
    }
  }, [roomId])

  //소켓 응답 처리
  const handleMessage = (message:socketResponseMessage) => {
    const { type, data } = message;
    console.log(message)
    if (type === 'LEAVE') {
      setWaitUsers(data.users.filter(user => user.userId !== leaderId));
      setHeadUser(data.users.find(user => user.userId === leaderId))
    }

    if (type === 'COUNTING') {
      setSeconds(data.time);
    }

    if (type === 'GAME_START') {
      setGameData({
        gameId: data.gameId,
        users: data.users,
        problem: data.problem,
        testcases: data.testcases
      })
      setIsStart(true);

      setTimeout(() => {
        console.log('IDE 페이지 이동');
        navigate(`/game/single/${data.gameId}/${roomId}`);
      }, 100); // 데이터 저장 후 안전하게 페이지 이동
    }
  }

  // GAME_START 수신 시 페이지 이동 처리
  useEffect(() => {
    if (isStart) {  //소켓에서 GAME_START 수신 시
      // IDE에서 쓸 데이터 setting
      setGameInfo(gameData.gameId, roomId);
      setUsers(gameData.users);
      setProblem(gameData.problem);
      setTestcases(gameData.testcases);

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
