import { useNavigate } from 'react-router-dom';
import UserProfile from '@components/Match/UserProfile';
import Button from '@components/Common/Button/Button';
import backgroundImage from '@assets/background/team_matching_bg.svg';
import { User } from 'types/types';
import { useEffect, useState } from 'react';
import { useMatchStore } from '@stores/matchStore';
import { teamOut, teamStart } from '@utils/Api/matchApi';
import { useSocketStore } from '@stores/socketStore';
import socketResponseMessage from 'types/socketResponseMessage';

const TeamcompositionPage = () => {
  const navigate = useNavigate();
  const matchStore = useMatchStore();
  const socket = useSocketStore();
  const currentUserId = Number(sessionStorage.getItem('userId'));
  //매칭관련 데이터
  const [alliance, setAlliance] = useState(matchStore.matchData.users);
  const [leaderId, setLeaderId] = useState(matchStore.matchData.leaderId);
  const roomId = matchStore.matchData.roomId;
  const [isLeader, setIsLeader] = useState(currentUserId === leaderId); //매칭 시작 버튼 렌더링을 위한 변수

  //구독처리
  useEffect(() => {
    socket.subscribe(`/sub/team/room/${roomId}`, handleMessage);

    //언마운트 시 구독에 대한 콜백함수(handleMessage 정리)
    return () => {
      console.log('teamComposition Out, 콜백함수 정리');
      socket.unsubscribe(`/sub/team/room/${roomId}`);
    };
  }, [roomId]);

  //소켓 응답 처리
  const handleMessage = (message: socketResponseMessage) => {
    console.log(message);
    const { type, data } = message;
    if (type === 'ENTER' || type === 'LEAVE') {
      setLeaderId(data.leaderId);
      setAlliance(data.users);
      setIsLeader(currentUserId === data.leaderId);
    }

    //teamStart API 요청 후 매칭 시작 소켓 응답
    if (type === 'MATCHING') {
      //매칭 페이지로 이동
      navigate('/match/team/search');
    }

    // 대기 유저가 4명이 되면 자동으로 게임 시작
    if (data.users.length >= 4) {
      handleStartButton();
    }
  };

  const handleStartButton = () => {
    //혼자만 있을 때
    if (alliance.length === 0) {
      alert('혼자서는 플레이 할 수 없습니다.');
      return;
    }

    //4명이 됐는지 확인
    if (alliance.length === 4 || confirm('바로 시작하시겠습니까?')) {
      navigateMatchPage();
    }
  };

  //매칭 조건 충족 시
  const navigateMatchPage = async () => {
    // Search 페이지로 넘어가기 전, 마지막 상태 데이터 저장
    const matchData = {
      roomId: roomId,
      leaderId: leaderId,
      users: [...alliance],
    };

    matchStore.setMatchData(matchData)

    //게임 시작 API 호출(For socket 응답 변환)
    await teamStart(roomId);
  };

  //나가기(퇴장) 버튼 로직
  const userOut = () => {
    teamOut(roomId);
    socket.unsubscribe(`/sub/team/room/${roomId}`);
    navigate('/match/select');
  };

  return (
    <div
      className="relative -mt-[3.5rem] min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* 컨텐츠 */}
      <div className="relative min-h-screen w-full z-10 flex flex-col items-center justify-center">
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
          {isLeader && (
            <Button
              className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]"
              onClick={handleStartButton}
            >
              매칭 시작
            </Button>
          )}
          <Button
            className="transition-all duration-300 hover:shadow-[0_0_15px_var(--primary-orange)]"
            onClick={userOut}
          >
            나가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamcompositionPage;
