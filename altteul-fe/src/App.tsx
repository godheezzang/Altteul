import GameGnb from '@components/Nav/GameGnb';
import MainGnb from '@components/Nav/MainGnb';
import { Outlet, useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();
  const isGamePage = location.pathname.startsWith('/game');

  return (
    <div className='min-h-screen'>
      {isGamePage ? <GameGnb /> : <MainGnb />}
      <main className='bg-primary-black mt-[3.5rem] min-h-[calc(100vh+3.5rem)]'>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
