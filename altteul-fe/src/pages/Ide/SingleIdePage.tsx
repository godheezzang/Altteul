import ProblemInfo from '@components/Ide/ProblemInfo';
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
    <div className='flex h-screen bg-gray-900'>
      <div className='w-[300px]'>
        <ProblemInfo />
      </div>
      {/* 다른 컴포넌트들 */}
    </div>
  );
};

export default SingleIdePage;
