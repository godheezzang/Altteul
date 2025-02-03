import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Users } from "@/types";
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
};

const SingleSearchPage = () => {
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
        {/* 팀 정보 */}
        <div className="flex justify-center items-center gap-20">
          {Object.values(mockUsers).map((user, index) => (
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
          <Link to="/team-search">
            <Button
              width="120px"
              height="48px"
              fontSize="18px"
              className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]"
            >
              매칭 시작
            </Button>
          </Link>
          <Link to="/select">
            <Button
              width="120px"
              height="48px"
              fontSize="18px"
              className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]"
            >
              나가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleSearchPage;
