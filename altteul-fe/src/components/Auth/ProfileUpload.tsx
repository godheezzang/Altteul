import React, { useState, useRef } from 'react';
import PeopleIcon from '@assets/icon/People.svg';

type ProfileUploadProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentImage: File | null;
};

const ProfileUpload = ({ onChange, currentImage }: ProfileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 이미지 선택시 미리보기 생성
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 파일 선택 트리거
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-[22rem]">
      <div
        className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-02 hover:border-primary-orange cursor-pointer"
        onClick={handleButtonClick}
      >
        <img
          src={preview || PeopleIcon}
          alt="프로필 이미지"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="text-primary-white text-sm">이미지 변경</span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        name="profileImg"
        onChange={handleFileChange}
        accept="image/png, image/jpg, image/jpeg"
        className="hidden"
      />

      <button
        type="button"
        onClick={handleButtonClick}
        className="px-4 py-2 text-sm text-gray-03 hover:text-primary-orange border border-2 border-gray-02 rounded-xl hover:border-primary-orange"
      >
        {preview ? '다른 사진 선택하기' : '프로필 사진 선택하기'}
      </button>

      {preview && (
        <button
          type="button"
          onClick={() => {
            setPreview(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            onChange({ target: { files: null } } as any);
          }}
          className="text-sm text-gray-01 hover:text-primary-orange"
        >
          기본 이미지로 되돌리기
        </button>
      )}
    </div>
  );
};

export default ProfileUpload;
