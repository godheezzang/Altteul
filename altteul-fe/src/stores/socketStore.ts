// socketStore.ts
import { create } from 'zustand';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp, Frame, Message } from '@stomp/stompjs';
import socketResponseMessage from 'types/socketResponseMessage'

interface Subscription {
  id: string;
  callback: (data: any) => void;
}

interface SocketStore {
  // 상태
  client: CompatClient | null;
  connected: boolean;
  subscriptions: Map<string, Subscription>;
  reconnectAttempts: number;
  maxReconnectAttempts: number;

  // 메서드
  connect: () => void;
  disconnect: () => void;
  resetConnection: () => void;
  subscribe: (destination: string, callback: (data: any) => void) => void;
  unsubscribe: (destination: string) => void;
  sendMessage: (destination: string, message: any) => void;
  restoreSubscriptions: () => void;
}

// const SOCKET_URL = /ws || 'http://localhost:8080/ws';
const SOCKET_URL = 'http://localhost:8080/ws';
const RECONNECT_DELAY = 5000;
const MAX_RECONNECT_ATTEMPTS = 5;

const checkAuthStatus = () => {
  const accessToken = sessionStorage.getItem('token');
  return !!accessToken;
};

export const useSocketStore = create<SocketStore>((set, get) => ({
  client: null,
  connected: false,
  subscriptions: new Map(),
  reconnectAttempts: 0,
  maxReconnectAttempts: MAX_RECONNECT_ATTEMPTS,

  connect: () => {
    if (!checkAuthStatus()) {
      console.warn('No authentication token found');
      return;
    }

    const socket = new SockJS(SOCKET_URL);
    const stompClient = Stomp.over(socket);

    stompClient.configure({
      connectHeaders: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },

      debug: str => {
        console.debug(str);
      },
      reconnectDelay: RECONNECT_DELAY,

      onConnect: (frame: Frame) => {
        console.log('Connected:', frame);
        set({
          connected: true,
          reconnectAttempts: 0,
        });

        // 연결 성공 시 sessionStorage에 상태 저장
        sessionStorage.setItem('wsConnected', 'true');

        // 저장된 구독 정보가 있다면 복구
        get().restoreSubscriptions();
      },

      onStompError: (frame: Frame) => {
        console.error('STOMP error:', frame);
        const { reconnectAttempts, maxReconnectAttempts } = get();

        if (reconnectAttempts < maxReconnectAttempts) {
          set({ reconnectAttempts: reconnectAttempts + 1 });
          setTimeout(() => get().connect(), RECONNECT_DELAY);
        } else {
          console.error('Max reconnection attempts reached');
          get().resetConnection();
        }
      },
    });

    stompClient.activate();
    set({ client: stompClient });
  },

  disconnect: () => {
    const { client } = get();
    if (client && client.connected) {
      client.deactivate();
    }
    get().resetConnection();
    sessionStorage.removeItem('wsConnected');
    sessionStorage.removeItem('wsSubscriptions');
  },

  resetConnection: () => {
    set({
      client: null,
      connected: false,
      subscriptions: new Map(),
      reconnectAttempts: 0,
    });
  },

  subscribe: (destination: string, callback: (data: socketResponseMessage) => void) => {
    console.log("구독 신청 경로", destination)
    const { client, connected, subscriptions } = get();

    // 이미 구독중이면 종료
    if (subscriptions.has(destination)) {
      console.warn(`Already subscribed to ${destination}`);
      return;
    }

    //소켓 연결 자체가 안되어 있으면 종료
    if (!client || !connected) {
      console.warn('No active connection');
      return;
    }
    
    // 구독 설정
    const subscription = client.subscribe(destination, (message: Message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing message:', error); 
      }
    });

    // 구독 정보 저장
    subscriptions.set(destination, {
      id: subscription.id,
      callback,
    });
    set({ subscriptions: new Map(subscriptions) });

    // sessionStorage에 구독 목록 업데이트
    const activeSubscriptions = JSON.parse(sessionStorage.getItem('wsSubscriptions') || '[]');
    if (!activeSubscriptions.includes(destination)) {
      activeSubscriptions.push(destination);
      sessionStorage.setItem('wsSubscriptions', JSON.stringify(activeSubscriptions));
    }

    console.log('구독 신청 완료', destination);
  },

  unsubscribe: (destination: string) => {
    const { client, subscriptions } = get();
    const subscription = subscriptions.get(destination);

    if (client && subscription) {
      client.unsubscribe(subscription.id);
      subscriptions.delete(destination);
      set({ subscriptions: new Map(subscriptions) });

      // sessionStorage에서 구독 제거
      const activeSubscriptions = JSON.parse(sessionStorage.getItem('wsSubscriptions') || '[]');
      sessionStorage.setItem(
        'wsSubscriptions',
        JSON.stringify(activeSubscriptions.filter((sub: string) => sub !== destination))
      );
    }

    console.log('구독 취소 완료', destination);
  },

  sendMessage: (destination: string, message: any) => {    
    const { client, connected } = get();

    if (!client || !connected) {
      console.warn('No active connection');
      return;
    }

    client.publish({
      destination,
      body: JSON.stringify(message),
    });
    console.log('메시지 전송 요청');
    
  },

  restoreSubscriptions: () => {
    const activeSubscriptions = JSON.parse(sessionStorage.getItem('wsSubscriptions') || '[]');
    activeSubscriptions.forEach((destination: string) => {
      // 이미 구독 중인지 체크하고, 그렇다면 구독하지 않도록 처리
    if (!get().subscriptions.has(destination)) {
      get().subscribe(destination, () => {});
    }
    });
  },
}));
