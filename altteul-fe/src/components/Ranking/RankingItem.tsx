import rank_up from "@assets/icon/rank_up.svg";
import rank_down from "@assets/icon/rank_down.svg";
import {Ranking} from "types/types"
// 랭킹 행 컴포넌트
const RankingItem = ({ data }: { data: Ranking }) => {
  const { nickname, lang, ranking, point, tierId, rankChange } = data;

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
      ranking == 1
        ? "/src/assets/icon/Badge/0_onlyone.svg"
        : tierId == 1
        ? "/src/assets/icon/Badge/1_bronze.svg"
        : tierId == 2
        ? "/src/assets/icon/Badge/2_silver.svg"
        : tierId == 3
        ? "/src/assets/icon/Badge/3_gold.svg"
        : tierId == 4
        ? "/src/assets/icon/Badge/4_platinum.svg"
        : tierId == 5
        ? "/src/assets/icon/Badge/5_diamond.svg"
        : "";
    return <img src={badge} alt="뱃지" className="w-6 h-6" />;
  };

  return (
    // 한 행
    <div className="grid grid-cols-[0.8fr_2fr_1fr_1fr_1fr] py-4 px-6 bg-primary-black/60 text-primary-white text-center py-6">
      {/* 순위 */}
      <div className="grid justify-items-start ml-5 text-center">{ranking}</div>
      {/* 뱃지&닉네임 */}
      <div className="flex items-center">
        <div>{getBadgeImage()}</div>
        <div>{nickname}</div>
      </div>
      {/* 순위변동 */}
      <div>{getRankChangeDisplay()}</div>
      {/* 랭킹점수 */}
      <div>{formatNumber(point)}</div>
      {/* 선호언어 */}
      <div>{getLanguageDisplay(lang)}</div>
    </div>
  );
};

export default RankingItem;
