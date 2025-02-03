import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users } from "@types";
import { User } from "@types";
import UserProfile from "@components/match/UserProfile";
import Button from "@components/common/Button/Button";
import backgroundImage from "@assets/background/team_matching.svg";
import tierIcon from "@assets/icon/Badge_09.svg";
import peopleIcon from "@assets/icon/people.svg";
import logo from "@assets/icon/Altteul.svg";
import tmi from "@assets/tmi.json";

const mockUsers: Users = {
  user1: { nickName: "알리언", profileImage: peopleIcon, tier: tierIcon },
  user2: { nickName: "샤샤샤", profileImage: peopleIcon, tier: tierIcon },
  user3: { nickName: "오리진", profileImage: peopleIcon, tier: tierIcon },
  user4: { nickName: "가희바희보", profileImage: peopleIcon, tier: tierIcon },
};

const SingleSearchPage = () => {
  const [fact, setFact] = useState<string>("");
  const [facts] = useState<string[]>(tmi.facts);

  // 첫 fact 생성 후 5초 간격으로 Rotation
  useEffect(() => {
    setFact(facts[Math.floor(Math.random() * facts.length)]);

    const factRotation = setInterval(() => {
      setFact(facts[Math.floor(Math.random() * facts.length)]);
    }, 5000);

    return () => clearInterval(factRotation);
  }, [facts]);

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
        {/* Status Message */}
        <div className="text-white text-3xl mb-8 flex flex-col items-center">
          대전 할 상대를 찾고 있어요. 🧐
          <div className="flex text-base mt-3">
            조금만 기다려 주세요
            <div className="ml-2">
              {/* 스피너 */}
              <div className="animate-bounce">...</div>
            </div>
          </div>
        </div>

        {/* 팀 정보 */}
        <div className="flex justify-center items-center gap-20">
          {Object.values(mockUsers).map((user:User, index) => (
            <UserProfile
              key={index}
              nickName={user.nickName}
              profileImage={user.profileImage}
              tier={user.tier}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex gap-6 mt-12">
          <Link to="/team-final">
            <Button
              width="160px"
              height="48px"
              className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]"
            >
              (매칭 완료)
            </Button>
          </Link>
          <Link to="/team-composition">
            <Button
              width="160px"
              height="48px"
              className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]"
            >
              매칭 취소하기
            </Button>
          </Link>
        </div>

        {/* TMI */}
        <div className="absolute bottom-8 text-gray-300 text-sm">{fact}</div>
      </div>
    </div>
  );
};

export default SingleSearchPage;
