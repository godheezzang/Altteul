import { useEffect, useState } from 'react';
import useGameStore from '@stores/useGameStore';
import { useSocketStore } from '@stores/socketStore';
import CodeEditor from '@components/Ide/CodeEditor';
import Terminal from '@components/Ide/Terminal';
import IdeFooter from '@components/Ide/IdeFooter';
import ProblemInfo from '@components/Ide/ProblemInfo';
import SideProblemModal from '@components/Ide/SideProblemModal';
import GameUserList from '@components/Ide/GameUserList';
import useAuthStore from '@stores/authStore';
import { User } from 'types/types';

const MAX_REQUESTS = 5;

const SingleIdePage = () => {
  const { gameId, roomId, users, setUserRoomId } = useGameStore();
  const { subscribe, sendMessage, connected } = useSocketStore();

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

  useEffect(() => {
    if (!connected) return;

    // 사이드 문제 구독
    subscribe(`/sub/${gameId}/${userRoomId}/side-problem/receive`, data => {
      console.log('📩 사이드 문제 수신:', data);
      setSideProblem(data);
      setShowModal(true);
    });

    // 코드 채점 결과 구독
    subscribe(`/sub/${gameId}/${userRoomId}/team-submission/result`, data => {
      console.log('📩 코드 채점 결과 수신:', data);
      setCompleteUsers(prev => {
        const newSet = new Set(prev);
        if (data.status === 'P' && data.passCount === data.totalCount) {
          newSet.add(Number(sessionStorage.getItem('userId')));
        }
        return newSet;
      });

      setUserProgress(prev => {
        if (!data.testCases || data.testCases.length === 0) {
          return {
            ...prev,
            [userId]: 0, // 테스트 케이스가 없는 경우 진행률 0%
          };
        }

        // 테스트 케이스별 진행률 계산
        const passedCount = data.testCases.filter(
          (tc: {
            executionMemory: string;
            executionTime: string;
            status: string;
            testCaseId: number;
            testCaseNumber: number;
          }) => tc.status === 'P'
        ).length;
        const progress = Math.round((passedCount / data.testCases.length) * 100);

        return {
          ...prev,
          [userId]: progress,
        };
      });
    });

    // 상대 팀 코드 채점 결과 구독
    subscribe(`/sub/${gameId}/${userRoomId}/opponent-submission/result`, data => {
      console.log('📩 상대 팀 코드 채점 결과 수신:', data);

      setUserProgress(prev => {
        const opponentId = data.userId; // 상대방 ID (백엔드에서 userId 포함해서 보내줘야 함)

        if (!data.testCases || data.testCases.length === 0) {
          return {
            ...prev,
            [opponentId]: 0, // 테스트 케이스가 없는 경우 진행률 0%
          };
        }

        // ✅ 테스트 케이스별 진행률 계산
        const passedCount = data.testCases.filter(
          (tc: {
            executionMemory: string;
            executionTime: string;
            status: string;
            testCaseId: number;
            testCaseNumber: number;
          }) => tc.status === 'P'
        ).length;
        const progress = Math.round((passedCount / data.testCases.length) * 100);

        return {
          ...prev,
          [opponentId]: progress,
        };
      });
    });

    // 퇴장하기 구독
    subscribe(`/sub/single/room/${gameId}`, data => {
      console.log('퇴장하기 구독 데이터:', data);

      if (data.type === 'GAME_LEAVE') {
        const { leftUser, remainingUsers } = data.data;

        setLeftUsers(prev => [...prev, leftUser]);
        setUserProgress(remainingUsers);
      }
    });

    return () => {
      // 모든 구독 해제
    };
  }, [gameId]);

  // ✅ 사이드 문제 요청
  const requestSideProblem = () => {
    sendMessage(`/pub/side/receive`, { gameId, teamId: userRoomId });

    console.log('📨 사이드 문제 요청 전송');
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
    <div className="flex h-screen bg-primary-black border-t border-gray-04">
      <div className="min-w-[23em] max-w-[30rem] border-r border-gray-04">
        <ProblemInfo />
      </div>

      <div className="max-w-[65rem] flex-[46rem] border-r border-gray-04">
        <CodeEditor code={code} setCode={setCode} language={language} setLanguage={setLanguage} />
        <Terminal output={output} />
        <div className="text-center">
          <IdeFooter
            code={code}
            language={language}
            setOutput={setOutput}
            userRoomId={userRoomId}
          />
        </div>
      </div>

      <div className="grow max-w-[15rem] min-w-[15rem]">
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
