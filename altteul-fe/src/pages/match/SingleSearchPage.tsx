import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Users } from '@/types';
import { formatTime } from '@utils/formatTime';
import { useTimer } from '@/hooks/useTimer';
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
  const [fact, setFact] = useState<string>('');
  const [facts, setFacts] = useState<string[]>(tmi.facts);

  const { seconds } = useTimer({
    initialSeconds: 180, // 시작 시간 설정
    onComplete: () => {
      navigate('/single-final'); // 타이머 완료 시 실행할 콜백
    }
  });


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
      <div className='relative min-h-screen w-full z-10 flex flex-col items-center justify-center'>


        {/* Timer */}
        <div className="text-white text-4xl mb-8">
            {formatTime(seconds)}
        </div>

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
        <div className="text-white text-xl mb-8 flex flex-col items-center">
            같이 플레이 할 상대를 찾고 있어요. 🧐
            <div className='flex text-base'>
                조금만 기다려 주세요
                <div className="ml-2">
                    {/* 스피너 */}
                    <div className="animate-bounce">...</div>
                </div>
            </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-6 mb-12">
            <Link to='/single-final'>
                <Button width="160px" height="48px"
                className = "transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]">
                    게임 시작
                </Button>
            </Link>
            <Link to='/select'>
            <Button width="160px" height="48px"
                className = "transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]">
                    매칭 취소하기
                </Button>
            </Link>
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

        {/* TMI */}
        <div className="absolute bottom-8 text-gray-300 text-sm">
            {fact}
        </div>
      </div>

      

    </div>
  );
};

export default SingleSearchPage;