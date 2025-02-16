import React, { useState, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import rank_page_bg from "@assets/background/rank_page_bg.svg";
import SearchInput from "@components/Common/SearchInput";
import Dropdown from "@components/Common/Dropdown";
import RankingItem from "@components/Ranking/RankingItem";
import { getRank } from "@utils/Api/rankApi";
import type { RankApiFilter, RankingResponse } from "types/types";
import { badges, BadgeFilter } from "@components/Ranking/BadgeFilter";

// 메인 랭킹 페이지 컴포넌트
const RankingPage = () => {
  const [searchNickname, setSearchNickname] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [tier, setTier] = useState<number | null>(null);
  const [rankings, setRankings] = useState([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0,
    delay:500
  });

  const languageOptions = [
    { id: 0, value: "", label: "전체" },
    { id: 1, value: "PY", label: "Python" },
    { id: 2, value: "JV", label: "Java" },
  ];
  
  const filter: RankApiFilter = useMemo(() => ({
    page,
    size: 10,
    lang: selectedLanguage,
    tierId: tier,
    nickname: searchNickname
  }), [page, selectedLanguage, tier, searchNickname]);

  const resetPagination = () => {
    setPage(0);
    setRankings([]);
    setLast(false);
  };


  const rankListUpdate = async () => {
    if (isLoading || last) return;
    
    try {
      setIsLoading(true);
      const response: RankingResponse = await getRank(filter);
      
      // 백엔드로부터 받은 페이지네이션 정보 업데이트
      setLast(response.data.last);
      
      if (page === 0) {
        setRankings(response.data.rankings);
      } else {
        setRankings(prev => [...prev, ...response.data.rankings]);
      }
    } catch (error) {
      console.error('Failed to fetch rankings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 초기 로딩
  useEffect(() => {
    rankListUpdate();
  }, []);

  
  useEffect(() => {
    if (inView && !isLoading && !last) {
      rankListUpdate();
      setPage(prev => prev + 1);
    }
  }, [inView, isLoading, last]);
  
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    resetPagination();
  };
  
  const handleTier = (tierId: number) => {
    setTier(prevTier => {
      const newTier = prevTier !== tierId ? tierId : null;
      resetPagination();
      rankListUpdate();
      return newTier;
    });
  };
  
  const handleSearch = () => {
    resetPagination();
    rankListUpdate();
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url(${rank_page_bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black/30 min-h-screen mt-10"></div>

      <div className="relative z-10 max-w-6xl mx-auto py-8 px-4 w-3/5">
        <div className="flex justify-between items-center mb-2 mt-12">
          <div className="flex gap-3">
          {badges.slice(1).reverse().map((badge) => (
            <BadgeFilter
            key={badge.id}
            tierId={badge.id}
            onClick={handleTier}
            selectedTier={tier}
            />
          ))}
          </div>
          <div className="flex gap-3">
            <Dropdown
              options={languageOptions}
              value={selectedLanguage}
              onChange={handleLanguageChange}
              width="6.5vw"
            />
            <SearchInput
              value={searchNickname}
              onChange={(e) => setSearchNickname(e.target.value)}
              placeholder="닉네임 검색"
              onSearch={handleSearch}
              width="12vw"
            />
          </div>
        </div>
        <div className="">
          {/* grid grid-cols-5 */}
          <div className="grid grid-cols-[0.8fr_2fr_1fr_1fr_1fr] rounded-md  py-4 px-6 bg-primary-black text-primary-white text-center">
            <div className="grid justify-items-start ml-5 text-center">순위</div>
            <div>플레이어</div>
            <div>순위 변동</div>
            <div>랭킹 점수</div>
            <div>선호 언어</div>
          </div>
          {rankings.map((ranking) => (
            <RankingItem
              key={`${ranking.userId}-${ranking.rank}`}
              data={ranking}
            />
          ))}
          
          {isLoading && (
            <div className="text-center py-4 text-primary-white">불러오는 중...</div>
          )}
          
        </div>
        {!last && <div ref={ref} className="h-20" />}
      </div>
    </div>
  );   
};

export default RankingPage;