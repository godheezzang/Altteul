import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",
  withCredentials: true,
});

// 회원가입 API 요청
export const registerUser = async (formData: FormData) => {
  try {
    console.log("회원가입 요청 시작");
    console.log("요청 데이터:", formData);

    const response = await api.post("register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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

// 로그인 API 요청
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post(
      "login",
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("서버 응답 전체:", response);
    console.log("응답 헤더:", response.headers);

    if (response.status >= 200 && response.status < 300) {
      console.log("로그인 성공");

      return response;
    } else {
      throw new Error(response.data.message || "잘못된 응답");
    }
  } catch (error) {
    console.error("로그인 API 요청 실패 : ", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("응답 에러 상세:");
        console.error("- 상태 코드:", error.response.status);
        console.error("- 응답 데이터:", error.response.data);
        console.error("- 응답 헤더:", error.response.headers);
      } else if (error.request) {
        console.error("요청은 전송되었으나 응답을 받지 못함:", error.request);
      } else {
        console.error("요청 설정 중 에러 발생:", error.message);
      }
    } else {
      console.error("예상치 못한 에러 발생:", error);
    }

    throw error;
  }
};

// 아이디 중복확인 요청
export const checkUsername = async (username: string) => {
  try {
    const response = await api.get(`id-check?username=${username}`);
    return response.data;
  } catch (error) {
    console.error("아이디 중복 확인 실패:", error);
    throw new Error("아이디 중복 확인에 실패했습니다.");
  }
};
