import { getUserInfo } from '@utils/api/userApi';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserInfo as UserInfoType } from 'types/types';
import people from '@assets/icon/People.svg';
import bronze from '@assets/icon/badge/Badge_01.svg';
import silver from '@assets/icon/badge/Badge_04.svg';
import gold from '@assets/icon/badge/Badge_01.svg';
import platinum from '@assets/icon/badge/Badge_07.svg';
import dia from '@assets/icon/badge/Badge_08.svg';

const tierIcons = {
  bronze: bronze,
  silver: silver,
  gold: gold,
  platinum: platinum,
  dia: dia,
} as const;

const UserInfo = () => {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('token');
  // userId 로컬 스토리지에 저장된거 가져오기
  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);

        const response = await getUserInfo(token);
        const data = response.data;

        setUserInfo(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId, token, loggedInUserId]);

  // TODO: 로딩 컴포넌트로 교체
  if (isLoading)
    return (
      <div>
        <p>정보를 가져오고 있습니다.</p>
        <p>잠시만 기다려 주세요. 🙏</p>
      </div>
    );

  // TODO: 에러 페이지로 교체
  if (!userInfo)
    return (
      <div>
        <p>유저 정보가 없습니다.</p>
      </div>
    );

  return (
    <div>
      <div className='relative w-24 mx-auto'>
        <img src={userInfo.profileImg.length === 0 ? people : userInfo.profileImg} alt='Profile' className='w-24 h-24 rounded-full border-2 border-gray-03' />
        {/* TODO: 유저 티어별로 이미지 설정해서 이미지 넣기 */}
        <div className='absolute -bottom-2 -right-2 rounded-full'>
          <img src={tierIcons[userInfo.tier.toLowerCase() as keyof typeof tierIcons]} alt={`${userInfo.tier} tier`} className='w-12 aspect-square' />
        </div>
      </div>

      <div className='flex flex-col items-center'>
        <div>
          <h2 className='text-xl font-bold'>{userInfo.nickname}</h2>
          <span className='text-gray-02'>@{userInfo.username}</span>
        </div>

        <div className='text-center'>
          <div>{userInfo.rankPercentile !== null ? <span className='font-md'>상위 {userInfo.rankPercentile}%</span> : <p>하위 0%</p>}</div>
          <div>
            {userInfo.rank !== null ? (
              <>
                <p className='font-medium'>현재 등수 {userInfo.rank}위</p>
                {userInfo.rankChange > 0 && <span className='text-primary-orange ml-1'>(▲{userInfo.rankChange})</span>}
                {userInfo.rankChange === 0 && <span className='text-gray-03 ml-1'>(-)</span>}
                {userInfo.rankChange < 0 && <span className='text-gray-03 ml-1'>(▼{Math.abs(userInfo.rankChange)})</span>}
              </>
            ) : (
              // 이거 등수 없다 = 꼴등이다 아닌가?
              // 전체 유저 인원 수를 가져와야 하나 아님 뭐라고 표시해야할지 모르겠음!
              // TODO: 표시 문구 수정 필요
              <>
                <p>
                  꼴찌 수정하세요 ~ <span className='text-gray-03'>(-)</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
