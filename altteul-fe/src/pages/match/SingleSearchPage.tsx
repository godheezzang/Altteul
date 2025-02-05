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
import { mockSingleEnterData } from "mocks/singleData";

const SingleSearchPage = () => {
  const navigate = useNavigate();
  const [fact, setFact] = useState<string>("");
  const [facts] = useState<string[]>(tmi.facts);
  const waitUsers = mockSingleEnterData.data.users

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
    <div className="relative min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* 로고 링크 */}
      <Link to="/" className="z-20 absolute top-8 left-8 transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]">
        <img src={logo} alt="홈으로" className="w-full h-full" />
      </Link>

      {/* 컨텐츠 */}
      <div className="relative min-h-screen w-full z-10 flex flex-col items-center justify-center">
        {/* Timer */}
        <div className="text-white text-4xl mb-8">{formatTime(seconds)}</div>

        {/* 방장: 리더아이디에 해당하는 유저 정보 넣어야 함*/}
        <UserProfile nickName="방장" profileImage={peopleIcon} tierId={4} className="mb-4" />

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
          <Link to="/match/single/final">
            <Button width="160px" height="48px" className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]">
              게임 시작
            </Button>
          </Link>
          <Link to="/match/select">
            <Button width="160px" height="48px" className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]">
              매칭 취소하기
            </Button>
          </Link>
        </div>

        {/* 방장 제외 대기 유저 */}
        <div className="flex justify-center items-center gap-20">
          {waitUsers.map((user: User) => (
            <UserProfile key={user.userId} 
                         nickName={user.nickname} 
                         profileImage={user.profileImage}
                         tierId= {user.tierId} />
          ))}
        </div>

        {/* TMI */}
        <div className="absolute bottom-8 text-gray-300 text-sm">{fact}</div>
      </div>
    </div>
  );
};

export default SingleSearchPage;
