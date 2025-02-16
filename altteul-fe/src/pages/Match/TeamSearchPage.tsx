import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserProfile from '@components/Match/UserProfile';
import Button from '@components/Common/Button/Button';
import backgroundImage from '@assets/background/team_matching_bg.svg';
import tmi from '@assets/tmi.json';
import { User } from 'types/types';
import { useMatchStore } from '@stores/matchStore';
import { useSocketStore } from '@stores/socketStore';
import socketResponseMessage from 'types/socketResponseMessage';
import { cancelTeamMatch } from '@utils/Api/matchApi';
import useGameStore from '@stores/useGameStore';

const TeamSearchPage = () => {
  const [fact, setFact] = useState<string>('');
  const [facts] = useState<string[]>(tmi.facts);
  const navigate = useNavigate();
  const matchStore = useMatchStore();
  const gameStore = useGameStore();
  const socket = useSocketStore();
  const [alliance] = useState(matchStore.matchData.users);
  const roomId = matchStore.matchData.roomId;

  //구독처리
  useEffect(() => {
    socket.subscribe(`/sub/team/room/${roomId}`, handleMessage);

    //언마운트 시 구독에 대한 콜백함수(handleMessage 정리)
    return () => {
      const matchId = sessionStorage.getItem('matchId');
      console.log('teamSearch Out, 콜백함수 정리');
      socket.unsubscribe(`/sub/team/room/${roomId}`);
      matchId ? socket.unsubscribe(`/sub/team/room/${matchId}`) : () => {};
    };
  }, [roomId]);

  //소켓 응답 처리
  const handleMessage = (message: socketResponseMessage) => {
    console.log(message);
    const { type, data } = message;

    //매칭 성사 소켓 응답
    if (type === 'MATCHED') {
      matchStore.setMathId(data.matchId); //final에서 구독 신청 시 써야함
      socket.subscribe(`/sub/team/room/${data.matchId}`, handleMessage); //COUNTING_READY응답을 받기 위한 구독신청
    }

    if (type === 'COUNTING_READY') {
      //final 페이지에 쓰일 데이터 저장
      matchStore.setMyTeam(data.team1);
      matchStore.setOpponent(data.team2);

      gameStore.setMyTeam(data.team1)
      gameStore.setOpponent(data.team2)
      gameStore.setProblem(data.problem)
      gameStore.setTestcases(data.testcases)

      //페이지 이동
      navigate('/match/team/final');
    }

    //매칭 취소 버튼 클릭 이후 소켓 응답
    if (type === 'MATCH_CANCEL_SUCCESS') {
      //넘어온 데이터로 myTeam 재설정
      matchStore.setMyTeam(data)

      //매칭 페이지로 이동
      navigate('/match/team/composition');
    }
  };

  //매칭 취소 버튼 핸들링 -> api 요청 -> 소켓 응답(MATCH_CANCEL_SUCCESS) -> 매칭 취소
  const handleMatchCancelButton = () => {
    cancelTeamMatch(roomId);
  };

  // 첫 fact 생성 후 5초 간격으로 Rotation
  useEffect(() => {
    setFact(facts[Math.floor(Math.random() * facts.length)]);

    const factRotation = setInterval(() => {
      setFact(facts[Math.floor(Math.random() * facts.length)]);
    }, 5000);

    return () => clearInterval(factRotation);
  }, [facts]);

  return (
    <div
      className="w-full -mt-[3.5rem] bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* 컨텐츠 */}
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center">
        {/* Status Message */}
        <div className="text-white text-3xl mb-8 flex flex-col items-center">
          대전 할 상대를 찾고 있어요. 🧐
          <div className="flex text-base mt-3">
            조금만 기다려 주세요
            <div className="ml-2">
              {/* 스피너 */}
              <div className="animate-bounce">...</div>
            </div>
          </div>
        </div>

        {/* 팀 정보 */}
        <div className="flex justify-center items-center gap-20">
          {alliance.map((user: User) => (
            <UserProfile
              key={user.userId}
              nickname={user.nickname}
              profileImg={user.profileImg}
              tierId={user.tierId}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex gap-6 mt-12">
          <Button
            className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]"
            onClick={handleMatchCancelButton}
          >
            매칭 취소하기
          </Button>
        </div>

        {/* TMI */}
        <div className="absolute bottom-8 text-gray-300 text-sm">{fact}</div>
      </div>
    </div>
  );
};

export default TeamSearchPage;
