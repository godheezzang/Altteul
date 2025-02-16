import { useEffect, useState } from 'react';
import useGameStore from '@stores/useGameStore';
import { useSocketStore } from '@stores/socketStore';
import CodeEditor from '@components/Ide/CodeEditor';
import Terminal from '@components/Ide/Terminal';
import IdeFooter from '@components/Ide/IdeFooter';
import ProblemInfo from '@components/Ide/ProblemInfo';
import SideProblemModal from '@components/Ide/SideProblemModal';
import useAuthStore from '@stores/authStore';
import resize from '@assets/icon/resize.svg';

const MAX_REQUESTS = 5;

const TeamIdePage = () => {
  const { gameId, users, setUserRoomId, myTeam, matchId, opponent } = useGameStore();
  const { subscribe, sendMessage, connected } = useSocketStore();

  const [sideProblem, setSideProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'python' | 'java'>('python');
  const [showModal, setShowModal] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [output, setOutput] = useState<string>('');
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const { userId } = useAuthStore();
  const userRoomId = myTeam.roomId;
  const opponentRoomId = opponent.roomId;

  useEffect(() => {
    if (userRoomId) {
      setUserRoomId(userRoomId);
    }
  }, [userId, users, setUserRoomId]);

  useEffect(() => {
    if (!connected) return;

    // ✅ 사이드 문제 구독
    subscribe(`/sub/${gameId}/${userRoomId}/side-problem/receive`, data => {
      console.log('📩 사이드 문제 수신:', data);
      setSideProblem(data);
      setShowModal(true);
    });

    // ✅ 코드 채점 결과 구독
    subscribe(`/sub/${gameId}/${userRoomId}/team-submission/result`, data => {
      console.log('📩 코드 채점 결과 수신:', data);
    });

    // ✅ 상대 팀 채점 결과 구독
    subscribe(`/sub/${gameId}/${userRoomId}/opponent-submission/result`, data => {
      console.log('📩 상대 팀 채점 결과 수신:', data);
    });

    // 퇴장하기 구독
    subscribe(`/sub/single/room/${matchId}`, data => {
      console.log('퇴장하기 구독 데이터:', data);
    });

    return () => {
      // ✅ 구독 해제
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

  const handleResizeEditor = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setLeftPanelWidth(prevWidth => {
        const deltaX = (moveEvent.movementX / window.innerWidth) * 100;
        const newWidth = prevWidth + deltaX;
        return Math.max(20, Math.min(80, newWidth));
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="flex max-w-full h-screen mt-[3.5rem] bg-primary-black border-t border-gray-04">
      <div className="min-w-[23em] max-w-[30rem] border-gray-04">
        <ProblemInfo />
      </div>

      {/* ✅ 우리 팀과 상대 팀의 코드 에디터 표시 */}
      <div className="flex grow mt-4 max-w-full box-border">
        <div
          className="border-r pr-4 border-gray-04"
          style={{ width: `${leftPanelWidth}%`, minWidth: '20%' }}
        >
          <h2 className="text-center">우리 팀 코드</h2>
          <CodeEditor language={language} setLanguage={setLanguage} roomId={String(userRoomId)} />
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
        <div
          className="w-2 cursor-ew-resize bg-gray-03 hover:bg-gray-04 transition shrink-0 rounded-lg flex items-center justify-center"
          onMouseDown={handleResizeEditor}
        >
          <img src={resize} alt="코드 너비 조정" />
        </div>
        <div style={{ width: `${100 - leftPanelWidth}%`, minWidth: '20%' }} className="relative">
          <h2 className="text-center">상대 팀 코드</h2>
          <div className="absolute inset-0 backdrop-blur-md bg-black/30 pointer-events-none">
            <CodeEditor language={language} readOnly={true} roomId={String(opponentRoomId)} />
          </div>
        </div>
      </div>

      {/* ✅ 사이드 문제 모달 (팀원이 이미 풀었다면 결과 표시) */}
      {showModal && sideProblem && (
        <SideProblemModal
          gameId={gameId}
          roomId={userRoomId}
          problem={sideProblem?.data}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default TeamIdePage;
