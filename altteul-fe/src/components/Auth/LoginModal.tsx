import React, { useState } from 'react';
import { loginUser } from '@utils/Api/auth';
import Modal from '@components/Common/Modal';
import Input from '@components/Common/Input';
import Button from '@components/Common/Button/Button';
import useAuthStore from '@stores/authStore';
import useModalStore from '@stores/modalStore';
import gitHubLogo from '@assets/icon/github_logo.svg';
import { useSocketStore } from '@stores/socketStore';

const LoginModal = ({ isOpen = false, onClose = () => {} }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { setToken, setUserId } = useAuthStore();
  const { openModal, closeModal } = useModalStore();
  const { connect, resetConnection } = useSocketStore();

  const handleSignUpClick = () => {
    closeModal();
    openModal('signup');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!form.username.trim() || !form.password.trim()) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await loginUser(form.username, form.password);
      const token = response.headers?.authorization || response.headers?.['authorization'];
      const userId = response.headers?.userid || response.headers?.['userid'];
      const cleanToken = token.replace(/^Bearer\s+/i, '');
      setToken(cleanToken);
      setUserId(userId.toString());
      resetConnection()  // 연결 전 소켓 초기화
      connect() //로그인 성공시 소켓 연결
      closeModal();
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  // 깃허브 로그인
  const handleGithubLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      height="29rem"
      title="알뜰 로그인"
      className="bg-primary-white"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          type="text"
          name="username"
          placeholder="아이디를 입력해 주세요"
          value={form.username}
          className="mt-2 w-[22rem] mt-9"
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

        <Button type="submit" className="h-[2.8rem] w-full hover:brightness-90">
          로그인
        </Button>

        <Button
          type="button"
          backgroundColor="gray-01"
          fontColor="gray-04"
          className="h-[2.8rem] w-full hover:brightness-90 bg-gray-01 text-gray-04"
          onClick={handleSignUpClick}
        >
          회원가입
        </Button>
        {/* 
        <a
          href="#"
          className="text-right text-gray-03 cursor-pointer underline hover:font-semibold"
        >
          비밀번호 재설정
        </a> */}

        <Button
          onClick={handleGithubLogin}
          type="button"
          backgroundColor="primary-black"
          className="h-[2.8rem] w-[22rem]  hover:brightness-110"
          img={gitHubLogo}
        >
          github로 간편하게 시작하기
        </Button>
      </form>
    </Modal>
  );
};

export default LoginModal;
