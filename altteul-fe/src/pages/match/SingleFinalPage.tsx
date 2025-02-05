import { useNavigate, Link } from "react-router-dom";
import { formatTime } from "@utils/formatTime";
import { useTimer } from "@hooks/useTimer";
import UserProfile from "@components/Match/UserProfile";
import backgroundImage from "@assets/background/single_matching.svg";
import peopleIcon from "@assets/icon/people.svg";
import logo from "@assets/icon/Altteul.svg";
import { User } from "types/types";
import { userData } from "mocks/userData";
import tierIcon from "@assets/icon/Badge_09.svg";

const SingleFinalPage = () => {
  const navigate = useNavigate();

  const { seconds } = useTimer({
    initialSeconds: 10,
    onComplete: () => {
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
        <UserProfile nickName="방장" profileImg={peopleIcon} tier={tierIcon} className="mb-4" />

        <div className="text-white text-2xl mb-4">나는 방장</div>

        <div className="text-white text-3xl mb-8 flex flex-col items-center">게임이 시작됩니다!</div>

        <div className="text-white text-4xl mb-8">{formatTime(seconds)}</div>

        <div className="flex justify-center items-center gap-20">
          {userData.map((user: User) => (
            <UserProfile key={user.userId} nickName={user.nickName} profileImg={user.profileImg} tier={tierIcon} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleFinalPage;
