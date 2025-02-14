import { useEffect, useState } from 'react';
import useGameWebSocket from '@hooks/useGameWebSocket';
import useGameStore from '@stores/useGameStore';
import CodeEditor from '@components/Ide/CodeEditor';
import Terminal from '@components/Ide/Terminal';
import IdeFooter from '@components/Ide/IdeFooter';
import ProblemInfo from '@components/Ide/ProblemInfo';
import SideProblemModal from '@components/Ide/SideProblemModal';
import GameUserList from '@components/Ide/GameUserList';
import VoiceChat from '@components/Ide/VoiceChat';

const MAX_REQUESTS = 5;

const TeamIdePage = () => {
  const { gameId, roomId, users, problem } = useGameStore();
  const { sideProblem, requestSideProblem } = useGameWebSocket(gameId, roomId);

  const [code, setCode] = useState('');
  const [opponentCode, setOpponentCode] = useState('');
  const [language, setLanguage] = useState<'python' | 'java'>('python');
  const [showModal, setShowModal] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [output, setOutput] = useState<string>('');

  return (
    <div className="flex h-screen bg-primary-black border-t border-gray-04">
      <div className="min-w-[23em] border-r border-gray-04 flex flex-col">
        <ProblemInfo />
      </div>

      <div className="flex-[50rem] max-w-[50rem] border-r border-gray-04">
        <CodeEditor code={code} setCode={setCode} language={language} setLanguage={setLanguage} />
        <Terminal output={output} />
        <div className="text-center">
          <IdeFooter code={code} language={language} setOutput={setOutput} />
        </div>
      </div>

      <div className="w-[50rem] border-l border-gray-04">
        <CodeEditor
          code={opponentCode}
          setCode={setOpponentCode}
          language={language}
          setLanguage={setLanguage}
        />
        <VoiceChat />
      </div>

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

export default TeamIdePage;
