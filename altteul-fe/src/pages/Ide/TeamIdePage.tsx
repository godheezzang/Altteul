// TeamIdePage.tsx
import React, { useEffect, MutableRefObject } from 'react';
import CodeEditor from '@components/Ide/CodeEditor';
import Terminal from '@components/Ide/Terminal';
import IdeFooter from '@components/Ide/IdeFooter';
import ProblemInfo from '@components/Ide/ProblemInfo';
import GameUserList from '@components/Ide/GameUserList';
import { Cursor } from '@hooks/useIde';
import * as monaco from 'monaco-editor';
import { TeamInfo } from 'types/types';

interface TeamIdePageProps {
  code: string;
  setCode: (code: string) => void;
  partnerCode: string;
  language: 'python' | 'java';
  setLanguage: (lang: 'python' | 'java') => void;
  output: string;
  editorRef: MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  handleCodeExecution: () => void;
  handleCursorChange: (cursor: Cursor) => void;
  teamMembers: TeamInfo;
  opponentMembers: TeamInfo;
}

const TeamIdePage: React.FC<TeamIdePageProps> = ({
  code,
  setCode,
  partnerCode,
  language,
  setLanguage,
  output,
  editorRef,
  handleCodeExecution,
  handleCursorChange,
  teamMembers,
  opponentMembers,
}) => {
  useEffect(() => {
    // 게임 시작 후 소켓 연결
    // TODO: Implement socket connection logic
  }, []);

  const handleCodeSubmit = () => {
    // 코드 제출: socket
    // TODO: Implement code submission logic
  };

  return (
    <div className="flex h-screen bg-primary-black border-t border-gray-04">
      <div className="min-w-[23rem] border-r border-gray-04">
        <ProblemInfo />
      </div>
      <div className="flex-1 flex">
        <div className="w-1/2 flex flex-col">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            onCursorChange={handleCursorChange}
            ref={editorRef}
          />
          <Terminal output={output} />
          <IdeFooter onExecute={handleCodeExecution} />
        </div>
        <div className="w-1/2 border-r border-gray-04">
          <CodeEditor
            code={partnerCode}
            setCode={() => {}}
            language={language}
            setLanguage={() => {}}
            onCursorChange={() => {}}
            readonly
          />
        </div>
      </div>
      <div className="min-w-[13rem] border-l border-gray-04">
        <GameUserList teamMembers={teamMembers} opponentMembers={opponentMembers} />
      </div>
    </div>
  );
};

export default TeamIdePage;
