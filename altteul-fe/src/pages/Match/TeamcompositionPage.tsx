import { Link } from "react-router-dom";
import UserProfile from "@components/Match/UserProfile";
import Button from "@components/Common/Button/Button";
import backgroundImage from "@assets/background/team_matching_bg.svg";
import logo from "@assets/icon/Altteul.svg";
import { User } from "types/types";
import { useState } from "react";
import { useMatchStore } from "@stores/matchStore";
import { teamOut } from "@utils/Api/matchApi";
import useMatchWebSocket from "@hooks/useMatchWebSocket";

const TeamcompositionPage = () => {
  const matchStore = useMatchStore();
  //waitUsers: 방장 포함 대기 유저
  const [waitUsers, setWaitUsers] = useState(matchStore.matchData.users);
  const [leaderId] = useState(matchStore.matchData.leaderId);
  const [headUser, setHeadUser] = useState<User>(matchStore.matchData.users.find(user => user.userId === leaderId));
  const roomId = matchStore.matchData.roomId; //웹 소켓 연결 & 게임 초대 시 필요
  const currentUserId = Number(localStorage.getItem('userId'));
  const [isLeader, setIsLeader] = useState(currentUserId === leaderId); //매칭 시작 버튼 렌더링을 위한 변수


  const { isConnected, c_waitUsers, c_leaderId } = useMatchWebSocket(roomId);

  const userOut = () => {
    teamOut(currentUserId)
  }

  return (
    <div className="relative min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* 컨텐츠 */}
      <div className="relative min-h-screen w-full z-10 flex flex-col items-center justify-center">
        {/* 팀 정보 */}
        <div className="flex justify-center items-center gap-20">
          {waitUsers.map((user: User) => (
            <UserProfile key={user.userId} nickname={user.nickname} profileImg={user.profileImg} tierId={user.tierId} />
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex gap-6 mt-12">
          {isLeader && <Link to="/match/team/search">
            <Button className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]">
              매칭 시작
            </Button>
          </Link>}
          <Link to="/match/select">
            <Button className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]"
            onClick={userOut}>
              나가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeamcompositionPage;
