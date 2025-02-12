import { TeamInfo, User } from 'types/types';

interface GameUserListProps {
  users: User[]
}

const GameUserList = ({ users }: GameUserListProps) => {
  console.log('users:', users);
  
  return (
    <>
      <div>
        <h1>Game User List</h1>
      </div>
    </>
  );
};

export default GameUserList;
