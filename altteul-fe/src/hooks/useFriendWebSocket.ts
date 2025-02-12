import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useRef } from 'react';
import { useSocketStore } from '@stores/socketStore';
import useAuthStore from '@stores/authStore';

const USE_SSL = import.meta.env.VITE_USE_SSL === 'true';
const SOCKET_URL = USE_SSL ? import.meta.env.VITE_WSS_URL : import.meta.env.VITE_WS_URL;

export const useFriendWebSocket = () => {
  const stompClient = useRef<Client | null>(null);
  const { keepConnection } = useSocketStore();
  const { userId } = useAuthStore();

  useEffect(() => {
    if (!userId || !keepConnection) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      onConnect: () => {
        console.log('친구 소켓 연결 성공');
        // 친구 요청 알림을 구독
        client.subscribe(`/sub/notification/${userId}`, message => {
          try {
            const response = JSON.parse(message.body);
            if (response.type === 'SEND_REQUEST') {
              console.log('새로운 친구 요청:', response.data);
              // TODO: 친구 요청 목록 업데이트 등 필요한 처리
            }
          } catch (error) {
            console.error('메시지 파싱 에러:', error);
          }
        });
      },
      onDisconnect: () => {
        console.log('친구 소켓 연결 해제');
      },
      onStompError: error => {
        console.error('친구 소켓 에러:', error);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, [userId, keepConnection]);

  const sendFriendRequest = (toUserId: number) => {
    if (!stompClient.current?.connected) {
      console.error('소켓이 연결되어 있지 않습니다.');
      return;
    }

    stompClient.current.publish({
      destination: '/pub/friend/request',
      body: JSON.stringify({ toUserId }),
    });
  };

  return { sendFriendRequest };
};
