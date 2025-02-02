import axios from "axios";

const api = axios.create({
  baseURL: "https:// 실제 API URL로 수정하기.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// 회원가입 API 요청 (mock 응답 사용)
export const registerUser = async (formData: FormData) => {
  try {
    // 실제 요청 대신 mock 응답 사용
    const mockResponse = {
      status: 201, // 성공 상태 코드
      message: "회원가입 성공",
    };

    // 응답 데이터를 반환
    return mockResponse;
  } catch (error) {
    console.error("회원가입 API 요청 실패 : ", error);
    throw new Error("회원가입 요청 실패");
  }
};
