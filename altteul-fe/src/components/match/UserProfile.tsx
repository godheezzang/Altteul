import React from "react";
import Bronze from "@assets/icon/badge/Badge_01.svg";
import Silver from "@assets/icon/badge/Badge_04.svg";
import Gold from "@assets/icon/badge/Badge_05.svg";
import Platinum from "@assets/icon/badge/Badge_07.svg";
import Diamond from "@assets/icon/badge/Badge_08.svg";
import userIcon from "@assets/icon/User.svg";

interface UserProfileProps {
  nickname: string;
  profileImg: string;
  tierId: number;
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ nickname, profileImg, tierId, className }) => {
  const userImg = profileImg ? profileImg : userIcon
  const tier = tierId == 1 ? Bronze :
               tierId == 2 ? Silver :
               tierId == 4 ? Gold :
               tierId == 3 ? Platinum :
               tierId == 5 ? Diamond :
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
