import MediumButton from '@components/Common/Button/MediumButton';
import { useNavigate } from 'react-router-dom';
import errorbg from '@assets/background/error_page.svg';
import useAuthStore from '@stores/authStore';

const ErrorPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleMoveMain = () => {
    logout();
    navigate('/');
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${errorbg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="text-center">
        {/* 픽셀 스타일 404 */}
        <div className="text-[8rem] text-primary-white -mb-6">404</div>

        {/* 에러 메시지 */}
        <p className="text-primary-white text-xl mb-5">페이지를 찾을 수 없습니다.</p>
        <p className="text-gray-01 text-sm mb-6">
          죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
          <br />
          잘못된 주소이거나 삭제된 페이지일 수 있습니다.
        </p>

        {/* 버튼들 */}
        <MediumButton
          onClick={handleMoveMain}
          className="text-md mt-2 bg-secondary-orange hover:bg-primary-orange transition-colors duration-300"
        >
          메인 페이지로
        </MediumButton>
      </div>
    </div>
    // </div>
  );
};

export default ErrorPage;
