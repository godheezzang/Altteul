import MainPage from "@pages/Main/MainPage";
import SelectPage from "@pages/Match/SelectPage";
import SingleFinalPage from "@pages/Match/SingleFinalPage";
import SingleSearchPage from "@pages/Match/SingleSearchPage";
import TeamcompositionPage from "@pages/Match/TeamcompositionPage";
import TeamFinalPage from "@pages/Match/TeamFinalPage";
import TeamSearchPage from "@pages/Match/TeamSearchPage";
import MyPage from "@pages/User/MyPage";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
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
  {
    path: "game",
    children: [
      {
        path: "team",
      },
    ],
  },
]);

export default router;
