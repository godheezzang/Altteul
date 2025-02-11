import GameGnb from '@components/Nav/GameGnb';
import MainGnb from '@components/Nav/MainGnb';
import { Outlet, useLocation } from 'react-router-dom';
import ModalManager from '@components/common/ModalManager';
import { UserSearchProvider } from 'contexts/UserSearchContext';

const App = () => {
  const location = useLocation();
  const isGamePage = location.pathname.startsWith('/game');

  return (
    <UserSearchProvider>
      <div className="min-h-screen">
        {isGamePage ? <GameGnb /> : <MainGnb />}
        <main className="mt-[3.5rem] bg-primary-black h-[calc(100vh-3.5rem)]">
          <Outlet />
        </main>
        <ModalManager />
      </div>
    </UserSearchProvider>
  );
};

export default App;
