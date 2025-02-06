import CodeEditor from '@components/Ide/CodeEditor';
import GameUserList from '@components/Ide/GameUserList';
import IdeFooter from '@components/Ide/IdeFooter';
import ProblemInfo from '@components/Ide/ProblemInfo';
import Terminal from '@components/Ide/Terminal';
import useGameStore from '@stores/useGameStore';
import axios from 'axios';
import { mockGameData } from 'mocks/gameData';
import { useEffect, useState } from 'react';

type TestCase = {
  testCaseId: number;
  testCaseNumber: number;
  status: string;
  output: string | null;
  answer: string;
};

const SingleIdePage = () => {
  const { setProblem, setTestcases, problem } = useGameStore();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<'python' | 'java'>('python');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const { problem, testcases } = mockGameData.data;
    setProblem(problem);
    setTestcases(testcases);
  }, []);

  // TODO: 테스트 필요
  const handleCodeExecution = async () => {
    try {
      const response = await axios.post('/api/judge/execution', {
        // TODO: 실제 데이터로 교체
        gameId: 1,
        teamId: 2,
        problemId: problem.problemId,
        lang: language === 'python' ? 'PY' : 'JV',
        code: code,
      });

      if (response.data.isNotCompileError) {
        let output = '';
        response.data.testCases.forEach((testCase: TestCase) => {
          output += `테스트케이스 ${testCase.testCaseNumber}: \n`;

          let statusMessage = '';
          switch (testCase.status) {
            case 'F':
              statusMessage = '실패 (Fail)';
              break;
            case 'P':
              statusMessage = '통과 (Pass)';
              break;
            case 'RUN':
              statusMessage = '런타임 에러 (Runtime Error)';
              break;
            case 'TLE':
              statusMessage = '시간 초과 (Time limit exceed)';
              break;
            default:
              statusMessage = '알 수 없는 상태';
          }

          output += `결과: ${statusMessage} \n`;
          output += `출력: ${testCase.output}\n`;
          output += `정답: ${testCase.answer}\n\n`;
        });
      } else {
        setOutput(`컴파일 에러(Compile Error): ${response.data.message}`);
      }
    } catch (error) {
      setOutput('에러가 발생했습니다.');
    }
  };

  return (
    <div className='flex h-screen bg-primary-black border-t border-gray-04'>
      <div className=' min-w-[30rem] border-r border-gray-04'>
        <ProblemInfo />
      </div>
      <div className='max-w-[65rem] flex-[46rem] border-r border-gray-04'>
        <CodeEditor code={code} setCode={setCode} language={language} setLanguage={setLanguage} />
        <Terminal output={output} />
        <IdeFooter onExecute={handleCodeExecution} />
      </div>
      <div className='min-w-[20rem]'>
        <GameUserList />
      </div>
    </div>
  );
};

export default SingleIdePage;
