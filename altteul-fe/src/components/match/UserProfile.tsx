import React from "react";

interface UserProfileProps {
  nickname: string;
  profileImg: string;
  tierId: number;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ nickname, profileImg, tierId, className }) => {
  const userImg = profileImg ? profileImg : "/src/assets/icon/User.svg"
  const tier = tierId == 1 ? "/src/assets/icon/badge/Badge_01.svg" :
               tierId == 2 ? "/src/assets/icon/badge/Badge_04.svg" :
               tierId == 3 ? "/src/assets/icon/badge/Badge_05.svg" :
               tierId == 4 ? "/src/assets/icon/badge/Badge_07.svg" :
               tierId == 5 ? "/src/assets/icon/badge/Badge_08.svg" :
               ""

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <img src={userImg} alt={nickname} className="w-16 h-16 rounded-full" />
        <img src={tier} alt="Tier" className="absolute -bottom-2 -right-2 w-6 h-6" />
      </div>
      <span className="text-white text-sm mt-2">{nickname}</span>
    </div>
  );
};

export default UserProfile;
