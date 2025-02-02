// ** 회원가입 모달 컴포넌트 **
// 추가할 것 - 아이디, 닉네임임 중복 확인

import { useState } from "react";

import Input from "@/components/common/Input/Input";
import Button from "@/components/common/Button/Button";
import Modal from "@/components/common/modal/Modal";
import Dropdown from "@/components/common/Drpodown/Dropdown";

import { registerUser } from "@/utils/api";

// 회원가입 모달에 필요한 props
interface SignUpProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal = ({ isOpen, onClose }: SignUpProps) => {
  // 입력 폼 상태
  const [form, setForm] = useState({
    username: "",
    password: "",
    nickname: "",
    mainLang: "",
    profileImg: null as File | null,
  });

  // 에러메시지 상태 추가
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    nickname: "",
    mainLang: "",
    profileImg: "",
  });

  // API 요청 시 발생하는 에러 메시지
  const [apiError, setApiError] = useState("");
  // 로딩 상태 관리 - 추후 로딩 스피너 사용
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값 변경 핸들러 (input 필드 값 바뀔 때 실행)
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 드롭다운 언어 선택
  const handleSelectChange = (selected: string) => {
    setForm({ ...form, mainLang: selected });
  };

  //이미지 파일 업로드 처리
  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      // 파일 확장자 검사
      const allowedExtentions = ["png", "jpg", "jpeg"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtentions.includes(fileExtension)) {
        setErrors((prev) => ({
          ...prev,
          profileImg: "png, jpg, jpeg 파일만 업로드 가능합니다.",
        }));
        return;
      }

      setErrors((prev) => ({ ...prev, profileImg: "" })); // 에러 초기화
      setForm({ ...form, profileImg: file });
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    let newErrors = {
      username: "",
      password: "",
      nickname: "",
      mainLang: "",
      profileImg: "",
    };
    let isValid = true;

    // 아이디 유효성 검사
    if (!/^[a-zA-Z0-9]{5,8}$/.test(form.username)) {
      newErrors.username =
        "아이디는 영문과 숫자의 조합으로 5자 이상, 8자 이하여야 합니다.";
      isValid = false;
    }

    // 비밀번호 유효성 검사사
    if (
      form.password.length < 8 ||
      !/\d/.test(form.password) ||
      !/[a-zA-Z]/.test(form.password)
    ) {
      newErrors.password =
        "비밀번호는 영문과 숫자를 포함하여 8자 이상이어야 합니다.";
      isValid = false;
    }

    // 닉네임 유효성 검사
    // 공백포함 안됨
    if (/\s/.test(form.nickname)) {
      newErrors.nickname = "닉네임에 공백을 포함할 수 없습니다.";
      isValid = false;
    }

    if (form.nickname.length < 2 || form.nickname.length > 8) {
      newErrors.nickname = "닉네임은 2자 이상 8자 이하로 설정해야 합니다.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사 실패 시 중단
    if (!validateForm()) return;

    // 폼 입력값 확인용 console.log
    console.log("입력값:", form);

    // FormData 객체 생성
    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("password", form.password);
    formData.append("nickname", form.nickname);
    formData.append("mainLang", form.mainLang);
    if (form.profileImg) {
      formData.append("profileImg", form.profileImg);
    }

    try {
      setIsSubmitting(true); // 제출 중 상태 활성화

      // API 호출 (mock 응답)
      const response = await registerUser(formData); // api.ts에서 정의한 함수 사용

      // mock 응답 처리
      if (response.status === 201) {
        console.log("회원가입 성공");
        onClose(); // 회원가입 후 모달 닫기

        // 폼 리셋
        setForm({
          username: "",
          password: "",
          nickname: "",
          mainLang: "",
          profileImg: null,
        });

        // 에러 메시지도 초기화
        setErrors({
          username: "",
          password: "",
          nickname: "",
          mainLang: "",
          profileImg: "",
        });
      } else {
        setApiError(response.message || "잘못된 응답입니다.");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생 : ", error);
      setApiError("서버와 연결 할 수 없습니다. 다시 시도하세요.");
    } finally {
      setIsSubmitting(false); // 로딩 끝
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <Input
            name="username"
            type="text"
            placeholder="아이디"
            onChange={handleChange}
            value={form.username}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div>
          <Input
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
            value={form.password}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div>
          <Input
            name="nickname"
            type="text"
            placeholder="닉네임"
            onChange={handleChange}
            value={form.nickname}
          />
          {errors.nickname && <p className="error">{errors.nickname}</p>}
        </div>
        <div>
          <Dropdown
            options={[
              { id: 1, value: "Python" },
              { id: 2, value: "Java" },
            ]}
            value={form.mainLang}
            onChange={handleSelectChange}
          />
          {errors.mainLang && <p className="error">{errors.mainLang}</p>}
        </div>
        <div>
          <input
            type="file"
            name="profileImg"
            onChange={handleFileChange}
            accept="image/png, image/jpg, image/jpeg"
          />
          {errors.profileImg && <p className="error">{errors.profileImg}</p>}
        </div>
        {/* 제출중일때 버튼 비활성화 (추후 로딩스피너 추가할 때 수정예정) */}
        <Button type="submit" width="100%" height="50px" fontSize="16px">
          가입하기
        </Button>
        {apiError && <p className="error">{apiError}</p>}
      </form>
    </Modal>
  );
};

export default SignUpModal;
