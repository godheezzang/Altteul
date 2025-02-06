import { useState, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { User } from 'types/types';

interface WebSocketMessage {
  type: 'ENTER' | 'LEAVE';
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
}

const useMatchWebSocket = (roomId: number): UseMatchWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [c_waitUsers, setWaitUsers] = useState<User[]>([]);
  const [c_leaderId, setLeaderId] = useState<number>(0);
  const [client, setClient] = useState<Client | null>(null);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    const { type, data } = message;
    
    switch (type) {
      case 'ENTER':
        setLeaderId(data.leaderId);
        setWaitUsers(data.users);
        break;
      case 'LEAVE':
        setLeaderId(data.leaderId);
        setWaitUsers(data.remainingUsers || []);
        break;
      default:
        console.warn('알 수 없는 메시지 타입:', type);
    }
  }, []);

  useEffect(() => {
    const stompClient = new Client({
      debug: (str) => console.log('STOMP:', str),
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        // Authorization: `Bearer ${localStorage.getItem('token')}`,
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTUsImlhdCI6MTczODg2MTQyOCwiZXhwIjoxNzM4ODk3NDI4fQ.7CidmQ8INT9hTv653-wJF54lIBm7f-E2PCHM1DDcnxY `
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log("테스트 콘솔창")
      setIsConnected(true);
      setError(null);
      
      stompClient.subscribe(`/sub/single/room/${roomId}`, (message) => {
        try {
          const parsedMessage = JSON.parse(message.body);
          handleMessage(parsedMessage);
        } catch (err) {
          console.error('메시지 파싱 에러:', err);
          setError(err instanceof Error ? err : new Error('메시지 처리 중 오류 발생'));
        }
      });
    };

    stompClient.onStompError = (frame) => {
      const newError = new Error(`WebSocket 오류: ${frame.headers.message}`);
      setError(newError);
      setIsConnected(false);
    };

    stompClient.onWebSocketError = (error) => {
        console.error('WebSocket Error:', error);
    };

    stompClient.onWebSocketClose = () => {
      setIsConnected(false);
    };

    setClient(stompClient);
    stompClient.activate();

    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [roomId, handleMessage]);

  useEffect(() => {
    const handleBeforeUnload = () => {
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
    c_leaderId
  };
};

export default useMatchWebSocket;