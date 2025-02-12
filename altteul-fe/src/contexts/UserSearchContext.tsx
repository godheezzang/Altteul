import React, { createContext, useContext, useState, useCallback } from 'react';
import { searchUser } from '@utils/Api/userApi';
import type { SearchedUser } from 'types/types';

interface UserSearchContextType {
  searchQuery: string;
  searchResults: SearchedUser[];
  isLoading: boolean;
  error: string | null;
  handleSearch: (query: string) => Promise<void>;
}

const UserSearchContext = createContext<UserSearchContextType | undefined>(undefined);

export const UserSearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchUser(query);
      if (response.status === 200) {
        // 단일 사용자 응답을 배열로 변환
        setSearchResults([response.data]);
      } else {
        throw new Error('검색 결과를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 검색 실패:', error);
      setError(error instanceof Error ? error.message : '검색에 실패했습니다.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserSearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        isLoading,
        error,
        handleSearch,
      }}
    >
      {children}
    </UserSearchContext.Provider>
  );
};

export const useUserSearch = () => {
  const context = useContext(UserSearchContext);
  if (context === undefined) {
    throw new Error('useUserSearch must be used within a UserSearchProvider');
  }
  return context;
};
