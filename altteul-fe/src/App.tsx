import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import SelectPage from "./pages/match/SelectPage";
import SingleSearchPage from "./pages/match/SingleSearchPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/select" element={<SelectPage />} />
        <Route path="/SingleSearch" element={<SingleSearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
