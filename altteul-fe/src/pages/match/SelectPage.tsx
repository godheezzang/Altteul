import backgroundImage from "@assets/background/matching_select_bg.svg";
import userIcon from "@assets/icon/User.svg";
import peopleIcon from "@assets/icon/People.svg";
import logo from "@assets/icon/Altteul.svg";
import { Link, useNavigate } from "react-router-dom";
import "@styles/base/colors.css";
import { singleEnter } from "@utils/api/matchApi";
import { useMatchStore } from "@stores/matchStore";

const SelectPage = () => {
  const navigate = useNavigate();
  //TODO: userId, 당장은 임시부여, 이후에 zustand에서 가져오면 될듯
  const userId = 15;
  const { setMatchData, setLoading } = useMatchStore();

  const singleNavigate = async () => {
    setLoading(true); //개인전 버튼 눌렀을 때, finally로 가기 전까지 응답이 오래걸리면 스피너 효과 적용

    try {
      //API 통신으로 방 입장 시의 응답값을 받아옴
      const data = await singleEnter(userId);

      //가져온 데이터를 zustand에 저장(앞으로 계속 이용할 값)
      setMatchData(data);

      //개인전 매칭 페이지 전환
      navigate("/match/single/search")
    }catch(error){
      console.log(error)
      // 에러페이지로 전환
      // navigate()
    } finally {
      setLoading(false);
    }

  };

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
        <button className="flex flex-col items-center w-[150px] h-[150px] rounded-full transition-all duration-500 hover:shadow-[0_0_30px_var(--primary-orange)]"
        onClick={() => singleNavigate()}>
          <img src={userIcon} alt="개인전" className="w-full h-full" />
          <span className="mt-4 text-white text-[32px] font-bold">개인전</span>
        </button>

        {/* 팀전 버튼 링크 */}
        <div className="flex flex-col items-center">
          <Link
            to="/match/team/composition"
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

export default SelectPage;
