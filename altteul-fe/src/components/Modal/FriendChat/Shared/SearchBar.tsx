// src/components/Modal/FriendChat/Shared/SearchBar.tsx
import { useEffect, useState } from 'react';
import Input from '@components/Common/Input';
import useFriendChatStore from '@stores/friendChatStore';
import Magnifier from '@assets/icon/friend/Search.svg';

const SearchBar = () => {
  const fcStore = useFriendChatStore();
  const [inputValue, setInputValue] = useState(fcStore.searchQuery)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    fcStore.setSearchQuery(e.target.value);
  };

  useEffect(() => {
    setInputValue(fcStore.searchQuery)
    if(fcStore.searchQuery !== '') {
      fcStore.setCurrentView('search')
    }
  }, [fcStore.searchQuery])

  const handleSearch = async () => {
    fcStore.setSearchQuery(inputValue);
    fcStore.setCurrentView('search')
  };

  //엔터 눌렀을 때 이벤트
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 컴포넌트가 언마운트될 때 검색어 초기화
  useEffect(() => {
    return () => {
      fcStore.setSearchQuery('');
    };
  }, []);

  return (
    <div className="relative pt-4 px-4 pb-2">
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder = '유저를 검색하세요.'
          name="search"
          className="w-full px-4 rounded-lg text-black h-[2.4rem] focus:ring-3 focus:ring-primary-orange focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity disabled:opacity-50"
          aria-label="검색"
        >
          <img src={Magnifier} alt="검색" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;