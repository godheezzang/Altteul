import useGameStore from '@stores/useGameStore';

const ProblemInfo = () => {
  const problem = useGameStore((state) => state.problem);
  const testcases = useGameStore((state) => state.testcases);

  if (!problem || !testcases) {
    return null;
  }

  return (
    <div>
      <h2 className='text-lg font-semibold border-b border-gray-04 p-4'>
        {problem.problemId}. {problem.problemTitle}
      </h2>
      <div className='max-h-[30rem] min-h-[20rem] overflow-y-auto p-4 border-b border-gray-04'>
        <p className='mb-3 text-sm font-semibold text-gray-02'>문제 설명 </p>
        <p className='text-md font-regular'>{problem.description}</p>
      </div>

      <div className='p-4'>
        {testcases.map((testcase, index) => (
          <div key={testcase.testcaseId} className='rounded flex gap-2 mb-8'>
            <div className='basis-1/2 max-w-1/2x'>
              <p className='mb-2 text-sm font-semibold text-gray-02'>입력 예시 #{index + 1}</p>
              <div className='min-h-40 bg-gray-04 rounded-xs p-3 font-firacode text-sm'>{testcase.input}</div>
            </div>
            <div className='basis-1/2 max-w-1/2'>
              <p className='mb-2 text-sm font-semibold text-gray-02'>출력 예시 #{index + 1}</p>
              <div className='min-h-40 bg-gray-04 rounded-xs p-3 font-firacode text-sm'>{testcase.output}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemInfo;
