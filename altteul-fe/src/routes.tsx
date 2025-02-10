import SingleIdePage from "@pages/Ide/SingleIdePage";
import TeamIdePage from "@pages/Ide/TeamIdePage";
import MainPage from "@pages/Main/MainPage";
import SelectPage from "@pages/Match/SelectPage";
import SingleFinalPage from "@pages/Match/SingleFinalPage";
import SingleSearchPage from "@pages/Match/SingleSearchPage";
import TeamcompositionPage from "@pages/Match/TeamcompositionPage";
import TeamFinalPage from "@pages/Match/TeamFinalPage";
import TeamSearchPage from "@pages/Match/TeamSearchPage";
import RankPage from "@pages/Rank/RankPage";
import UserPage from "@pages/User/UserPage";
import App from "App";
import { createBrowserRouter } from "react-router-dom";
import GithubCallback from "@pages/Auth/GithubCallback";

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
        path: "users",
        children: [
          {
            path: ":userId",
            element: <UserPage />,
          },
        ],
      },
      {
        path: "game",
        children: [
          {
            path: "team",
            element: <TeamIdePage />,
          },
          {
            path: "single",
            element: <SingleIdePage />,
          },
        ],
      },
    ],
  },
  {
    path: "match",
    children: [
      {
        path: "select",
        element: <SelectPage />,
      },
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
]);

export default router;
