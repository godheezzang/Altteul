import SignUpModal from "@components/auth/SignUpModal";
import LoginModal from "@components/auth/LoginModal"; // 로그인 모달도 있다면
import useModalStore from "@stores/modalStore";

const ModalManager = () => {
  const { closeModal, isOpen } = useModalStore();

  return (
    <>
      <SignUpModal isOpen={isOpen("signup")} onClose={() => closeModal()} />
      {/* 다른 전역 모달들도 여기에 추가 */}
    </>
  );
};

export default ModalManager;
