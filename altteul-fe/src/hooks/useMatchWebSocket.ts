import { useState, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { GameState, Problem, TestCase, User } from 'types/types';
import { useSocketStore } from '@stores/socketStore';

const SOCKET_URL = import.meta.env.MODE === 'production'
  ? `${window.location.origin}/ws`  // 현재 접속한 도메인 기준으로 WebSocket 연결 // 브라우저가 접근 가능한 주소 사용
  : import.meta.env.VITE_SOCKET_URL_DEV;

console.log('SOCKET_URL:', SOCKET_URL);
interface WebSocketMessage {
  type: 'ENTER' | 'LEAVE' | 'COUNTING' | 'GAME_START';
  data: {
    leaderId: number;
    users: User[];
    remainingUsers?: User[];

    //couting message
    time: number;

    //game start message
    gameId: number;
    problem: Problem
    testcases: TestCase[]
  };
}

interface UseMatchWebSocketReturn {
  isConnected: boolean;
  error: Error | null;
  c_waitUsers: User[];
  c_leaderId: number;
  isStart: boolean;
  count: number;
  gameData: {gameId:number, users:User[], problem:Problem, testcases:TestCase[]};
}

const useMatchWebSocket = (roomId: number): UseMatchWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [count, setCount] = useState<number>();
  const [isStart, setIsStart] = useState(false);
  const [gameData, setGameData] = useState<{gameId:number, users:User[], problem:Problem, testcases:TestCase[]}>()
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
      case 'COUNTING':
        setCount(data.time);
        break;
      case 'GAME_START':
        setIsStart(true);
        setGameData({
          gameId: data.gameId,
          users: data.users,
          problem: data.problem,
          testcases: data.testcases
        })
        break
      default:
        console.warn('알 수 없는 메시지 타입:', type);
    }
  }, []);

  useEffect(() => {
    if (socketStore.keepConnection) {
      console.log('소켓 연결 유지 중이므로 연결 시도하지 않음');
      return
    }
    console.log('Attempting to create STOMP client with URL:', SOCKET_URL);
    console.log('Current location:', window.location.href);
    
    const stompClient = new Client({
      webSocketFactory: () => {
        const socket = new SockJS(SOCKET_URL, null, {
          transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
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
            wasClean: event.wasClean,
            type: event.type,
            target: event.target
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
        // 디버그 시 사용할 로그
        // console.log('STOMP Debug:', str);
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
    isStart,
    count,
    gameData
  };
};

export default useMatchWebSocket;