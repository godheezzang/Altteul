import rank_up from "@assets/icon/rank_up.svg";
import rank_down from "@assets/icon/rank_down.svg";
import {RankingResponse} from "types/types"
// 랭킹 행 컴포넌트
const Rankingitem = ({ data }: { data: RankingResponse }) => {
  const { nickname, mainLang, rank, rankPoint, tierId, rankChange } = data;

  const formatNumber = (num: number) => {
    return num ? num.toLocaleString() : '0';
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

  const getBadgeImage = () => {
    const badge =
      rank == 1
        ? "/src/assets/icon/Badge/Badge_09.svg"
        : tierId == 1
        ? "/src/assets/icon/Badge/Badge_01.svg"
        : tierId == 4
        ? "/src/assets/icon/Badge/Badge_04.svg"
        : tierId == 5
        ? "/src/assets/icon/Badge/Badge_05.svg"
        : tierId == 7
        ? "/src/assets/icon/Badge/Badge_07.svg"
        : tierId == 8
        ? "/src/assets/icon/Badge/Badge_08.svg"
        : "";
    return <img src={badge} alt="뱃지" className="w-6 h-6" />;
  };

  return (
    // 한 행
    <div className="grid grid-cols-5 py-4 px-6 bg-primary-black/30 text-primary-white text-center py-6">
      {/* 순위 */}
      <div className="grid justify-items-start ml-5 text-center">{rank}</div>
      {/* 뱃지&닉네임 */}
      <div className="flex">
        <div>{getBadgeImage()}</div>
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

export default Rankingitem;
