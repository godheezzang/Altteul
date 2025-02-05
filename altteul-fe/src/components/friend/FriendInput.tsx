import React from "react";

type FriendInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  onSearch: () => void;
};

const FriendInput = ({
  value,
  onChange,
  placeholder,
  onSearch,
}: FriendInputProps) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="friend-input pr-10 py-2 pl-4 border border-orange-500 rounded-md w-full text-black"
      />
      <button
        onClick={onSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 text-xl"
      >
        버튼
      </button>
    </div>
  );
};

export default FriendInput;
