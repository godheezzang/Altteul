import badge from "@assets/icon/Badge_09.svg";
import rank_up from "@assets/icon/rank_up.svg";
import rank_down from "@assets/icon/rank_down.svg";

// 랭킹 행 컴포넌트
const RankingRow = ({ data }) => {
  const { userId, nickname, mainLang, rank, rankPoint, tierId, rankChange } =
    data;

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getLanguageDisplay = (lang: string) => {
    return lang === "JV" ? "Java" : "Python";
  };

  const getRankChangeDisplay = () => {
    if (rankChange === 0) return <div>-</div>;
    if (rankChange > 0)
      return (
        <div className="flex items-center">
          <div>(</div>
          <img src={rank_up} alt="상승" />
          <div>{rankChange})</div>
        </div>
      );
    return (
      <div className="flex items-center">
        <div>(</div>
        <img src={rank_down} alt="하강" className="" />
        <div>{Math.abs(rankChange)})</div>
      </div>
    );
  };

  return (
    // 한 행
    <div className="grid grid-cols-5 py-4 px-6 bg-primary-black/30 text-primary-white text-center">
      {/* 순위 */}
      <div className="grid justify-items-start ml-5 text-center">{rank}</div>
      {/* 뱃지&닉네임 */}
      <div className="flex">
        <img src={badge} alt="뱃지" className="w-6 h-6" />
        <div>{nickname}</div>
      </div>
      {/* 순위변동 */}
      <div>{getRankChangeDisplay()}</div>
      {/* 랭킹점수 */}
      <div>{formatNumber(rankPoint)}</div>
      {/* 선호언어 */}
      <div>{getLanguageDisplay(mainLang)}</div>
    </div>
  );
};

export default RankingRow;
