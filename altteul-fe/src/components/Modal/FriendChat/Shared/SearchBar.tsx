import { useState } from 'react';
import { searchUsers } from '@utils/Api/userApi';
import Input from '@components/Common/Input';

interface SearchBarProps {
  onSearchResult: (result: any) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearchResult, placeholder = '유저를 검색하세요' }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('입력중:', value);
    setSearchQuery(value);
  };

  return (
    <div className="relative p-4">
      <Input
        value={searchQuery}
        onChange={handleInputChange}
        name=""
        className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white h-[2.5rem]"
      />

      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
      />

    </div>
  );
};

export default SearchBar;
