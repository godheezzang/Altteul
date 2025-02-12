import { TeamInfo } from 'types/types';

interface GameUserListProps {
  teamMembers: TeamInfo;
  opponentMembers: TeamInfo;
}

const GameUserList = ({ teamMembers, opponentMembers }: GameUserListProps) => {
  console.log('teamMembers:', teamMembers);
  console.log('opponentMembers:', opponentMembers);

  return (
    <>
      <div>
        <h1>Game User List</h1>
      </div>
    </>
  );
};

export default GameUserList;
