import React from 'react';

interface UserProfileProps {
  nickName: string;
  profileImage: string;
  tier: string; //임시로 등급이미지 사용
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ nickName, profileImage, tier, className }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <img 
          src={profileImage} 
          alt={nickName} 
          className="w-16 h-16 rounded-full"
        />
        <img 
          src={tier} 
          alt="Tier" 
          className="absolute -bottom-2 -right-2 w-6 h-6"
        />
      </div>
      <span className="text-white text-sm mt-2">{nickName}</span>
    </div>
  );
};

export default UserProfile;