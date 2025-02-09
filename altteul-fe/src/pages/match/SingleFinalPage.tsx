import { useNavigate, Link } from "react-router-dom";
import { formatTime } from "@utils/formatTime";
import { useTimer } from "@hooks/useTimer";
import backgroundImage from "@assets/background/single_matching_bg.svg";
import logo from "@assets/icon/Altteul.svg";
import { User } from "types/types";
import { useMatchStore } from "@stores/matchStore";
import { useState } from "react";
import UserProfile from "@components/match/UserProfile";

const SingleFinalPage = () => {
  const navigate = useNavigate();
  const store = useMatchStore();  //select 페이지에서 저장한 데이터 호출
  const [waitUsers] = useState(store.matchData.users); //(방장 포함)대기 중인 유저 리스트
  const leaderId = store.matchData.leaderId;
  const headUser = waitUsers.find((user) => user.userId === store.matchData.leaderId)

  const { seconds } = useTimer({
    initialSeconds: 10,
    onComplete: () => {
      //TODO: single IDE 페이지로 이동
      // navigate('/single-final');
    },
  });

  return (
    <div className="relative min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="absolute inset-0 bg-black/50"></div>

      <Link to="/" className="z-20 absolute top-8 left-8 transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]">
        <img src={logo} alt="홈으로" className="w-full h-full" />
      </Link>

      <div className="relative min-h-screen w-full z-10 flex flex-col items-center justify-center">
        {/* 방장 */}
        <UserProfile nickName={headUser.nickname} profileImage={headUser.profileImage} tierId={headUser.tierId} className="mb-4" />

        <div className="text-white text-2xl mb-4">나는 방장</div>

        <div className="text-white text-3xl mb-8 flex flex-col items-center">게임이 시작됩니다!</div>

        <div className="text-white text-4xl mb-8">{formatTime(seconds)}</div>

        <div className="flex justify-center items-center gap-20">
          {/* 방장을 제외한 유저 */}
          {(waitUsers.filter((user) => user.userId !== leaderId)).map((user: User) => (
            <UserProfile key={user.userId} nickName={user.nickname} profileImage={user.profileImage} tierId={user.tierId} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleFinalPage;
