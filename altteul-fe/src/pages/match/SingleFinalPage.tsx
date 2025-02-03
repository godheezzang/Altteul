import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Users } from '@/types';
import { formatTime } from '@utils/formatTime';
import UserProfile from '@components/match/UserProfile';
import Button from "@components/common/Button/Button";
import backgroundImage from '@assets/background/single_matching.svg';
import tierIcon from '@assets/icon/Badge_09.svg';
import peopleIcon from '@assets/icon/people.svg';
import logo from '@assets/icon/Altteul.svg';
import tmi from '@assets/tmi.json'

const mockUsers: Users = {
  user1: { nickName: "알리언", profileImage: peopleIcon, tier: tierIcon },
  user2: { nickName: "샤샤샤", profileImage: peopleIcon, tier: tierIcon },
  user3: { nickName: "오리진", profileImage: peopleIcon, tier: tierIcon },
  user4: { nickName: "가희바희보", profileImage: peopleIcon, tier: tierIcon },
  user5: { nickName: "쿨드캡슐", profileImage: peopleIcon, tier: tierIcon },
  user6: { nickName: "리카스", profileImage: peopleIcon, tier: tierIcon }
};

const SingleSearchPage = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState<number>(10); // 3minutes in seconds

  // 타이머 로직
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
        //   navigate('/single-final');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

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
      <div className='relative min-h-screen w-full z-10 flex flex-col items-center justify-center'>


        

        {/* 방장 */}
        <UserProfile
          nickName={""}
          profileImage={peopleIcon}
          tier={tierIcon}
          className = "mb-4"
        />

        {/* 방장 이름 */}
        <div className="text-white text-2xl mb-4">나는 방장</div>

        {/* Status Message */}
        <div className="text-white text-3xl mb-8 flex flex-col items-center">
            게임이 시작됩니다!
        </div>

        {/* Timer */}
        <div className="text-white text-4xl mb-8">
            {formatTime(seconds)}
        </div>

        {/* 상대유저 */}
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

      </div>

    </div>
  );
};

export default SingleSearchPage;