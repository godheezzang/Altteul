import CodeEditor from '@components/Ide/CodeEditor';
import GameUserList from '@components/Ide/GameUserList';
import ProblemInfo from '@components/Ide/ProblemInfo';
import Terminal from '@components/Ide/Terminal';
import useGameStore from '@stores/useGameStore';
import { mockGameData } from 'mocks/gameData';
import { useEffect } from 'react';

const SingleIdePage = () => {
  const { setProblem, setTestcases } = useGameStore();

  useEffect(() => {
    const { problem, testcases } = mockGameData.data;
    setProblem(problem);
    setTestcases(testcases);
  }, []);

  return (
    <div className='flex h-screen bg-primary-black border-t border-gray-04'>
      <div className=' min-w-[30rem] border-r border-gray-04'>
        <ProblemInfo />
      </div>
      <div className='max-w-[65rem] flex-[46rem] border-r border-gray-04'>
        <CodeEditor />
        <Terminal />
        <div>ide footer</div>
      </div>
      <div className='min-w-[20rem]'>
        <GameUserList />
      </div>
    </div>
  );
};

export default SingleIdePage;
