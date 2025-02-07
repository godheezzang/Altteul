import React, { useState } from "react";
import { loginUser } from "@utils/api/auth";
import Modal from "@components/Common/modal/Modal";
import Input from "@components/Common/Input/Input";
import Button from "@components/Common/Button/Button";
import axios from "axios";
import useAuthStore from "@stores/authStore";

const LoginModal = ({ isOpen = false, onClose = () => {} }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { setToken } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("!!!!!!!전송할 데이터:", form);

    try {
      const response = await loginUser(form.username, form.password);
      console.log("로그인 성공:", response);

      if (!response) {
        throw new Error("서버 응답이 없습니다.");
      }

      // headers에서 토큰을 가져오거나, data에서 가져오기
      const token = response.headers.authorization || response.data?.token;
      if (!token) {
        throw new Error("토큰이 응답에 포함되지 않았습니다");
      }

      // zustand에 토큰 저장
      setToken(token);
      console.log("zustand에 토큰 저장 완료:", token);

      onClose();
    } catch (error) {
      console.error("로그인 실패:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data?.message || "로그인 실패!");
        } else {
          setError(error.message);
        }
      } else {
        setError("알 수 없는 오류 발생!");
      }
    }
  };

  // 깃허브 로그인
  const handleGithubLogin = () => {
    // GitHub 로그인 URL로 리다이렉트
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} height="35rem" title="알뜰 로그인">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          type="text"
          name="username"
          placeholder="아이디를 입력해 주세요"
          value={form.username}
          className="mt-2"
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="비밀번호를 입력해 주세요"
          value={form.password}
          onChange={handleChange}
        />
        {error && <p>{error}</p>}

        <Button
          type="submit"
          width="100%"
          height="2.8rem"
          className="bg-primary-orange text-primary-white hover:brightness-90"
        >
          로그인
        </Button>

        <Button
          type="button"
          width="100%"
          height="2.8rem"
          className="bg-gray-01 hover:brightness-90"
        >
          회원가입
        </Button>

        <a
          href="#"
          className="text-right text-gray-03 cursor-pointer underline hover:font-semibold"
        >
          비밀번호 재설정
        </a>

        <Button
          onClick={handleGithubLogin}
          type="button"
          width="100%"
          height="2.8rem"
          className="bg-primary-black text-primary-white mt-8 hover:brightness-110"
          img="src/assets/icon/github_logo.svg"
        >
          github로 간편하게 시작하기
        </Button>
      </form>
    </Modal>
  );
};

export default LoginModal;
