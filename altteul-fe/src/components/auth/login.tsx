import { useState } from "react";

interface LoginFormData {
  username: string;
  password: string;
}

const Login = () => {
  const [form, setForm] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [error, setError] = useState<string>(""); // 로그인 오류났을 때

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 입력
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 로딩 중..
    setIsSubmitting(true);

    try {
      const response = await fetch("")
    }
  };
};
