import React, { useState, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import rank_page_bg from "@assets/background/rank_page_bg.svg";
import SearchInput from "@components/Common/SearchInput";
import Dropdown from "@components/Common/Dropdown";
import RankingItem from "@components/Ranking/RankingItem";
import { getRank } from "@utils/Api/rankApi";
import type { RankApiFilter, Ranking, RankingResponse } from "types/types";
import { badges, BadgeFilter } from "@components/Ranking/BadgeFilter";
import useAuthStore from "@stores/authStore";

// 메인 랭킹 페이지 컴포넌트
const RankingPage = () => {
  const [searchNickname, setSearchNickname] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [userRanking, setUserRanking] = useState<Ranking | null>(null);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [rankings, setRankings] = useState<Array<Ranking>>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0,
    delay: 500,
  });

  const languageOptions = [
    { id: 0, value: "", label: "전체" },
    { id: 1, value: "PY", label: "Python" },
    { id: 2, value: "JV", label: "Java" },
  ];

  const filter: RankApiFilter = {
      page,
      size: 10,
      lang: selectedLanguage,
      tierId: selectedTier,
      nickname: searchNickname,
  }

  const resetPagination = () => {
    setPage(0);
    setRankings([]);
    setLast(false);
  };

  const fetchRankList = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const rankingResponse: RankingResponse = await getRank(filter);
      setLast(rankingResponse.data.last);
      if (page === 0) {
        setRankings(rankingResponse.data.rankings);
      } else {
        setRankings((prev) => [...prev, ...rankingResponse.data.rankings]);
      }
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Failed to fetch rankings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로딩
  useEffect(() => {
    fetchRankList();
  }, []);

  // 무한 스크롤
  useEffect(() => {
    if (inView && !isLoading && !last && page > 0) {
      fetchRankList();
    }
  }, [inView, isLoading, last, page]);
  
  useEffect(() => {
    if (page === 0) {
        fetchRankList();
    }
  }, [page]);
  // 티어 선택 핸들러
  const handleTier = (tierId: number) => {
    console.log(tierId)
    setSelectedTier((prev) => (prev === tierId ? null : tierId));
    resetPagination();
  };

  const handleSearch = () => {
    console.log(searchNickname);
    resetPagination();
  }

  const userId = useAuthStore.getState().userId;
  const firstRanking = rankings[0]; // 첫 번째 랭킹 데이터
  const isUser = firstRanking?.userId === userId; // 첫 번째가 로그인 유저인지 확인
  console.log(userId+" "+firstRanking?.userId);
  return (
    <div className="relative min-h-screen">
      {/* 배경 이미지 */}
      <div
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${rank_page_bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          opacity: 0.5,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto py-[100px] px-4 w-3/5">
        <div className="flex justify-between items-center mb-2 mt-12">
          <div className="flex space-x-3">
            {badges
              .slice(1)
              .reverse()
              .map((badge) => (
                <BadgeFilter
                  key={badge.id}
                  tierId={badge.id}
                  selectedTier={selectedTier} // 추가
                  onClick={handleTier}
                />
              ))}
          </div>

          {/* 언어 및 닉네임 검색 */}
          <div className="flex gap-3">
            <Dropdown
              options={languageOptions}
              value={selectedLanguage}
              onChange={setSelectedLanguage}
              width="6.5vw"
            />
            <SearchInput
              value={searchNickname}
              onChange={(e) => setSearchNickname(e.target.value)}
              onClick={handleSearch}
              placeholder="닉네임 검색"
              width="12vw"
            />
          </div>
        </div>

        {/* 랭킹 리스트 */}
        <div className="rounded-md">
          <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] py-4 bg-primary-black gray-01 text-center text-base">
            <div>순위</div>
            <div>Player</div>
            <div>순위변동</div>
            <div>랭킹점수</div>
            <div>선호언어</div>
            <div>평균통과율</div>
          </div>
          <>
            {/* 첫 번째 아이템 */}
            {firstRanking && (
              <RankingItem
                key={`${firstRanking.userId}-${firstRanking.ranking}`}
                data={firstRanking}
                className={`grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] py-4 text-center text-base border-b-[1px] ${
                  isUser ? "bg-primary-black text-primary-orange" : "bg-primary-black gray-1"
                }`}
              />
            )}

            {/* 나머지 아이템들 */}
            {rankings.slice(1).map((ranking: Ranking) => (
              <RankingItem
                key={`${ranking.userId}-${ranking.ranking}`}
                data={ranking}
                className={`grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr] py-4 bg-primary-black gray-1 text-center text-base border-b-[1px]`}
              />
            ))}
          </>

          {isLoading && (
            <div className="text-center py-4 text-primary-white">
              불러오는 중...
            </div>
          )}
        </div>

        {!last && <div ref={ref} className="h-20" />}
      </div>
    </div>
  );
};

export default RankingPage;
