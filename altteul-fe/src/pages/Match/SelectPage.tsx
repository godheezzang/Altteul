import backgroundImage from "@assets/background/matching_select_bg.svg";
import userIcon from "@assets/icon/User.svg";
import peopleIcon from "@assets/icon/People.svg";
import logo from "@assets/icon/Altteul.svg";
import "@styles/base/colors.css";
import { useNavigate } from "react-router-dom";
import { singleEnter, teamEnter } from "@utils/Api/matchApi";
import { useMatchStore } from "@stores/matchStore";

const SelectPage = () => {
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));
  const { setLoading } = useMatchStore();

  const NextPage = async (type:string) => {
    setLoading(true); //개인전 버튼 눌렀을 때, finally로 가기 전까지 응답이 오래걸리면 스피너 효과 적용
    try {
      //API로 방 입장 시의 응답값을 받아온 뒤 세션에 저장
      sessionStorage.setItem("matchData", await singleEnter(userId))

      //개인전 입장
      if(type === 'single') {
        navigate("/match/single/search")
      }

      //팀전 입장
      if(type === 'team') {
        navigate(`/match/team/composition`)
      }
    }catch(error){
      console.log(error)
      // 에러페이지로 전환
      // navigate()
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* 컨텐츠 */}
      <div className="relative flex gap-x-[40vh] items-center">
        {/* 개인전 버튼 링크 */}
        <button className="flex flex-col items-center w-[150px] h-[150px] rounded-full transition-all duration-500 hover:shadow-[0_0_30px_var(--primary-orange)]"
        onClick={() => NextPage('single')}>
          <img src={userIcon} alt="개인전" className="w-full h-full" />
          <span className="mt-4 text-white text-[32px] font-bold">개인전</span>
        </button>

        {/* 팀전 버튼 링크 */}
        <button className="flex flex-col items-center w-[150px] h-[150px] rounded-full transition-all duration-500 hover:shadow-[0_0_30px_var(--primary-orange)]"
        onClick={() => NextPage('team')}>
          <img src={peopleIcon} alt="팀전" className="w-full h-full" />
          <span className="mt-4 text-white text-[32px] font-bold">팀전</span>
        </button>
      </div>
    </div>
  );
};

export default SelectPage;
