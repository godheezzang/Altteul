// src/components/Modal/FriendChat/Shared/SearchBar.tsx
import { useEffect, useState } from 'react';
import Input from '@components/Common/Input';
import useFriendChatStore from '@stores/friendChatStore';
import Magnifier from '@assets/icon/friend/Search_orange.svg';
import { searchUsers } from '@utils/Api/userApi';

const SearchBar = () => {
  const fcStore = useFriendChatStore();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = async () => {
    fcStore.setSearchQuery(inputValue);
    fcStore.setCurrentView('search')
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 컴포넌트가 언마운트될 때 검색어 초기화
  useEffect(() => {
    return () => {
      fcStore.setSearchQuery('');
      setInputValue('');
    };
  }, []);

  return (
    <div className="relative p-4">
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          // onKeyPress={handleKeyPress}
          placeholder = '유저를 검색하세요.'
          name="search"
          className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white h-[2.5rem] pr-12 focus:ring-3 focus:ring-primary-orange focus:outline-none"
          // disabled={isLoading}
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