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
import { singleOut } from '@utils/Api/matchApi';

const SingleFinalPage = () => {
  const navigate = useNavigate();
  const store = useMatchStore();
  const socket = useSocketStore()
  const roomId = store.matchData.roomId;
  const [leaderId] = useState(store.matchData.leaderId);
  // Store에 저장된 데이터로 초기 세팅
  const [waitUsers, setWaitUsers] = useState(store.matchData.users.filter((user) => user.userId !== leaderId));
  const [headUser, setHeadUser] = useState<User>(store.matchData.users.find(user => user.userId === leaderId));
  const [seconds, setSeconds] = useState<number>(10)  //응답 데이터로 렌더링 전 초기값(10) 설정

  //구독처리
  useEffect(() => {
    socket.subscribe(`/sub/single/room/${roomId}`, handleMessage)

    //언마운트 시 구독에 대한 콜백함수(handleMessage 정리)
    return () => {
      console.log("singleFinalPage Out, 구독 취소")
      singleOut(roomId)
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

    //카운팅 응답 수신
    if (type === 'COUNTING') {
      setSeconds(data.time);
    }

    //게임 시작 응답 수신
    if (type === 'GAME_START') {

      //IDE에서 쓸 데이터 setting(소켓 응답데이터 전부)
      sessionStorage.setItem("roomId", roomId.toString())
      sessionStorage.setItem("gameId", data.gameId.toString())
      sessionStorage.setItem("users", JSON.stringify(data.users))
      sessionStorage.setItem("problem", JSON.stringify(data.problem))
      sessionStorage.setItem("testcases", JSON.stringify(data.testcases))

      //IDE 이동 시 match에서 쓰는 데이터 삭제(필요 없음)
      sessionStorage.removeItem("matchData")

      //페이지 이동
      setTimeout(() => {
        console.log('IDE 페이지 이동');
        navigate(`/game/single/${data.gameId}/${roomId}`);
      }, 100); // 데이터 저장 후 안전하게 페이지 이동
    }

    //혼자 남게 됐을 때 로직
    if(type === "COUNTING_CANCEL") {
      alert("대기 중 상대 유저가 연결을 종료했습니다.\n메인페이지로 이동합니다.")
      navigate('/match/select')
    }
  }
  return (
    <div
      className="relative -mt-[3.5rem] min-h-screen w-full bg-cover bg-center"
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
