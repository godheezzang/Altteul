import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@stores/authStore";

const GithubCallback = () => {
  const navigate = useNavigate();
  const { setToken, setUserId } = useAuthStore();

  useEffect(() => {
    // URL에서 토큰과 userId를 가져옴
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");

    console.log("받은 토큰:", token);
    console.log("받은 userId:", userId);

    if (token && userId) {
      // Zustand 스토어에 저장
      setToken(token);
      setUserId(userId);

      // 메인 페이지로 리다이렉트
      navigate("/");
    } else {
      // 에러 처리
      console.error("GitHub 로그인 실패: 토큰 또는 userId가 없습니다.");
      navigate("/login");
    }
  }, []);

  return <div>GitHub 로그인 처리중...</div>;
};

export default GithubCallback;
