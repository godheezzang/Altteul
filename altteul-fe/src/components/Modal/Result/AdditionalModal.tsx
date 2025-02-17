// src/components/common/Modal/AdditionalModal.tsx
import React from 'react';
import Modal from '@components/Common/Modal';
import Button from '@components/Common/Button/Button';
import useModalStore from '@stores/modalStore';
import {
  MODAL_TYPES,
  GAME_TYPES,
  COMMON_MODAL_TYPES,
  GameType,
  CommonModalType,
} from 'types/modalTypes';

type AdditionalModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: GameType;
  modalType: CommonModalType;
};

const AdditionalModal = ({ isOpen, onClose, type, modalType }: AdditionalModalProps) => {
  const { openModal } = useModalStore();

  // 모달 타입에 따른 설정
  const getModalConfig = () => {
    if (modalType === COMMON_MODAL_TYPES.CODE) {
      return {
        title: '상대 팀 코드',
        content: `print("hello world")print("hello world")print("hello world")print("hello world")print("hello world")
        print("hello world")print("hello world")print("hello world")print("hello world")print("hello world")print("hello world")print("hello world")print("hello world")print("hello world")
        print("hello world")print("hello world")print("hello world")print("hello world")print("hello world")`,
      };
    } else {
      return {
        title: 'AI 코칭 결과',
        content: `안녕하세요! 코드를 살펴보니, 현재 이중 for문을 이용해서 시간 복잡도가 O(n^2)에 해당하는 전형적인 LIS 알고리즘을 사용 중이네요.
        정확성: 로직 자체는 입력받은 배열 arr에 대해, 각 원소 앞쪽의 모든 원소와 비교하며 dp 값을 갱신하기 때문에 문제 요구사항에 맞게 동작할 것으로 보입니다.
        효율성: n의 최댓값이 매우 클 경우, O(n^2) 알고리즘은 시간이 많이 걸릴 수 있습니다. 만약 더 빠른 해법이 필요하면 이분 탐색을 응용한 O(n log n) 알고리즘을 고려해볼 수도 있겠습니다. (정답 코드 제공은 생략합니다.)`,
      };
    }
  };

  const handleBack = () => {
    onClose();
    // type에 따라 다른 모달로 이동
    if (type === GAME_TYPES.SINGLE) {
      openModal(MODAL_TYPES.LIST);
    } else {
      openModal(MODAL_TYPES.NAVIGATE, { type: GAME_TYPES.TEAM });
    }
  };

  const config = getModalConfig();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="26rem"
      height="25rem"
      className="bg-primary-black relative overflow-hidden border-2 border-primary-orange shadow-orange"
    >
      <div className="flex flex-col items-center justify-center h-full w-full gap-6">
        <h2 className="text-white text-xl font-bold">{config.title}</h2>

        {/* 내용 표시 영역 */}
        <div className="w-80 h-64 bg-gray-900 rounded-lg overflow-hidden">
          <div className="p-4 font-mono text-sm h-full overflow-y-auto">
            <pre className="text-white whitespace-pre-wrap break-all">
              <code>{config.content}</code>
            </pre>
          </div>
        </div>

        {/* 이전으로 버튼 */}
        <Button
          onClick={handleBack}
          backgroundColor="primary-orange"
          className="px-8 py-2 relative w-80"
        >
          이전으로
        </Button>
      </div>
    </Modal>
  );
};

export default AdditionalModal;
