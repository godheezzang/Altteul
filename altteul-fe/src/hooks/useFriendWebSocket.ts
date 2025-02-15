import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useRef } from 'react';
import { useSocketStore } from '@stores/socketStore';
import useAuthStore from '@stores/authStore';

const USE_SSL = import.meta.env.VITE_USE_SSL === 'true';
const SOCKET_URL = USE_SSL ? import.meta.env.VITE_WSS_URL : import.meta.env.VITE_WS_URL;

export const useFriendWebSocket = () => {
  const stompClient = useRef<Client | null>(null);
  const { userId } = useAuthStore();

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
