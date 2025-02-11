import { useState } from 'react';
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
  const { submitSideProblemAnswer } = useGameWebSocket(gameId, roomId); // ✅ 모달 내부에서 WebSocket 사용

  const handleSubmit = () => {
    if (answer.trim()) {
      submitSideProblemAnswer(problem.id, answer);
      onClose(); // 모달 닫기
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-primary-black p-8 rounded-md shadow-side w-[30rem] shadow-gray-03">
        {/* <h2 className="text-xl font-bold mb-4">{problem.title}</h2> */}
        {/* <p className="text-gray-700 mb-4">{problem.description}</p> */}
        <div className="text-center mb-8">
          <h1 className="text-xxl font-semibold mb-1">보너스 문제!</h1>
          <p className="text-primary-orange">추가 점수를 획득할 수 있습니다.</p>
        </div>

        <div className="mb-10">
          <p>
            네트워크에서 데이터를 전송하는 데 사용하는 규약으로, IP 주소와 함께 사용되며, 웹 페이지
            요청 및 전송 등에 사용되는 프로토콜은?
          </p>
        </div>

        {/* ✅ 사용자 입력 필드 */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="정답을 입력해주세요."
            className="w-[15rem] px-4 py-2 rounded-md bg-gray-03"
          />
          <SmallButton
            onClick={handleSubmit}
            className="px-4 py-2 "
            disabled={!answer.trim()} // 빈 입력 방지
          >
            제출
          </SmallButton>
          <SmallButton onClick={onClose} className="px-4 py-2" backgroundColor="gray-03">
            안풀래요
          </SmallButton>
        </div>
      </div>
    </div>
  );
};

export default SideProblemModal;
