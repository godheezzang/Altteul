import React from "react";

type Friend = { // 이거 꼭 필요한가?
  friendId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
};

type FriendInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  onSearch: () => void;
  realTimeResults?: Friend[];
};

const FriendInput = ({
  value,
  onChange,
  placeholder,
  onSearch,
  realTimeResults = [],
}: FriendInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="relative mb-5">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="friend-input pr-10 py-2 pl-4 border border-primary-orange rounded-md w-full text-primary-black"
      />
      <button
        onClick={onSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-orange text-xl"
      >
        <img
          src="src/assets/icon/Search_orange.svg"
          alt="search"
          className="w-5 h-5"
        />
      </button>

      {/* 실시간 검색 결과 드롭다운 */}
      {value && realTimeResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-gray-06 border border-primary-orange rounded-md shadow-lg">
          {realTimeResults.slice(0, 5).map((friend) => (
            <div
              key={friend.friendId}
              className="px-4 py-2 hover:bg-gray-04 cursor-pointer text-primary-white"
            >
              {friend.nickname}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendInput;
