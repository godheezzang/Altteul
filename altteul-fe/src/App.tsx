import GameGnb from '@components/Nav/GameGnb';
import MainGnb from '@components/Nav/MainGnb';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ModalManager from '@components/Common/ModalManager';
import { UserSearchProvider } from 'contexts/UserSearchContext';
import { useEffect } from 'react';
import { useSocketStore } from '@stores/socketStore';
import { inviteResponse } from '@utils/Api/matchApi';
import socketResponseMessage from 'types/socketResponseMessage';

const App = () => {
  const location = useLocation();
  const isGamePage = location.pathname.startsWith('/game');
  const socket = useSocketStore();
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    const accessToken = sessionStorage.getItem('token');
    return !!accessToken;
  };

  //로그인 시 소켓 연결 유지
  useEffect(() => {
    const wasConnected = sessionStorage.getItem('wsConnected') === 'true';
    if (wasConnected && checkAuthStatus) {
      try{
        socket.connect() //로그인 성공시 소켓 연결
      }catch(error){
        console.log("소켓 연결 error 발생")
      }
    }
  }, []);

  // 로그인 & 소켓 연결 성공 시 친구관련 구독 신청
  //TODO: App.tsx기 때문에 페이지에 따른 구독신청과 구독취소 관리 필요함(안하면 문제 풀다가 초대 요청 받을 수 있음)
  useEffect(() => {
    console.log("소켓 연결상태: ", socket.connected)
    const userId = sessionStorage.getItem('userId')
    if(socket.connected) {
      socket.subscribe(`/sub/invite/${userId}`, handleMessage)  //친구 초대 구독
    }
  }, [socket.connected])

  const handleMessage = async (message : socketResponseMessage) => {
    const {type, data} = message
    if (type === "INVITE_REQUEST_RECEIVED") {
      //TODO: confirm 말고 다른 방식의 요청 수락/거절 형식 필요
      if(confirm(`${data.nickname}님이 팀전에 초대하셨습니다.`)) {
        //TODO: 응답(res.status)에 따른 처리 필요
        const res = await inviteResponse(data.nickname, data.roomId, true)  //친구 초대 수락 api
        sessionStorage.setItem("matchData", JSON.stringify(data)) //구성창에서 쓰일 데이터 설정
        navigate(`/match/team/composition`)  //팀전 대기방으로 이동
      }
    }
  }

  const hideNavigation = [
    '/match/team/composition',
    '/match/team/search',
    '/match/team/final',
    '/match/single/search',
    '/match/single/final'
  ].includes(location.pathname);

  return (
    <UserSearchProvider>
      <div className="min-h-screen">
        {!hideNavigation && (isGamePage ? <GameGnb /> : <MainGnb />)}
        <main className="mt-[3.5rem] bg-primary-black h-[calc(100vh-3.5rem)]">
          <Outlet />
        </main>
        <ModalManager />
      </div>
    </UserSearchProvider>
  );
};

export default App;
