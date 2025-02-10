import { extendedMockUsers } from "mocks/searchUserData";
import React, { createContext, useState, ReactNode, useContext } from "react";

// User 타입 정의
type User = {
  friendId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
};

type UserSearchContextType = {
  searchQuery: string;
  searchResults: User[];
  handleSearch: (query: string) => void;
  resetSearch: () => void // 검색 초기화
};


// Context 생성
const UserSearchContext = createContext<UserSearchContextType | null>(null
);

// Custom Hook
export const useUserSearch = () => {
  const context = useContext(UserSearchContext);
  if (context===null) {
    throw new Error("useUserSearch must be used within a UserSearchProvider");
  }
  return context;
};

// Provider 컴포넌트
export const UserSearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // mockUsers 데이터로 검색
    const filteredUsers = extendedMockUsers.filter((user) =>
      user.nickname.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredUsers);
  };


  // 검색 초기화
const resetSearch = () => {
  setSearchQuery("")
  setSearchResults([])
  
}
  return (
    <UserSearchContext.Provider value={{ 
      searchQuery, 
      searchResults, 
      handleSearch,
      resetSearch  // Provider에 resetSearch 함수 추가
    }}>
      {children}
    </UserSearchContext.Provider>
  );
};


