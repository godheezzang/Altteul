import backgroundImage from '@assets/background/matching_select.svg';
import userIcon from '@assets/icon/User.svg';
import peopleIcon from '@assets/icon/people.svg';
import logo from '@assets/icon/Altteul.svg';
import { Link } from 'react-router-dom';
import '@styles/base/colors.css';

const MatchingSelectPage = () => {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* 로고 링크 */}
      <Link 
        to="/"
        className="absolute top-8 left-8 transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]"
      >
        <img src={logo} alt="홈으로" className="w-full h-full" />
      </Link>

      {/* 컨텐츠 */}
      <div className="relative flex gap-x-[40vh] items-center">
        {/* 개인전 버튼 링크 */}
        <div className="flex flex-col items-center">
          <Link 
            to="/single-search"
            className="w-[150px] h-[150px] rounded-full transition-all duration-500 hover:shadow-[0_0_30px_var(--primary-orange)]"
          >
            <img src={userIcon} alt="개인전" className="w-full h-full" />
          </Link>
          <span className="mt-4 text-white text-[32px] font-bold">개인전</span>
        </div>

        {/* 팀전 버튼 링크 */}
        <div className="flex flex-col items-center">
          <Link 
            to="/team-composition"
            className="w-[150px] h-[150px] rounded-full transition-all duration-500 hover:shadow-[0_0_30px_var(--primary-orange)]"
          >
            <img src={peopleIcon} alt="팀전" className="w-full h-full" />
          </Link>
          <span className="mt-4 text-white text-[32px] font-bold">팀전</span>
        </div>
      </div>
    </div>
  );
};

export default MatchingSelectPage;