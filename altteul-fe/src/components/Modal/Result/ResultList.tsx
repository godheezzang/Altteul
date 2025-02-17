import ResultItem from '@components/Modal/Result/ResultItem';
import { MemberInfo, ResultData, TeamInfo } from 'types/types';

interface ResultListProps {
  results: ResultData;
}

export type SortedPlayer = {
  duration: string | null;
  executeMemory: string | number | null;
  executeTime: string | number | null;
  gameResult: number | string;
  isMyTeam: boolean;
  lang: string | null;
  nickname: string;
  passRate: number;
  point: number;
  profileImage: string;
  tierId: number;
  totalHeadCount: number;
  userId: number;
};

// 시간 초단위로 변환하는 함수
const parseDuration = (duration: string): number => {
  if (!duration) return null;

  const [minutes, seconds] = duration.split(':').map(Number);
  return minutes * 60 + seconds;
};

const ResultList = ({ results }: ResultListProps) => {
  const myTeamMembers = results.myTeam.members.map((member: MemberInfo) => ({
    ...member,
    gameResult: results.myTeam.gameResult,
    lang: results.myTeam.lang,
    totalHeadCount: results.myTeam.totalHeadCount,
    executeTime: results.myTeam.executeTime,
    executeMemory: results.myTeam.executeMemory,
    point: results.myTeam.point,
    passRate: results.myTeam.passRate,
    duration: results.myTeam.duration,
    isMyTeam: true,
  }));

  const opponentMembers = results.opponents.flatMap((opponent: TeamInfo) =>
    opponent.members.map((member: MemberInfo) => ({
      ...member,
      gameResult: opponent.gameResult,
      lang: opponent.lang,
      totalHeadCount: opponent.totalHeadCount,
      executeTime: opponent.executeTime,
      executeMemory: opponent.executeMemory,
      point: opponent.point,
      passRate: opponent.passRate,
      duration: opponent.duration,
      isMyTeam: false,
    }))
  );

  const sortedPlayers: SortedPlayer[] = [...myTeamMembers, ...opponentMembers].sort((a, b) => {
    const durationA = parseDuration(a.duration);
    const durationB = parseDuration(b.duration);
    return durationA - durationB;
  });

  return (
    <div>
      <div className="flex text-primary-white w-[50rem] justify-between text-sm p-4">
        <p className="w-8 text-center">순위</p>
        <p className="w-40 text-center">플레이어</p>
        <p className="w-16 text-center">획득 포인트</p>
        <p className="w-16 text-center">시간</p>
        <p className="w-8 text-center">해결</p>
        <p className="w-16 text-center">통과율</p>
        <p className="w-16 text-center">언어</p>
        <p className="w-16 text-center">실행 속도</p>
        <p className="w-16 text-center">메모리</p>
      </div>
      <ul>
        {sortedPlayers.map((player, index) => (
          <ResultItem key={index} player={player} rank={index + 1} />
        ))}
      </ul>
    </div>
  );
};

export default ResultList;
