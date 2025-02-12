import SingleIdePage from '@pages/Ide/SingleIdePage';
import TeamIdePage from '@pages/Ide/TeamIdePage';
import MainPage from '@pages/Main/MainPage';
import SelectPage from '@pages/match/SelectPage';
import SingleFinalPage from '@pages/match/SingleFinalPage';
import SingleSearchPage from '@pages/match/SingleSearchPage';
import TeamcompositionPage from '@pages/match/TeamcompositionPage';
import TeamFinalPage from '@pages/match/TeamFinalPage';
import TeamSearchPage from '@pages/match/TeamSearchPage';
import RankPage from '@pages/Rank/RankPage';
import UserPage from '@pages/User/UserPage';
import App from 'App';
import { UserSearchProvider } from 'contexts/UserSearchContext';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <UserSearchProvider>
        <App />
      </UserSearchProvider>
    ),
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'rank',
        element: <RankPage />,
      },
      // 회원
      {
        path: 'users',
        children: [
          {
            path: ':userId',
            element: <UserPage />,
          },
        ],
      },
      {
        path: 'game',
        children: [
          {
            path: 'team',
            element: <TeamIdePage />,
          },
          {
            path: 'single',
            path: 'single/:gameId/:roomId',
            element: <SingleIdePage />,
          },
        ],
      },
    ],
  },
  {
    path: 'match',
    children: [
      {
        path: 'select',
        element: <SelectPage />,
      },
      {
        path: 'select',
        element: <SelectPage />,
      },
      {
        path: 'team',
        children: [
          {
            path: 'composition',
            element: <TeamcompositionPage />,
          },
          {
            path: 'search',
            element: <TeamSearchPage />,
          },
          {
            path: 'final',
            element: <TeamFinalPage />,
          },
        ],
      },
      {
        path: 'single',
        children: [
          {
            path: 'search',
            element: <SingleSearchPage />,
          },
          {
            path: 'final',
            element: <SingleFinalPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
