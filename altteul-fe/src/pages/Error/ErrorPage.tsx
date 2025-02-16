import MediumButton from '@components/Common/Button/MediumButton';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-black flex items-center justify-center relative overflow-hidden">
      {/* 좌측 상단 오렌지 링 */}
      <div className="absolute -top-[10rem] -left-[10rem] w-96 h-96 border-[2rem] border-primary-orange rounded-full opacity-50"></div>

      {/* 우측 상단 오렌지 링 */}
      <div className="absolute top-[2rem] -right-[9rem] w-72 h-72 border-[2rem] border-primary-orange rounded-full opacity-50"></div>

      {/* 점들 왼쪽 */}
      <div className="absolute right-[65rem] top-[25rem] grid grid-cols-7 gap-4 opacity-50">
        {[...Array(49)].map((_, index) => (
          <div key={index} className="w-1 h-1 bg-primary-orange rounded-full"></div>
        ))}
      </div>

      {/* 점들 오른쪽 */}
      <div className="absolute right-[2rem] top-[33rem] grid grid-cols-7 gap-4 opacity-50">
        {[...Array(49)].map((_, index) => (
          <div key={index} className="w-1 h-1 bg-primary-orange rounded-full"></div>
        ))}
      </div>

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
        <div className="flex justify-center space-x-4">
          <MediumButton
            onClick={() => navigate('/')}
            className="text-sm mt-2 bg-secondary-orange hover:bg-primary-orange transition-colors duration-300"
          >
            메인 페이지로
          </MediumButton>
          <MediumButton
            onClick={() => window.history.back()}
            backgroundColor="gray-04"
            fontColor="primary-white"
            className="text-sm mt-2 hover:bg-gray-03 transition-colors duration-300"
          >
            이전 페이지로
          </MediumButton>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
