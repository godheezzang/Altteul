import { MODAL_TYPES, GAME_TYPES, RESULT_TYPES } from "types/modalTypes";
import useModalStore from "@stores/modalStore";

const MainPage = () => {
  const { openModal, closeModal, isOpen } = useModalStore();

  const singleSuccess = () => {
    openModal(MODAL_TYPES.RESULT, {
      type: GAME_TYPES.SINGLE,
      result: RESULT_TYPES.SUCCESS,
    });
  };

  const singleFailure = () => {
    openModal(MODAL_TYPES.RESULT, {
      type: GAME_TYPES.SINGLE,
      result: RESULT_TYPES.FAILURE,
    });
  };

  const teamWin = () => {
    openModal(MODAL_TYPES.RESULT, {
      type: GAME_TYPES.TEAM,
      result: RESULT_TYPES.SUCCESS,
    });
  }

  const teamLose = () => {
    openModal(MODAL_TYPES.RESULT, {
      type: GAME_TYPES.TEAM,
      result: RESULT_TYPES.FAILURE,
    });
  }

  return (
    <>
      <h1 className="text-primary-white">main</h1>
      <button
        onClick={singleSuccess}
        className="px-3 py-1 bg-primary-orange text-primary-white rounded-lg hover:bg-secondary-orange hover:text-gray-01 transition-colors"
      >
        개인전 해결
      </button>
      <button
        onClick={singleFailure}
        className="px-3 py-1 bg-primary-orange text-primary-white rounded-lg hover:bg-secondary-orange hover:text-gray-01 transition-colors"
      >
        개인전 실패(고의 종료)
      </button>
      <button
        onClick={teamWin}
        className="px-3 py-1 bg-primary-orange text-primary-white rounded-lg hover:bg-secondary-orange hover:text-gray-01 transition-colors"
      >
        팀전 승리
      </button>
      <button
        onClick={teamLose}
        className="px-3 py-1 bg-primary-orange text-primary-white rounded-lg hover:bg-secondary-orange hover:text-gray-01 transition-colors"
      >
        팀전 패배
      </button>
    </>
  );
};

export default MainPage;
