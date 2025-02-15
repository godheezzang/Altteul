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

const MAX_REQUESTS = 5;

const SingleIdePage = () => {
  const { gameId, roomId, users } = useGameStore();
  const { connect, subscribe, sendMessage, connected } = useSocketStore();

  const [sideProblem, setSideProblem] = useState(null);
  const [sideProblemResult, setSideProblemResult] = useState(null);
  const [completeUsers, setCompleteUsers] = useState<Set<number>>(new Set());
  const [userProgress, setUserProgress] = useState<Record<number, number>>({});

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'python' | 'java'>('python');
  const [showModal, setShowModal] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [output, setOutput] = useState<string>('');
  const { token } = useAuthStore();

  useEffect(() => {
    if (!connected && token) {
      console.log('소켓 연결 안됨, 재연결');
      connect();
      window.location.reload();
    } else {
      console.log('소켓 연결 됨');
    }
  }, [connected, connect]);

  useEffect(() => {
    if (!connected) return;

    // 사이드 문제 구독
    subscribe(`/sub/${gameId}/${roomId}/side-problem/receive`, data => {
      console.log('📩 사이드 문제 수신:', data);
      setSideProblem(data);
      setShowModal(true);
    });

    // 사이드 문제 채점 결과 구독
    subscribe(`/sub/${gameId}/${roomId}/side-problem/result`, data => {
      console.log('📩 사이드 문제 채점 결과 수신:', data);
      setSideProblemResult(data);
    });

    // 코드 채점 결과 구독
    subscribe(`/sub/${gameId}/${roomId}/team-submission/result`, data => {
      console.log('📩 코드 채점 결과 수신:', data);
      setCompleteUsers(prev => {
        const newSet = new Set(prev);
        if (data.status === 'P' && data.passCount === data.totalCount) {
          newSet.add(Number(localStorage.getItem('userId')));
        }
        return newSet;
      });

      setUserProgress(prev => ({
        ...prev,
        [Number(localStorage.getItem('userId'))]:
          data.status === 'F' ? Math.round((data.passCount / data.totalCount) * 100) : 100,
      }));
    });

    // 상대 팀 코드 채점 결과 구독
    subscribe(`/sub/${gameId}/${roomId}/opponent-submission/result`, data => {
      console.log('📩 상대 코드 채점 결과 수신:', data);
    });

    return () => {
      // 모든 구독 해제
    };
  }, [connected, gameId, roomId, subscribe]);

  // ✅ 사이드 문제 요청
  const requestSideProblem = () => {
    sendMessage(`/pub/side/receive`, { gameId, teamId: roomId });

    console.log('📨 사이드 문제 요청 전송');
  };

  // ✅ 알고리즘 코드 제출
  const submitCode = (problemId: number, lang: string, code: string) => {
    sendMessage(`/pub/judge/submition`, { gameId, teamId: roomId, problemId, lang, code });
    console.log('📨 알고리즘 코드 제출 요청 전송');
  };

  // ✅ 10분마다 자동으로 사이드 문제 요청
  useEffect(() => {
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
      10 * 5 * 1000
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
          <IdeFooter code={code} language={language} setOutput={setOutput} />
        </div>
      </div>

      <div className="grow max-w-[15rem] min-w-[15rem]">
        <GameUserList users={users} completeUsers={completeUsers} userProgress={userProgress} />
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
