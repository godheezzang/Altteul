import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import MatchingSelectPage from "./pages/match/MatchingSelectPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/select" element={<MatchingSelectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
