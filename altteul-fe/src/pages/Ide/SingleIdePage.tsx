import { useEffect, useState } from 'react';
import useGameStore from '@stores/useGameStore';
import { useSocketStore } from '@stores/socketStore';
import CodeEditor from '@components/Ide/SingleCodeEditor';
import Terminal from '@components/Ide/Terminal';
import IdeFooter from '@components/Ide/IdeFooter';
import ProblemInfo from '@components/Ide/ProblemInfo';
import SideProblemModal from '@components/Ide/SideProblemModal';
import GameUserList from '@components/Ide/GameUserList';
import useAuthStore from '@stores/authStore';
import { MemberInfo, TeamInfo, User } from 'types/types';
import useModalStore from '@stores/modalStore';
import { GAME_TYPES, MODAL_TYPES, RESULT_TYPES } from 'types/modalTypes';

const MAX_REQUESTS = 5;

const SingleIdePage = () => {
  const { gameId, roomId, users, setUserRoomId, setIsFinish } = useGameStore();
  const { subscribe, sendMessage, connected, unsubscribe } = useSocketStore();
  const { openModal } = useModalStore();

  const [sideProblem, setSideProblem] = useState(null);
  const [completeUsers, setCompleteUsers] = useState<Set<number>>(new Set());
  const [userProgress, setUserProgress] = useState<Record<number, number>>({});
  const [leftUsers, setLeftUsers] = useState<User[]>([]);

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'python' | 'java'>('python');
  const [showModal, setShowModal] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [output, setOutput] = useState<string>('');
  const { userId } = useAuthStore();
  const userRoomId = users.find(user => user.userId === Number(userId))?.roomId;

  useEffect(() => {
    if (userRoomId && userRoomId !== roomId) {
      setUserRoomId(userRoomId);
    }
  }, [userId, users, roomId, setUserRoomId]);

  useEffect(() => {}, [userProgress, completeUsers]);

  useEffect(() => {
    if (!connected) return;

    // 사이드 문제 구독
    subscribe(`/sub/${gameId}/${userRoomId}/side-problem/receive`, data => {
      // console.log('📩 사이드 문제 수신:', data);
      setSideProblem(data);
      setShowModal(true);
    });

    // 코드 채점 결과 구독
    subscribe(`/sub/${gameId}/${userRoomId}/team-submission/result`, data => {
      // console.log('📩 코드 채점 결과 수신:', data);
    });

    // 실시간 게임 현황 구독
    subscribe(`/sub/game/${gameId}/submission/result`, data => {
      // console.log('📩 실시간 게임 현황 수신:', data);

      // ✅ data?.data 체크 (최상위)
      if (!data || !data.data) {
        // console.warn('⚠️ 게임 현황 데이터가 없습니다:', data);
        return;
      }

      const { submittedTeam, restTeam } = data.data;
      const updatedProgress: Record<number, number> = {};
      const completedSet = new Set(completeUsers);

      // ✅ submittedTeam이 존재하는지 확인
      if (submittedTeam?.gameResult !== 1 && Array.isArray(submittedTeam.members)) {
        submittedTeam.members.forEach((member: MemberInfo) => {
          completedSet.add(member.userId);
          updatedProgress[member.userId] = 100; // 통과율 100%

          if (member.userId === userId) {
            // 사이드 문제 모달 막기
            setRequestCount(5);
            openModal(MODAL_TYPES.RESULT, {
              type: GAME_TYPES.SINGLE,
              result: RESULT_TYPES.SUCCESS,
            });
          }
        });
      } else if (submittedTeam?.gameResult === 0 && Array.isArray(submittedTeam.members)) {
        submittedTeam.members.forEach((member: MemberInfo) => {
          updatedProgress[member.userId] = submittedTeam.passRate;
        });
      }

      // // ✅ restTeam이 존재하는지 확인
      // if (Array.isArray(restTeam)) {
      //   restTeam.forEach((team: TeamInfo) => {
      //     if (team && Array.isArray(team.members)) {
      //       team.members.forEach((member: MemberInfo) => {
      //         updatedProgress[member.userId] = team.passRate || 0;
      //       });
      //     } else {
      //       console.warn('⚠️ team 또는 members 데이터 없음:', team);
      //     }
      //   });
      // } else {
      //   console.warn('⚠️ restTeam 데이터 없음:', restTeam);
      // }

      setCompleteUsers(completedSet);
      setUserProgress(prev => ({ ...prev, ...updatedProgress }));
    });

    // 퇴장하기 구독
    subscribe(`/sub/single/room/${gameId}`, data => {
      // console.log('퇴장하기 구독 데이터:', data);

      if (data.type === 'GAME_LEAVE') {
        const { leftUser, remainingUsers } = data.data;

        setLeftUsers(prev => [...prev, leftUser]);
        setUserProgress(remainingUsers);
      }
    });

    return () => {
      // 모든 구독 해제
    };
  }, [gameId, userProgress, completeUsers]);

  // ✅ 사이드 문제 요청
  const requestSideProblem = () => {
    sendMessage(`/pub/side/receive`, { gameId, teamId: userRoomId });

    // console.log('📨 사이드 문제 요청 전송');
  };

  // ✅ 10분마다 자동으로 사이드 문제 요청
  useEffect(() => {
    if (!connected) return;
    if (requestCount >= MAX_REQUESTS) return;

    const interval = setInterval(
      () => {
        if (requestCount < MAX_REQUESTS) {
          requestSideProblem();
          setRequestCount(prev => prev + 1);
        } else {
          clearInterval(interval);
        }
      },
      60 * 10 * 1000
    );

    return () => clearInterval(interval);
  }, [requestCount]);

  useEffect(() => {
    if (sideProblem) {
      setShowModal(true);
    }
  }, [sideProblem]);

  return (
    <div className="flex max-h-screen bg-primary-black border-t border-gray-04">
      <div className="min-w-[23em] max-w-[30rem] border-r border-gray-04">
        <ProblemInfo />
      </div>

      <div className="max-w-[65rem] flex-[46rem] border-r border-gray-04">
        <CodeEditor
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          roomId={String(userRoomId)}
        />
        <Terminal output={output} isTeam={false} />
        <div className="text-center">
          <IdeFooter
            code={code}
            language={language}
            setOutput={setOutput}
            userRoomId={userRoomId}
          />
        </div>
      </div>

      <div className="grow min-w-[15rem]">
        <GameUserList
          users={users}
          completeUsers={completeUsers}
          userProgress={userProgress}
          leftUsers={leftUsers}
        />
      </div>

      {/* ✅ 사이드 문제 모달 */}
      {showModal && sideProblem && (
        <SideProblemModal
          gameId={gameId}
          roomId={roomId}
          problem={sideProblem?.data}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default SingleIdePage;
