import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { formatTime } from "@utils/formatTime";
import UserProfile from "@components/Match/UserProfile";
import Button from "@components/Common/Button/Button";
import backgroundImage from "@assets/background/single_matching.svg";
import peopleIcon from "@assets/icon/people.svg";
import logo from "@assets/icon/Altteul.svg";
import tmi from "@assets/tmi.json";
import { useTimer } from "@hooks/useTimer";
import { User } from "types/types";
import {
  mockSingleEnterData,
  mockUserInData,
  mockUserOutData,
} from "mocks/singleData";

//페이지 렌더링 시 소켓 구독 요청필요
const SingleSearchPage = () => {
  const navigate = useNavigate();
  const [fact, setFact] = useState<string>("");
  const [facts] = useState<string[]>(tmi.facts);
  const [waitUsers, setWaitUsers] = useState(mockSingleEnterData.data.users);

  //타이머 전 게임 시작 호출
  const userStart = () => {
    //8명 안됐는데 시작할거냐는 알림정도?(8명 되면 자동 시작)
    if(confirm("8명 안됐는데 시작할거임?")) {
      
      //최소인원 확인
      if(waitUsers.length >= 2) {
        //넘어갈 때 현재 대기중인 유저(waitUsers) 정보 넘겨야함(소켓정보 유지 필요)
        navigate("/match/single/final");
      }else{
        alert("개인전이긴 한데... 너 혼자 게임 못함...")
      }

    }

  };

  //새로운 유저 입장(소켓 메세지 핸들링 부분이 될듯)
  const waitUserChange = (type: string) => {
    if (type == "ENTER") {
      //유저 입장시 소켓 메세지(파라미터랑 별개임)의 users 부분 세팅
      setWaitUsers(mockUserInData.data.users);
    }

    if (type == "LEAVE") {
      //남은 인원들로 waitUsers 재구성
      setWaitUsers(mockUserOutData.data.remainingUsers);
    }
  };

  //유저(본인) 퇴장
  const userOut = () => {
    // 구독 취소 요청 필요

    navigate("/match/select");
  };

  const { seconds } = useTimer({
    initialSeconds: 180, // 시작 시간 설정
    onComplete: () => {
      // navigate("/match/single/final"); // 타이머 완료 시 실행할 콜백
    },
  });

  // 첫 fact 생성 후 5초 간격으로 Rotation
  useEffect(() => {
    setFact(facts[Math.floor(Math.random() * facts.length)]);

    const factRotation = setInterval(() => {
      setFact(facts[Math.floor(Math.random() * facts.length)]);
    }, 5000);

    return () => clearInterval(factRotation);
  }, [facts]);

  useEffect(() => {
    console.log(mockSingleEnterData.data);
    console.log(mockSingleEnterData.data.users);
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
          nickName="방장"
          profileImage={peopleIcon}
          tierId = {4}
          className="mb-4"
        />

        {/* 방장 이름 */}
        <div className="text-white text-2xl mb-4">나는 방장</div>

        {/* Status Message */}
        <div className="text-white text-xl mb-8 flex flex-col items-center">
          {/* 임시로 텍스트 클릭시 새로운 유저 유입/유저 퇴장 부분(onClick) 만듬 */}
          <div onClick={() => waitUserChange("ENTER")}>
            같이 플레이 할 상대를 찾고 있어요. 🧐
          </div>

          <div
            className="flex text-base"
            onClick={() => waitUserChange("LEAVE")}
          >
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
          {waitUsers.map((user: User) => (
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
