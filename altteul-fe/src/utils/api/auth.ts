import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// 회원가입 API 요청
export const registerUser = async (formData: FormData) => {
  try {
    console.log("회원가입 요청 시작");
    console.log("요청 데이터:", formData);

    const response = await api.post("register", formData);

    console.log("응답 데이터:", response);

    if (response.status >= 200 && response.status < 300) {
      console.log("회원가입 성공");
      return {
        status: response.status,
        message: response.data.message || "회원가입 성공",
      };
    } else {
      throw new Error(response.data.message || "잘못된 응답");
    }
  } catch (error) {
    console.error("회원가입 API 요청 실패 : ", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log("응답에러 :", error.response);
        console.log("응답 데이터:", error.response.data);
        console.log("응답 상태 :", error.response.status);
      } else if (error.request) {
        console.log("요청 에러:", error.request);
      } else {
        console.log("기타 에러:", error.message);
      }
    } else {
      console.log("알 수 없는 에러 : ", error);
    }
    throw new Error(error.message || "회원가입 요청실패");
  }
};
