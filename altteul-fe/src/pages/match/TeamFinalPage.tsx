import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatTime } from "@utils/formatTime";
import { useTimer } from "@hooks/useTimer";
import UserProfile from "@components/Match/UserProfile";
import backgroundImage from "@assets/background/team_matching.svg";
import tierIcon from "@assets/icon/Badge_09.svg";
import peopleIcon from "@assets/icon/people.svg";
import logo from "@assets/icon/Altteul.svg";
import { User, Users } from "types/types";

const mockUsers: Users = {
  user1: { nickName: "알리언", profileImage: peopleIcon, tier: tierIcon },
  user2: { nickName: "샤샤샤", profileImage: peopleIcon, tier: tierIcon },
  user3: { nickName: "오리진", profileImage: peopleIcon, tier: tierIcon },
  user4: { nickName: "가희바희보", profileImage: peopleIcon, tier: tierIcon },
};

const TeamFinalPage = () => {
  const ProblemTitle = "물류 창고 로봇"; //문제 제목 부분
  const [displayText, setDisplayText] = useState(""); //타이핑 효과로 나타나는 텍스트 변수
  const [textIndex, setTextIndex] = useState(0); //타이핑 효과 추적 변수

  const { seconds } = useTimer({
    initialSeconds: 10, // 시작 시간 설정
    // 타이머 완료 시 실행할 콜백
    onComplete: () => {
      // navigate('/single-final');
    },
  });

  // 타이핑 효과 로직
  useEffect(() => {
    if (textIndex < ProblemTitle.length) {
      //현재 타이핑 된 것보다 문제 제목이 더 길 때
      const typingTimer = setTimeout(() => {
        setDisplayText((prev) => prev + ProblemTitle[textIndex]);
        setTextIndex((prev) => prev + 1);
      }, 150); // 각 글자가 타이핑되는 속도 (밀리초)

      return () => clearTimeout(typingTimer);
    }
  }, [textIndex]);

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
        {/* 문제정보(제목) */}
        <div className="text-white text-5xl font-bold mb-8 flex items-center">
          {displayText}
          {/* 커서 효과 부분(텍스트 모두 입력시 사라짐) */}
          {textIndex < ProblemTitle.length && <span className="animate-pulse">|</span>}
        </div>

        {/* Message */}
        <div className="text-white text-xl mb-2 flex flex-col items-center">대전이 시작됩니다!</div>

        {/* Timer */}
        <div className="text-white mb-8">{formatTime(seconds)}</div>

        {/* 유저 정보 */}
        <div className="flex justify-center items-center">
          {/* 아군 유저 */}
          <div className="flex gap-20 animate-slide-left">
            {Object.values(mockUsers).map((user: User, index) => (
              <UserProfile key={index} nickName={user.nickName} profileImage={user.profileImage} tier={user.tier} />
            ))}
          </div>

          {/* vstext */}
          <div className="text-white text-5xl">vs</div>

          {/* 상대 유저 */}
          <div className="flex animate-slide-right gap-20">
            {Object.values(mockUsers).map((user: User, index) => (
              <UserProfile key={index} nickName={user.nickName} profileImage={user.profileImage} tier={user.tier} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamFinalPage;
