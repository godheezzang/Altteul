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
    <div className='grid grid-cols-16 h-screen bg-primary-black border-t border-gray-04'>
      <div className='col-start-1 col-end-3 border-r border-gray-04'>
        <ProblemInfo />
      </div>
      <div className='col-start-3 col-end-11 border-r border-gray-04'>
        <CodeEditor />
        <Terminal />
        <div>ide footer</div>
      </div>
      <div className='col-start-11 col-end-16'>
        <GameUserList />
      </div>
    </div>
  );
};

export default SingleIdePage;
