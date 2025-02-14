import GameGnb from '@components/Nav/GameGnb';
import MainGnb from '@components/Nav/MainGnb';
import { Outlet, useLocation } from 'react-router-dom';
import ModalManager from '@components/Common/ModalManager';
import { UserSearchProvider } from 'contexts/UserSearchContext';
import { useEffect } from 'react';
import { useSocketStore } from '@stores/socketStore';

const App = () => {
  const location = useLocation();
  const isGamePage = location.pathname.startsWith('/game');
  const { connect } = useSocketStore();

  //로그인 시 소켓 연결 유지
  useEffect(() => {
    const wasConnected = sessionStorage.getItem('wsConnected') === 'true';
    const accessToken = sessionStorage.getItem('token');
    if (wasConnected && !!accessToken) {
      connect();
    }
  }, []);

  const hideNavigation = [
    '/match/team/composition',
    '/match/team/search',
    '/match/team/final',
    '/match/single/search',
    '/match/single/final',
  ].includes(location.pathname);

  const transparentNavigation = ['/match/select', '/rank', '/users/:userId'].includes(
    location.pathname
  );

  return (
    <UserSearchProvider>
      <div className="min-h-screen">
        {!hideNavigation && (isGamePage ? <GameGnb /> : <MainGnb />)}
        <main
          className={`${transparentNavigation ? '' : 'mt-[3.5rem]'} bg-primary-black h-[calc(100vh-3.5rem)]`}
        >
          <Outlet />
        </main>
        <ModalManager />
      </div>
    </UserSearchProvider>
  );
};

export default App;
