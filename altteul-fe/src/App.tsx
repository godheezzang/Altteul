import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "@pages/Main/Main";
import MatchingSelectPage from "@pages/Match/SelectPage";
import SingleSearchPage from "@pages/Match/SingleSearchPage";
import SingleFinalPage from "@pages/Match/SingleFinalPage";
import TeamcompositionPage from "@pages/Match/TeamcompositionPage";
import TeamSearchPage from "@pages/Match/TeamSearchPage";
import TeamFinalPage from "@pages/Match/TeamFinalPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/select" element={<MatchingSelectPage />} />
        <Route path="/single-search" element={<SingleSearchPage />} />
        <Route path="/single-final" element={<SingleFinalPage />} />
        <Route path="/team-composition" element={<TeamcompositionPage />} />
        <Route path="/team-search" element={<TeamSearchPage />} />
        <Route path="/team-final" element={<TeamFinalPage />} />
      </Routes>
    </Router>
  );
}

export default App;
