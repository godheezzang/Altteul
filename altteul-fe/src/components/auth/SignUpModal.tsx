// ** 회원가입 모달 컴포넌트 **
// 추가할 것 - 아이디, 닉네임임 중복 확인

import { useState } from "react";

import Input from "@components/common/Input/Input";
import Button from "@components/Common/Button/Button";
import Modal from "@components/common/modal/Modal";
import Dropdown from "@components/Common/Drpodown/Dropdown";

import { registerUser } from "@utils/api/auth";
import {
  validateSignUpForm,
  SignUpFormData,
  ValidationErrors,
} from "@utils/validation";

// 회원가입 모달에 필요한 props
interface SignUpProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModal = ({ isOpen, onClose }: SignUpProps) => {
  // 언어 매핑
  const languageOptions = [
    { id: 1, value: "PY", label: "Python" },
    { id: 2, value: "JV", label: "Java" },
  ];

  // 입력 폼 상태
  const [form, setForm] = useState<SignUpFormData>({
    username: "",
    password: "",
    nickname: "",
    mainLang: "PY",
    profileImg: null,
  });

  // 에러메시지 상태 추가
  const [errors, setErrors] = useState<ValidationErrors>({
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
      setForm({ ...form, profileImg: e.target.files[0] });
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const validationResult = validateSignUpForm(form);
    setErrors(validationResult.errors);
    return validationResult.isValid;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사 실패 시 중단
    if (!validateForm()) return;

    // 폼 입력값 확인용 console.log
    console.log("입력값:", form);

    // 폼 데이터 생성
    const formData = new FormData();

    const requestData = {
      username: form.username,
      password: form.password,
      nickname: form.nickname,
      mainLang: form.mainLang,
    };

    formData.append("request", JSON.stringify(requestData));

    // profileImg는 파일로 추가
    if (form.profileImg) {
      formData.append("profileImg", form.profileImg);
    } else {
      formData.append("profileImg", "");
    }

    try {
      setIsSubmitting(true); // 제출 중 상태 활성화

      // API 호출 (mock 응답)
      const response = await registerUser(formData); // api.ts에서 정의한 함수 사용

      // 성공처리 - 200번대
      if (response.status >= 200 && response.status < 300) {
        console.log("회원가입 성공");
        onClose();

        // 폼 리셋
        setForm({
          username: "",
          password: "",
          nickname: "",
          mainLang: "PY",
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
      setApiError(
        error.message || "서버와 연결 할 수 없습니다. 다시 시도하세요."
      );
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
            options={languageOptions}
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
          {isSubmitting ? "처리중..." : "가입하기"}
        </Button>
        {apiError && <p className="error">{apiError}</p>}
      </form>
    </Modal>
  );
};

export default SignUpModal;
