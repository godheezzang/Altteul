import SignUpModal from "@components/Auth/SignUpModal";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const MainPage = () => {
  // 회원가입 모달 PATH 사용 위한 로직 곧 삭제함
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/user/signup") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [location]);

  const closeModal = () => {
    setIsOpen(false);
    window.history.pushState(null, "", "/");
  };
  return (
    <>
      <h1>main</h1>
      <SignUpModal isOpen={isOpen} onClose={closeModal} />
      <Outlet />
    </>
  );
};

export default MainPage;
