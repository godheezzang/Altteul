import useGameStore from '@stores/useGameStore';

const ProblemInfo = () => {
  const problem = useGameStore((state) => state.problem);
  const testcases = useGameStore((state) => state.testcases);

  if (!problem || !testcases) {
    return null;
  }

  return (
    <div className='p-4 bg-gray-800'>
      <h2 className='text-xl font-semibold mb-4'>
        {problem.problemId}. {problem.problemTitle}
      </h2>
      <div>
        <span className='text-gray-400'>문제 설명 </span>
        <p className='mt-2'>{problem.description}</p>
      </div>

      <div className='mt-6'>
        {testcases.map((testcase) => (
          <div key={testcase.testcaseId} className='mb-4 p-3 rounded flex gap-2 '>
            <div>
              <p>입력 예시</p>
              <div className='bg-gray-04 rounded p-3'>{testcase.input}</div>
            </div>
            <div>
              <p>출력 예시</p>
              <div className='bg-gray-04 rounded p-3'>{testcase.output}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemInfo;
