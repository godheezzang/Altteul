import React from "react";

interface UserProfileProps {
  nickName: string;
  profileImage: string;
  tierId: number;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ nickName, profileImage, tierId, className }) => {
  const userImg = profileImage ? profileImage : "/src/assets/icon/User.svg"
  const tier = tierId == 1 ? "/src/assets/icon/Badge/Badge_01.svg" :
               tierId == 2 ? "/src/assets/icon/Badge/Badge_02.svg" :
               tierId == 3 ? "/src/assets/icon/Badge/Badge_03.svg" :
               tierId == 4 ? "/src/assets/icon/Badge/Badge_04.svg" :
               tierId == 5 ? "/src/assets/icon/Badge/Badge_05.svg" :
               tierId == 6 ? "/src/assets/icon/Badge/Badge_06.svg" :
               tierId == 7 ? "/src/assets/icon/Badge/Badge_07.svg" :
               tierId == 8 ? "/src/assets/icon/Badge/Badge_08.svg" :
               "/src/assets/icon/Badge_09.svg"

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <img src={userImg} alt={nickName} className="w-16 h-16 rounded-full" />
        <img src={tier} alt="Tier" className="absolute -bottom-2 -right-2 w-6 h-6" />
      </div>
      <span className="text-white text-sm mt-2">{nickName}</span>
    </div>
  );
};

export default UserProfile;
