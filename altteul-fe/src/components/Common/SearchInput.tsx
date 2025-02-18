import React from 'react';
import searchIcon from '@assets/icon/friend/Search.svg';

type SearchInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  placeholder: string;
  width?: string;
  height?: string;
};

const SearchInput = ({
  value,
  onChange,
  onClick,
  width,
  height,
  placeholder,
}: SearchInputProps) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        style={{ width, height }}
        placeholder={placeholder}
        className="pr-10 py-2 pl-4 border border-orange-500 rounded-md text-black"
      />
      <button
        onClick={onClick}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 text-xl"
      >
        <img src={searchIcon} alt="검색" />
      </button>
    </div>
  );
};

export default SearchInput;
