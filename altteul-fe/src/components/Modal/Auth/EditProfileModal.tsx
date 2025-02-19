import { useState } from 'react';
import Input from '@components/Common/Input';
import Modal from '@components/Common/Modal';
import Button from '@components/Common/Button/Button';
import SignUpDropdown from '@components/Modal/Auth/SignUpDropdown';
import { checkNickname } from '@utils/Api/auth';
import ProfileUpload from '@components/Modal/Auth/ProfileUpload';
import useModalStore from '@stores/modalStore';
import { updateProfile } from '@utils/Api/userApi';

// 프로필 이미지 타입 정의
type ProfileImageType = string | File | null;

// 폼 데이터 타입 재정의
interface EditProfileFormData {
  nickname: string;
  mainLang: string;
  profileImg: ProfileImageType;
}

// 에러 타입 재정의
interface ValidationErrors {
  nickname: string;
  mainLang: string;
  profileImg: string;
}

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileProps) => {
  const { modalInfo } = useModalStore();

  const languageOptions = [
    { id: 1, value: 'PY', label: 'Python' },
    { id: 2, value: 'JV', label: 'Java' },
  ];

  // 폼 초기화 함수
  const resetForm = () => {
    setForm({
      nickname: modalInfo?.nickname || '',
      mainLang: 'PY',
      profileImg: modalInfo?.profileImg || null,
    });

    setErrors({
      nickname: '',
      mainLang: '',
      profileImg: '',
    });

    setIsNicknameVerified(false);
    setIsNicknameTaken(false);
    setApiError('');
  };

  // 폼 상태
  const [form, setForm] = useState<EditProfileFormData>({
    nickname: modalInfo?.nickname || '',
    mainLang: 'PY',
    profileImg: modalInfo?.profileImg || null,
  });

  // 에러 상태
  const [errors, setErrors] = useState<ValidationErrors>({
    nickname: '',
    mainLang: '',
    profileImg: '',
  });

  // API 및 검증 상태
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNicknameTaken, setIsNicknameTaken] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError('');

    if (name === 'nickname') {
      setIsNicknameVerified(false);
      setIsNicknameTaken(false);
    }
  };

  // 드롭다운 언어 선택
  const handleSelectChange = (selected: string) => {
    setForm(prev => ({ ...prev, mainLang: selected }));
  };

  // 이미지 파일 업로드 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    console.log(e.target.files![0])
    if (e.target.files?.length) {
      setForm(prev => ({ ...prev, profileImg: e.target.files![0] }));
    }
  };

  // 닉네임 중복확인
  const handleCheckNickname = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (form.nickname === modalInfo?.nickname) {
      setIsNicknameVerified(true);
      return;
    }

    if (form.nickname.length < 2 || form.nickname.length > 8) {
      setErrors(prev => ({
        ...prev,
        nickname: '닉네임은 2자 이상 8자 이하여야 합니다.',
      }));
      return;
    }

    setIsCheckingNickname(true);
    setIsNicknameTaken(false);
    setApiError('');

    try {
      const response = await checkNickname(form.nickname);
      if (response.isTaken) {
        setIsNicknameTaken(true);
        setIsNicknameVerified(false);
        setErrors(prev => ({
          ...prev,
          nickname: '이미 사용 중인 닉네임입니다.',
        }));
      } else {
        setIsNicknameTaken(false);
        setIsNicknameVerified(true);
        setErrors(prev => ({
          ...prev,
          nickname: '',
        }));
      }
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
      setErrors(prev => ({
        ...prev,
        nickname: '이미 사용 중인 닉네임입니다.',
      }));
      setIsNicknameVerified(false);
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isNicknameVerified) {
      setApiError('닉네임 중복확인이 필요합니다.');
      return;
    }

    const formData = new FormData();
    const requestData = {
      nickname: form.nickname,
      mainLang: form.mainLang,
    };

    formData.append('request', JSON.stringify(requestData));

    if (form.profileImg instanceof File) {
      formData.append('profileImg', form.profileImg);
    } else if (form.profileImg === null) {
      formData.append('profileImg', '0');
    }
    // 기존 이미지를 유지하는 경우 profileImg를 전송하지 않음

    try {
      setIsSubmitting(true);
      // TODO: API 호출 구현
      const response = await updateProfile(formData);
      alert('정보가 수정되었습니다.')
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error('프로필 수정 중 오류 발생 : ', error);
        setApiError(error.message || '서버와 연결 할 수 없습니다. 다시 시도하세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onReset={resetForm}
      title="프로필 수정"
      height="auto"
      className="bg-primary-white"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-6">
        <Input
          name="nickname"
          type="text"
          placeholder="닉네임을 입력해 주세요"
          onChange={handleChange}
          value={form.nickname}
          buttonText={isCheckingNickname ? '확인중...' : '중복확인'}
          onButtonClick={handleCheckNickname}
        />
        {errors.nickname && <p className="text-gray-03 font-semibold text-sm">{errors.nickname}</p>}
        {isNicknameVerified && !isNicknameTaken && !errors.nickname && (
          <p className="text-primary-orange font-semibold text-sm -my-2.5 ml-1">사용 가능한 닉네임입니다.</p>
        )}

        <SignUpDropdown
          options={languageOptions}
          value={form.mainLang}
          onChange={handleSelectChange}
          className="bg-primary-white border rounded-xl"
        />
        {errors.mainLang && <p className="text-primary-orange text-sm">{errors.mainLang}</p>}

        <ProfileUpload
          onChange={handleFileChange} 
          currentImage={typeof form.profileImg === 'string' ? form.profileImg : null} 
        />

        {apiError && <p className="text-primary-orange text-sm">{apiError}</p>}

        <Button type="submit" className="h-[3rem]">
          {isSubmitting ? '처리중...' : '수정하기'}
        </Button>
      </form>
    </Modal>
  );
};

export default EditProfileModal;