import React, { useState } from "react";
import { loginUser } from "@utils/api/auth";
import Modal from "@components/Common/modal/Modal";
import Input from "@components/Common/Input/Input";
import Button from "@components/Common/Button/Button";
import axios from "axios";

const LoginModal = ({ isOpen = false, onClose = () => {} }) => {
  const [form, setForm] = useState({ id: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("handleSubmit 실행됨");
    console.log("전송할 데이터:", form);

    try {
      const response = await loginUser(form.id, form.password);
      console.log("로그인 성공:", response);

      if (!response) {
        throw new Error("서버 응답이 없습니다.");
      }

      console.log("전체 응답:", response);

      // headers에서 토큰을 가져오거나, data에서 가져오기
      const token = response.headers.authorization || response.data?.token;
      if (!token) {
        throw new Error("토큰이 응답에 포함되지 않았습니다");
      }

      // 토큰 저장 - 로컬에
      localStorage.setItem("token", token);
      console.log("토큰 저장 완료:", token);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="로그인">
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="id"
          placeholder="아이디를 입력해주세요"
          value={form.id}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="비밀번호를 입력해주세요"
          value={form.password}
          onChange={handleChange}
        />
        {error && <p>{error}</p>}

        <Button type="submit" width="100%" height="50px">
          로그인
        </Button>
      </form>
    </Modal>
  );
};

export default LoginModal;
