import useAuthStore from "@stores/authStore";
import { useEffect } from "react";
import LoginModal from "@components/auth/LoginModal"; // 테스트용
import { useState } from "react"; // 테스트용

const MainPage = () => {
  const { setToken, setUserId } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // URL 파라미터 체크
    const params = new URLSearchParams(window.location.search);
    const token = params.get("accessToken");
    const userId = params.get("userId");

    if (token && userId) {
      // 먼저 로컬스토리지와 Zustand에 저장
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      setToken(token);
      setUserId(userId);

      // 저장이 완료된 후 URL 파라미터 제거하고 메인페이지로 리다이렉트
      window.history.replaceState({}, document.title, "/");

      // 모달이 열려있다면 닫기
      setIsLoginModalOpen(false);
    }
  }, [window.location.search]); // URL 변경을 감지하기 위해 dependency 추가

  return (
    <>
      <h1 className="text-primary-white">main</h1>
      <button
        onClick={() => setIsLoginModalOpen(true)}
        className="text-primary-white"
      >
        로그인
      </button>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default MainPage;
