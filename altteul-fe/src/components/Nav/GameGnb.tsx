import useGameStore from "@stores/useGameStore";
import { useNavigate } from "react-router-dom";
import logo from "@assets/icon/Altteul.svg";

const GameGnb = () => {
  const navigate = useNavigate();
  const { problemId, problemTitle } = useGameStore();

  const handleNavigate = () => {
    navigate("./");
  };

  // TODO: 팀전/개인전 구분하는 로직 수정
  const isTeam = true;
  return (
    <>
      <nav className="fixed top-0 w-full bg-primary-black z-50 px-8 text-sm">
        <div className="flex item-center justify-between h-[3.5rem]">
          {/* 좌측 영역 */}
          <div className="flex items-center mr-auto">
            <button onClick={() => navigate("/")} className="flex items-center">
              <img src={logo} alt="홈으로" className="w-5/6" />
            </button>
            <div className="flex space-x-1 item-center h-full gap-1">
              <p className="py-4 text-gray-02 font-semibold">알고리즘 배틀 &gt;</p>
              {isTeam ? (
                <>
                  <p className="py-4 text-gray-02 font-semibold">팀전 &gt;</p>
                </>
              ) : (
                <>
                  <p className="py-4 text-gray-02 font-semibold">개인전 &gt;</p>
                </>
              )}
              <p className="py-3 text-primary-white font-semibold text-lg">
                {problemId}. {problemTitle}
              </p>
            </div>
          </div>

          {/* 우측 영역 */}
          {/* TODO: 나가기 클릭 시 진짜 나갈건지 확인하는 모달 추가 */}
          <div className="flex items-center space-x-4 ml-auto">
            <button onClick={handleNavigate} className="px-3 py-1 bg-primary-orange text-primary-white rounded-lg hover:bg-secondary-orange hover:text-gray-01 transition-colors">
              나가기
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default GameGnb;
