import GameGnb from '@components/Nav/GameGnb';
import MainGnb from '@components/Nav/MainGnb';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ModalManager from '@utils/ModalManager';
import { useEffect, useMemo } from 'react';
import { useSocketStore } from '@stores/socketStore';
import { inviteResponse } from '@utils/Api/matchApi';
import socketResponseMessage from 'types/socketResponseMessage';
import { MODAL_TYPES } from 'types/modalTypes';
import chatmodalimg from '@assets/icon/chatmodal.svg';

// 임시 친구모달 버튼
import useModalStore from '@stores/modalStore';
import { useMatchStore } from '@stores/matchStore';
import useFriendChatStore from '@stores/friendChatStore';
import useAuthStore from '@stores/authStore';

//react-Toastify
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';

const App = () => {
  const location = useLocation();
  const isGamePage = location.pathname.startsWith('/game');
  const socket = useSocketStore();
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const matchStore = useMatchStore();
  const { openModal } = useModalStore();
  const fcStore = useFriendChatStore();

  //로그인 시 소켓 연결 유지
  useEffect(() => {
    const wasConnected = sessionStorage.getItem('wsConnected') === 'true';
    if (wasConnected && !!sessionStorage.getItem('token')) {
      socket.connect(); //로그인 성공시 소켓 연결
    }
  }, []);

  // 로그인 & 소켓 연결 성공 시 친구관련 구독 신청
  //TODO: App.tsx기 때문에 페이지에 따른 구독신청과 구독취소 관리 필요함(안하면 문제 풀다가 초대 요청 받을 수 있음)
  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (socket.connected && userId) {
      socket.subscribe(`/sub/invite/${userId}`, handleMessage); //게임 초대 구독
      socket.subscribe(`/sub/notification/${userId}`, handleMessage); //친구 신청 구독
      socket.subscribe(`/sub/friend/update/${userId}`, handleMessage); //친구 수락/거절 구독
    }
  }, [socket.connected]);

  //전체 소켓 응답 메세지 핸들러
  const handleMessage = async (message: socketResponseMessage) => {
    const { type, data } = message;
    console.log(message);
    //요청을 받은 경우
    if (type === 'INVITE_REQUEST_RECEIVED') {
      //TODO: confirm 말고 다른 방식의 요청 수락/거절 형식 필요
      const accepted = confirm(`${data.nickname || '알 수 없음'}님이 팀전에 초대하셨습니다.`);

      if (accepted) {
        // 게임 초대 수락
        try {
          //TODO: 응답(res.status)에 따른 처리 필요
          const res = await inviteResponse(data.nickname, data.roomId, accepted); //게임 초대 수락 api
          matchStore.setMatchData(res.data); //초대받은 방으로 이동 후 쓰일 data setting
          alert(`${data.nickname}님의 대기방으로 이동합니다.`);
          navigate(`/match/team/composition`); //팀전 대기방으로 이동
        } catch (error) {
          console.error('초대 수락 중 오류 발생:', error);
        }
      }

      if (!accepted) {
        //게임 초대 거절
        const res = await inviteResponse(data.nickname, data.roomId, accepted); //게임 초대 거절 api
      }
    }

    //초대 거절 응답
    if (type === 'INVITE_REJECTED') {
      alert(data.note);
    }

    //초대 수락 응답
    if (type === 'INVITE_ACCEPTED') {
      alert(data.note);
    }

    if (type === 'SEND_REQUEST') {
      //친구 신청 받았을 때 데이터 FriendChatStore에 저장
      // fcStore.setFriendRequests(data.friendRequests)
      //TODO: 친구 신청이 왔다는 알림(?)
    }
  };

  const hideNavigation = useMemo(
    () =>
      new Set([
        '/match/team/composition',
        '/match/team/search',
        '/match/team/final',
        '/match/single/search',
        '/match/single/final',
      ]),
    []
  );

  const showFriendChatModalButton = [
    '/',
    '/rank',
    '/match/select',
    '/match/single/search',
    '/match/team/composition',
  ].includes(location.pathname);

  const transparentNavigation = useMemo(
    () => new Set(['/match/select', '/rank', `/users/${userId}`]),
    [userId]
  );

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen">
        {!hideNavigation.has(location.pathname) && (isGamePage ? <GameGnb /> : <MainGnb />)}
        <main className={`mt-[3.5rem] bg-primary-black h-[calc(100vh-3.5rem)]`}>
          <Outlet />
          {/* 친구채팅모달 */}
          {showFriendChatModalButton && !!sessionStorage.getItem('token') && (
            <button
              onClick={() => openModal(MODAL_TYPES.MAIN)}
              className="fixed bottom-5 right-5 z-50"
            >
              <img
                src={chatmodalimg}
                alt="친구채팅모달"
                className="w-[4rem] h-[4rem] object-contain"
              />
            </button>
          )}
        </main>
        <ModalManager />
      </div>
    </>
  );
};

export default App;
