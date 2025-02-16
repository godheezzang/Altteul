import { useEffect, useState, useRef } from 'react';
import { searchUsers } from '@utils/Api/userApi';

interface SearchBarProps {
  onSearchResult: (result: any) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearchResult, placeholder = '유저를 검색하세요' }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   console.log('입력중:', value);
  //   setSearchQuery(value);
  // };

  // useEffect(() => {
  //   // 검색어가 공백이면 API 호출 없이 결과를 초기화할 수 있음.
  //   if (searchQuery.trim() === '') {
  //     onSearchResult([]);
  //     return;
  //   }

  //   if (debounceTimeout.current) {
  //     clearTimeout(debounceTimeout.current);
  //   }

  //   debounceTimeout.current = setTimeout(() => {
  //     const fetchData = async () => {
  //       try {
  //         setIsSearching(true);
  //         const response = await searchUsers(searchQuery);
  //         onSearchResult(response.data);
  //       } catch (error) {
  //         console.error('검색 실패:', error);
  //       } finally {
  //         setIsSearching(false);
  //       }
  //     };
  //     fetchData();
  //   }, 500);

  //   return () => {
  //     if (debounceTimeout.current) {
  //       clearTimeout(debounceTimeout.current);
  //     }
  //   };
  // }, [searchQuery, onSearchResult]);

  // return (
  //   <div className="relative p-4">
  //     <input
  //       type="text"
  //       value={searchQuery}
  //       onChange={handleInputChange}
  //       placeholder={placeholder}
  //       className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
  //       disabled={isSearching}
  //     />
  //     {isSearching && (
  //       <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
  //         <span className="text-gray-400">검색중...</span>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default SearchBar;
