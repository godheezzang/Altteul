import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import rank_page_bg from "@assets/background/rank_page_bg.svg";
import SearchInput from "@components/Common/SearchInput";
import Dropdown from "@components/Common/Dropdown";
import RankingItem from "@components/Ranking/RankingItem";
import { getRank } from "@utils/api/rankApi";
import type { RankApiFilter } from "types/types";

// 메인 랭킹 페이지 컴포넌트
const RankingPage = () => {
  const [searchNickname, setSearchNickname] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [rankings, setRankings] = useState([]);
  const [page, setPage] = useState(0);
  const [ref, inView] = useInView();

  const languageOptions = [
    { id: 0, value: "", label: "전체" },
    { id: 1, value: "PY", label: "Python" },
    { id: 2, value: "JV", label: "Java" },
  ];

  const filter: RankApiFilter = {
    page: page,
    size: 10,
    lang: selectedLanguage,
    tier: null,
    keyword: searchNickname
  };

  useEffect(() => {
    rankListUpdate();
  },[])

  //TODO: 랭킹 목록 불러오기
  const rankListUpdate = async () => {
    const response = await getRank(filter);
    //0부터 가져오면서 page는 계속 증가형태
    
    setRankings([...rankings, ...response.data.rankings]);

    //TODO: API 호출로 랭킹 목록 업데이트
    //TODO: 닉네임과 언어선택 값 가지고 검색 해서 랭킹 목록 뽑아야 함
  };

  useEffect(() => {
    if (inView) {
      setPage((prev) => prev + 1);
      rankListUpdate();
    }
  }, [inView]);

  useEffect(() => {
    
  }, [page]);

  //TODO: 닉네임 검색 부분
  const handleSearch = () => {
    setRankings([]);
    setPage(1);
    rankListUpdate();
  };

  //TODO: 언어 변경 -> 검색 부분
  useEffect(() => {
  }, [selectedLanguage]);

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
            <img src="/src/assets/icon/badge/Badge_08.svg" alt="" />
            <img src="/src/assets/icon/badge/Badge_07.svg" alt="" />
            <img src="/src/assets/icon/badge/Badge_05.svg" alt="" />
            <img src="/src/assets/icon/badge/Badge_04.svg" alt="" />
            <img src="/src/assets/icon/badge/Badge_01.svg" alt="" />
          </div>
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
              placeholder="닉네임 검색"
              onSearch={handleSearch}
              width="12vw"
            />
          </div>
        </div>
        <div className="">
          {/* grid grid-cols-5 */}
          <div className="grid grid-cols-5 rounded-md  py-4 px-6 bg-primary-black text-primary-white text-center">
            <div className="grid justify-items-start ml-5">순위</div>
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
        </div>
        <div ref={ref} className="h-10" /> {/* Intersection Observer 타겟 */}
      </div>
    </div>
  );
};

export default RankingPage;
