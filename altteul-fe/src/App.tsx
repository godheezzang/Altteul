import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import SelectPage from "./pages/match/SelectPage";
import SingleSearchPage from "./pages/match/SingleSearchPage";
import SingleFinalPage from "./pages/match/SingleFinalPage";
import TeamcompositionPage from "./pages/match/TeamcompositionPage";
import TeamSerchPage from "./pages/match/TeamSerchPage";
import TeamFinalPage from "./pages/match/TeamFinalPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/select" element={<SelectPage />} />
        <Route path="/single-search" element={<SingleSearchPage />} />
        <Route path="/single-final" element={<SingleFinalPage />} />
        <Route path="/team-composition" element={<TeamcompositionPage />} />
        <Route path="/team-search" element={<TeamSerchPage />} />
        <Route path="/team-final" element={<TeamFinalPage />} />
      </Routes>
    </Router>
  );
}

export default App;
