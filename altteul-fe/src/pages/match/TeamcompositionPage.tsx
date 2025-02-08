import { Link } from "react-router-dom";
import UserProfile from "@components/match/UserProfile";
import Button from "@components/common/Button/Button";
import backgroundImage from "@assets/background/team_matching.svg";
import tierIcon from "@assets/icon/Badge_09.svg";
import logo from "@assets/icon/Altteul.svg";
import { User } from "types/types";
import { TeamData } from "mocks/userData";

const TeamcompositionPage = () => {
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
        {/* 팀 정보 */}
        <div className="flex justify-center items-center gap-20">
          {TeamData.map((user: User) => (
            <UserProfile key={user.userId} nickName={user.nickName} profileImg={user.profileImg} tier={tierIcon} />
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex gap-6 mt-12">
          <Link to="/match/team/search">
            <Button width="120px" height="48px" fontSize="18px" className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]">
              매칭 시작
            </Button>
          </Link>
          <Link to="/match/select">
            <Button width="120px" height="48px" fontSize="18px" className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]">
              나가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeamcompositionPage;
