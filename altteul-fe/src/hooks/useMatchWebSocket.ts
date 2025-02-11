import { useState, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { User } from 'types/types';
import { useSocketStore } from '@stores/socketStore';

interface WebSocketMessage {
  type: 'ENTER' | 'LEAVE' | 'FINAL' | 'START';
  data: {
    leaderId: number;
    users: User[];
    remainingUsers?: User[];
  };
}

interface UseMatchWebSocketReturn {
  isConnected: boolean;
  error: Error | null;
  c_waitUsers: User[];
  c_leaderId: number;
  isFinal: boolean;
  isStart: boolean;
}

const SOCKET_URL = 'http://localhost:8080/ws';

const useMatchWebSocket = (roomId: number): UseMatchWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [c_waitUsers, setWaitUsers] = useState<User[]>([]);
  const [c_leaderId, setLeaderId] = useState<number>(0);
  const [client, setClient] = useState<Client | null>(null);
  const token = localStorage.getItem('token');
  const socketStore = useSocketStore();

  const handleMessage = useCallback((message: WebSocketMessage) => {
    const { type, data } = message;
    switch (type) {
      case 'ENTER':
        setLeaderId(data.leaderId);
        setWaitUsers(data.users);
        break;
      case 'LEAVE':
        setLeaderId(data.leaderId);
        setWaitUsers(data.users);
        break;
      case 'FINAL':
        setIsFinal(true);
        break;
      case 'START':
        setIsStart(true);
        break
      default:
        console.warn('알 수 없는 메시지 타입:', type);
    }
  }, []);

  useEffect(() => {
    console.log('Attempting to create STOMP client...');
    
    const stompClient = new Client({
      webSocketFactory: () => {
        const socket = new SockJS(SOCKET_URL, null, {
          transports: ['websocket'],
          timeout: 5000,
        });

        socket.onopen = () => {
          console.log('SockJS connection opened');
          console.log('Socket details:', {
            readyState: socket.readyState,
            url: socket.url,
            protocol: socket.protocol
          });
        };

        socket.onclose = (event) => {
          console.log('SockJS connection closed:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });
        };

        socket.onerror = (error) => {
          console.error('SockJS error:', error);
        };

        return socket;
      },
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log('STOMP Connected!', frame);
        setIsConnected(true);
        setError(null);
        
        stompClient.subscribe(`/sub/single/room/${roomId}`, (message) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            console.log("메세지(데이터) 수신!!", parsedMessage)
            handleMessage(parsedMessage);
          } catch (err) {
            console.error('메시지 파싱 에러:', err);
            setError(err instanceof Error ? err : new Error('메시지 처리 중 오류 발생'));
          }
        });
      },
      onDisconnect: (frame) => {
        console.log('STOMP Disconnected:', frame);
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame);
        setError(new Error(`STOMP error: ${frame.headers?.message || 'Unknown error'}`));
        setIsConnected(false);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket Error:', event);
        setError(new Error('WebSocket connection error'));
        setIsConnected(false);
      },
      onWebSocketClose: (event) => {
        console.log('WebSocket Closed:', event);
        setIsConnected(false);
      },
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
    });

    try {
      stompClient.activate();
      setClient(stompClient);
    } catch (err) {
      console.error('Failed to activate STOMP client:', err);
      setError(err instanceof Error ? err : new Error('Failed to activate connection'));
    }

    return () => {
      if (stompClient.active && !socketStore.keepConnection) {
        try {
          stompClient.deactivate();
        } catch (err) {
          console.error('Error during cleanup:', err);
        }
      }
    };
  }, [roomId, handleMessage, socketStore.keepConnection]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      socketStore.resetConnection();
      if (client?.active) {
        client.deactivate();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [client]);

  return {
    isConnected,
    error,
    c_waitUsers,
    c_leaderId,
    isFinal,
    isStart
  };
};

export default useMatchWebSocket;