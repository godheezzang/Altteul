import React from "react";
import { useUserSearch } from "contexts/UserSearchContext";
import { User } from "mocks/searchUserData";

type SearchBarProps = {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void | boolean; 
};

const UserSearchBar = ({ 
  placeholder, 
  value, 
  onChange, 
  onSearch 
}: SearchBarProps) => {
  const { searchQuery, handleSearch, searchResults } = useUserSearch();

  const currentQuery = value ?? searchQuery;
  const currentHandleSearch = onChange 
    ? (e: React.ChangeEvent<HTMLInputElement>) => onChange(e)
    : (e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (onSearch) {
          onSearch();
        } else {
          handleSearch(currentQuery);
        }
      }
    };

  return (
    <div className="relative mb-5">
      <input
        type="text"
        value={currentQuery}
        onChange={currentHandleSearch}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="friend-input pr-10 py-2 pl-4 border border-primary-orange rounded-md w-full text-primary-black"
      />
      <button
        onClick={() => onSearch ? onSearch() : handleSearch(currentQuery)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-orange text-xl"
      >
        <img
          src="src/assets/icon/Search_orange.svg"
          alt="search"
          className="w-5 h-5"
        />
      </button>

      {/* 실시간 검색 결과 드롭다운 */}
      {currentQuery && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-gray-06 border border-primary-orange rounded-md shadow-lg">
          {searchResults.map((user: User) => (
            <div
              key={user.friendId}
              className="px-4 py-2 hover:bg-gray-04 cursor-pointer text-primary-white"
            >
              <div className="flex items-center gap-2">
                <img
                  src={user.profileImg}
                  alt="프로필"
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.nickname}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchBar;