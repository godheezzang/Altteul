import { useState, useEffect } from 'react';
import useGameWebSocket from '@hooks/useGameWebSocket';
import SmallButton from '@components/Common/Button/SmallButton ';

interface SideProblemModalProps {
  gameId: number;
  roomId: number;
  problem: {
    id: number;
    title: string;
    description: string;
  };
  onClose: () => void;
}

const SideProblemModal = ({ gameId, roomId, problem, onClose }: SideProblemModalProps) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 제출 중 상태
  const [submissionResult, setSubmissionResult] = useState<string | null>(null); // ✅ 제출 결과 상태
  const [showForfeitMessage, setShowForfeitMessage] = useState(false); // ✅ 포기 메시지 상태
  const { submitSideProblemAnswer, sideProblemResult } = useGameWebSocket(gameId, roomId);

  // ✅ 제출 버튼 클릭 시
  const handleSubmit = () => {
    if (!answer.trim() || isSubmitting) return;

    setIsSubmitting(true); // ✅ 로딩 시작
    const upperCaseAnswer = answer.toUpperCase();
    submitSideProblemAnswer(problem.id, upperCaseAnswer);
  };

  // ✅ 서버에서 결과를 받으면 정답 여부 확인
  useEffect(() => {
    if (sideProblemResult && isSubmitting) {
      setIsSubmitting(false);
      console.log('📩 사이드 문제 채점 결과 수신:', sideProblemResult);

      // 서버 응답 구조 반영하여 결과 처리
      if (sideProblemResult?.data.status === 'P') {
        setSubmissionResult(`🎉 사이드 문제를 풀었습니다! ${sideProblemResult?.data.bonusPoint} 포인트 추가!`);
      } else {
        setSubmissionResult('❌ 사이드 문제를 풀지 못했어요. 포인트 획득 실패');
      }
    }
  }, [sideProblemResult, isSubmitting]);

  // ✅ 안풀래요 버튼 클릭 시
  const handleForfeit = () => {
    setShowForfeitMessage(true); // 포기 메시지 표시
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-primary-black p-8 rounded-md shadow-side w-[30rem] shadow-gray-03">
        <div className="text-center mb-6">
          <h1 className="text-xxl font-semibold mb-1">보너스 문제!</h1>
          <p className="text-primary-orange">추가 점수를 획득할 수 있습니다.</p>
        </div>

        {/* ✅ 안풀래요 버튼을 누른 경우 */}
        {showForfeitMessage ? (
          <div className="text-center mt-6">
            <p className="text-gray-02 font-semibold">❌ 사이드 문제를 풀지 못해 추가 점수 획득을 하지 못했어요.</p>
            <SmallButton onClick={onClose} className="mt-4 px-4 py-2">
              확인
            </SmallButton>
          </div>
        ) : (
          <>
            {/* ✅ 제출 결과가 없을 때 문제 표시 */}
            {!submissionResult && (
              <>
                <div className="mb-10">
                  <p className="text-center mb-4">
                    힌트:
                    <span className="text-primary-orange font-semibold"> {problem.title}</span>
                  </p>
                  <p>{problem.description}</p>
                </div>

                {/* ✅ 사용자 입력 필드 */}
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="정답을 입력해주세요."
                    className="w-[15rem] px-4 py-2 rounded-md bg-gray-03"
                    disabled={isSubmitting} // ✅ 제출 중일 때 입력 막음
                  />
                  <SmallButton
                    onClick={handleSubmit}
                    className="px-4 py-2"
                    disabled={!answer.trim() || isSubmitting} // ✅ 로딩 중 또는 빈 값이면 비활성화
                  >
                    {isSubmitting ? '제출 중...' : '제출'}
                  </SmallButton>
                  <SmallButton onClick={handleForfeit} className="px-4 py-2" backgroundColor="gray-03">
                    안풀래요
                  </SmallButton>
                </div>
              </>
            )}

            {/* ✅ 제출 결과 표시 */}
            {submissionResult && (
              <div className="text-center mt-6">
                <p className={sideProblemResult?.data.status === 'P' ? 'text-primary-orange font-bold' : 'text-gray-04 font-bold'}>
                  {submissionResult}
                </p>
                <SmallButton onClick={onClose} className="mt-4 px-4 py-2">
                  확인
                </SmallButton>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SideProblemModal;
