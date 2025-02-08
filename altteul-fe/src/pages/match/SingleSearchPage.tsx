import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { formatTime } from "@utils/formatTime";
import UserProfile from "@components/match/UserProfile";
import Button from "@components/common/Button/Button";
import backgroundImage from "@assets/background/single_matching.svg";
import peopleIcon from "@assets/icon/people.svg";
import logo from "@assets/icon/Altteul.svg";
import tmi from "@assets/tmi.json";
import { useTimer } from "@hooks/useTimer";
import { User } from "types/types";
import useMatchWebSocket from "@hooks/useMatchWebSocket";
import { useMatchStore } from "@stores/matchStore";
import { singleOut } from "@utils/api/matchApi";

const SingleSearchPage = () => {
  const navigate = useNavigate();
  const store = useMatchStore(); //select 페이지에서 저장한 데이터 호출
  const [fact, setFact] = useState<string>("");
  const [facts] = useState<string[]>(tmi.facts);
  /////////////////////////초기 값(전역 상태 값)/////////////////////////
  const [waitUsers, setWaitUsers] = useState(store.matchData.users); //(방장 포함)대기 중인 유저 리스트
  const [leaderId] = useState(store.matchData.leaderId);
  const [headUser, setHeadUser] = useState<User>(
    waitUsers.find((user) => user.userId === leaderId)
  );
  /////////////////////////////////////////////////////////////////////
  const roomId = store.matchData.roomId;
  // WebSocket 훅 사용
  const { isConnected, error, c_waitUsers, c_leaderId } = useMatchWebSocket(roomId);

  //connetTest
  useEffect(() => {
    console.log("연결 상태확인: ", isConnected);
  }, [isConnected]);

  // 유저 정보 업데이트
  // useEffect(() => {
  //   console.log("유저정보 Update");
  //   setHeadUser(c_waitUsers.find((user) => user.userId === c_leaderId));
  //   setWaitUsers(c_waitUsers);
  // }, [c_waitUsers, c_leaderId]);

  //타이머 전 게임 시작 호출
  const userStart = () => {
    //8명 안됐는데 시작할거냐는 알림정도?(8명 되면 자동 시작)
    if (confirm("8명 안됐는데 시작할거임?")) {
      //최소인원 확인
      if (waitUsers.length >= 2) {
        //넘어갈 때 현재 대기중인 유저(waitUsers) 정보 넘겨야함(소켓정보 유지 필요)
        navigate("/match/single/final");
      } else {
        alert("개인전이긴 한데... 너 혼자 게임 못함...");
      }
    }
  };

  //유저(본인) 퇴장
  const userOut = () => {
    singleOut(15); //TODO: 실제 나가는 userId세팅 필요
    navigate("/match/select");
  };

  const { seconds } = useTimer({
    initialSeconds: 180, // 시작 시간 설정
    onComplete: () => {
      navigate("/match/single/final"); // 타이머 완료 시 실행할 콜백
    },
  });

  // TMI: 첫 fact 생성 후 5초 간격으로 Rotation
  useEffect(() => {
    setFact(facts[Math.floor(Math.random() * facts.length)]);

    const factRotation = setInterval(() => {
      setFact(facts[Math.floor(Math.random() * facts.length)]);
    }, 5000);

    return () => clearInterval(factRotation);
  }, [facts]);

  // WebSocket 상태 모니터링
  useEffect(() => {
    if (error) {
      console.error("WebSocket 연결 오류:", error);
      alert("연결에 문제가 발생했습니다. 다시 시도해주세요.");
      navigate("/match/select");
    }
  }, [error, navigate]);

  // 언마운트 시 방 나가기
  useEffect(() => {
    return () => {
      singleOut(15);
      console.log("방에서 나가기");
    };
  }, []);

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* 로고 링크 */}
      <Link
        to="/"
        className="z-20 absolute top-8 left-8 transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]"
      >
        <img src={logo} alt="홈으로" className="w-full h-full" />
      </Link>

      {/* 컨텐츠 */}
      <div className="relative min-h-screen w-full z-10 flex flex-col items-center justify-center">
        {/* Timer */}
        <div className="text-white text-4xl mb-8">{formatTime(seconds)}</div>

        {/* 방장: 리더아이디에 해당하는 유저 정보 넣어야 함*/}
        <UserProfile
          nickName={headUser.nickname}
          profileImage={headUser.profileImage}
          tierId={headUser.tierId}
          className="mb-4"
        />

        {/* 방장 이름 */}
        <div className="text-white text-2xl mb-4">나는 방장</div>

        {/* Status Message */}
        <div className="text-white text-xl mb-8 flex flex-col items-center">
          같이 플레이 할 상대를 찾고 있어요. 🧐
          <div className="flex text-base">
            조금만 기다려 주세요
            <div className="ml-2">
              {/* 스피너 */}
              <div className="animate-bounce">...</div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-6 mb-12">
          <Button
            width="160px"
            height="48px"
            className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]"
            onClick={() => userStart()}
          >
            게임 시작
          </Button>
          <Button
            width="160px"
            height="48px"
            className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]"
            onClick={() => userOut()}
          >
            매칭 취소하기
          </Button>
        </div>

        {/* 방장 제외 대기 유저 */}
        <div className="flex justify-center items-center gap-20">
          {waitUsers
            .filter((user) => user.userId !== leaderId)
            .map((user: User) => (
              <UserProfile
                key={user.userId}
                nickName={user.nickname}
                profileImage={user.profileImage}
                tierId={user.tierId}
              />
            ))}
        </div>

        {/* TMI */}
        <div className="absolute bottom-8 text-gray-300 text-sm">{fact}</div>
      </div>
    </div>
  );
};

export default SingleSearchPage;
