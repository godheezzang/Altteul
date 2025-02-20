import { useEffect, useState } from 'react';
import useAuthStore from '@stores/authStore';
import UserProfileImg from '@components/Common/UserProfileImg';
import { User } from 'types/types';

interface GameUserListProps {
  users: User[];
  completeUsers: number[];
  userProgress: Record<number, number>;
  leftUsers: User[];
}

const GameUserList = ({ users, completeUsers, userProgress, leftUsers }: GameUserListProps) => {
  const { userId } = useAuthStore();
  const [completedUsers, setCompletedUsers] = useState<User[]>([]);

  useEffect(() => {
    // completeUsers -> 맞힌 유저 userId 있는 배열
    // users에서 completeUsers 안의 userId랑 비교해서 같으면 그 유저는 완료한 유저임
    // 그 유저를 setCompletedUsers에 추가한다.

    if (!completeUsers.length || !users.length) return;

    const updatedCompletedUsers = users.filter(user => completeUsers.includes(user.userId));
    setCompletedUsers(updatedCompletedUsers);
  }, [completeUsers]);

  /** 진행 중인 유저 목록 */
  const inProgressUsers = users.filter(
    user =>
      !completeUsers.includes(user.userId) && !leftUsers.some(left => left.userId === user.userId)
  );

  console.log('completeUsers:', completeUsers);
  console.log('completedUsers:', completedUsers);

  return (
    <div className="min-w-[8rem] w-full">
      {/* 진행 중인 유저 */}
      <div className="px-8 py-6 border-b border-gray-04">
        <h3 className="text-sm font-semibold mb-4 text-gray-02">진행 중</h3>
        {inProgressUsers.length > 0 ? (
          <ul>
            {inProgressUsers.map(user => {
              const progress = userProgress[user.userId] || 0;
              return (
                <li key={user.userId} className="flex items-center space-x-2 mb-1 py-3 px-4 pl-2">
                  <UserProfileImg
                    profileImg={user.profileImg}
                    tierId={user.tierId}
                    customClass="mr-2"
                  />
                  <span
                    className={`font-semibold text-sm ${user.userId === Number(userId) ? 'text-primary-orange' : ''}`}
                  >
                    {user.nickname}
                  </span>
                  <span className="text-xs text-gray-02">{progress}% 완료</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">👏 모든 유저가 문제를 풀었습니다.</p>
        )}
      </div>

      {/* 완료된 유저 */}
      <div className="px-8 py-6 border-b border-gray-04">
        <h3 className="text-sm font-semibold mb-4 text-gray-02">완료</h3>
        {completedUsers.length > 0 ? (
          <ul>
            {completedUsers.map(user => (
              <li key={user.userId} className="flex items-center space-x-2 mb-1 py-3 px-4 pl-2">
                <UserProfileImg
                  profileImg={user.profileImg}
                  tierId={user.tierId}
                  customClass="mr-2 shadow-passProfile"
                />
                <span
                  className={`font-semibold text-sm ${user.userId === Number(userId) ? 'text-primary-orange' : ''}`}
                >
                  {user.nickname}
                </span>
                <span className="text-xs text-gray-02">100% 완료</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-02 ml-4">🧐 아직 완료한 유저가 없습니다.</p>
        )}
      </div>

      {/* 미해결 유저 */}
      <div className="px-8 py-6">
        <h3 className="text-sm font-semibold mb-6 text-gray-02">미해결</h3>
        {leftUsers.length > 0 ? (
          <ul>
            {leftUsers.map(user => (
              <li
                key={user.userId}
                className="flex items-center space-x-2 mb-1 py-3 px-4 pl-2 text-gray-400"
              >
                <UserProfileImg
                  profileImg={user.profileImg}
                  tierId={user.tierId}
                  customClass="mr-2 opacity-50"
                />
                <span className="font-semibold text-sm">{user.nickname}</span>
                <span className="text-xs">중간 퇴장</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-02 ml-4">👌 모두 게임에 참여 중입니다.</p>
        )}
      </div>
    </div>
  );
};

export default GameUserList;
