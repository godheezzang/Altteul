import Layout from "@components/Layout/Layout";
import MainPage from "@pages/Main/MainPage";
import SelectPage from "@pages/Match/SelectPage";
import SingleFinalPage from "@pages/Match/SingleFinalPage";
import SingleSearchPage from "@pages/Match/SingleSearchPage";
import TeamcompositionPage from "@pages/Match/TeamcompositionPage";
import TeamFinalPage from "@pages/Match/TeamFinalPage";
import TeamSearchPage from "@pages/Match/TeamSearchPage";
import RankPage from "@pages/Rank/RankPage";
import MyPage from "@pages/User/MyPage";
import App from "App";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "rank",
        element: <RankPage />,
      },
      // 회원
      {
        path: "user",
        children: [
          {
            path: "mypage",
            element: <MyPage />,
          },
        ],
      },
    ],
  },
  {
    path: "game",
    children: [
      {
        path: "matching",
        children: [
          {
            path: "select",
            element: <SelectPage />,
          },
          {
            path: "team",
            children: [
              {
                path: "composition",
                element: <TeamcompositionPage />,
              },
              {
                path: "search",
                element: <TeamSearchPage />,
              },
              {
                path: "final",
                element: <TeamFinalPage />,
              },
            ],
          },
          {
            path: "single",
            children: [
              {
                path: "search",
                element: <SingleSearchPage />,
              },
              {
                path: "final",
                element: <SingleFinalPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
