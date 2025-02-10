import { TeamInfo } from "types/types";

interface GameUserListProps {
	teamMembers: TeamInfo;
}

const GameUserList = ({ teamMembers }: GameUserListProps) => {
	console.log(teamMembers);

	return (
		<>
			<div>
				<h1>Game User List</h1>
			</div>
		</>
	);
};

export default GameUserList;
