import AnimatedCodeEditor from "@components/Main/AnimatedCodeEditor";
import useAuthStore from "@stores/authStore";
import { useEffect, useState } from "react";
import throttle from "lodash/throttle";

const MainPage = () => {
  const { setToken, setUserId } = useAuthStore();
  const [showGameMethod, setShowGameMethod] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // URL 파라미터 처리
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("accessToken");
    const userId = params.get("userId");

    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      setToken(token);
      setUserId(userId);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = throttle(() => {
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      console.log("scrollTop:", scrollTop);
      console.log("windowHeight * 0.7:", windowHeight * 0.7);

      if (scrollTop > windowHeight * 0.7) {
        // 스크롤이 아래로 내려가면 "게임 방법" 표시
        if (scrollTop > lastScrollTop) {
          setShowGameMethod(true);
        }
      } else {
        // 스크롤이 위로 올라가면 "게임 방법" 숨김
        if (scrollTop < lastScrollTop) {
          setShowGameMethod(false);
        }
      }

      // 마지막 스크롤 위치 업데이트
      setLastScrollTop(scrollTop);
    }, 200);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <div>
      {/* 첫 번째 섹션 */}
      <section className="h-screen relative">
        <AnimatedCodeEditor />
        <div className="absolute top-0 bottom-0 right-4 flex flex-col justify-center text-primary-white text-4xl font-bold z-20">
          <p className="px-4 py-2">알뜰?</p>
          <p className="px-4 py-2">알고리즘 한 판</p>
          <p className="px-4 py-2">뜰래?</p>
        </div>
      </section>

      {/* 두 번째 섹션 */}
      <section
        className={`min-h-[50rem] p-8 transition-opacity duration-500 ${
          showGameMethod
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <h2 className="text-3xl font-bold mb-4 text-primary-white">
          게임 방법
        </h2>
      </section>
    </div>
  );
};

export default MainPage;
