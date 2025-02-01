import { Link } from "react-router-dom";
import { Button } from "../components";

const Main = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome to Main Page</h1>
      <Link to="/select">
        <Button width="300px" height="40px" fontSize="18px">
          Go to Matching Select Page
        </Button>
      </Link>
    </div>
  );
};

export default Main;
