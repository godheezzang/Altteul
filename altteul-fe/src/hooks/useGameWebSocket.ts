import { useState, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useSocketStore } from '@stores/socketStore';
import useGameStore from '@stores/useGameStore';

const SOCKET_URL =
  import.meta.env.NODE_ENV === 'development'
    ? import.meta.env.VITE_SOCKET_URL_PROD
    : import.meta.env.VITE_SOCKET_URL_DEV;

const useGameWebSocket = (gameId: number, roomId: number) => {
  const { users, setUsers } = useGameStore();
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [sideProblem, setSideProblem] = useState(null);
  const [sideProblemResult, setSideProblemResult] = useState(null);
  const [codeResult, setCodeResult] = useState(null);
  const [opponentCodeResult, setOpponentCodeResult] = useState(null);
  const socketStore = useSocketStore();

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      connectHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('✅ STOMP Connected (Game WebSocket)');
        setStompClient(client); // ✅ `stompClient` 상태 설정
      },
      onDisconnect: () => {
        console.log('🔴 STOMP Disconnected (Game WebSocket)');
      },
    });

    client.activate();

    return () => {
      if (client.active && !socketStore.keepConnection) {
        client.deactivate();
      }
    };
  }, [gameId, roomId, socketStore.keepConnection]);

  /** ✅ stompClient가 변경될 때 구독 실행 */
  useEffect(() => {
    if (stompClient?.connected) {
      subscribeToSideProblem();
      subscribeToSideProblemResult();
      subscribeToCodeResult();
      subscribeToOpponentCodeResult();
    } else {
      console.warn('⚠️ stompClient가 아직 연결되지 않음. 구독 보류');
    }
  }, [stompClient]); // ✅ stompClient가 설정되었을 때 실행!

  /** ✅ 사이드 문제 요청 */
  const requestSideProblem = useCallback(() => {
    if (stompClient?.connected) {
      stompClient.publish({
        destination: `/pub/side/receive`,
        body: JSON.stringify({ gameId: gameId, teamId: roomId }),
      });
      console.log('📨 사이드 문제 요청 전송');
    }
  }, [stompClient, gameId, roomId]);

  /** ✅ 사이드 문제 구독 */
  const subscribeToSideProblem = () => {
    if (stompClient?.connected) {
      stompClient.subscribe(`/sub/${gameId}/${roomId}/side-problem/receive`, message => {
        const data = JSON.parse(message.body);
        console.log('📩 사이드 문제 수신 성공:', data);
        setSideProblem(data);
      });
    } else {
      console.warn('구독 실패');
    }
  };

  /** ✅ 사이드 문제 제출 */
  const submitSideProblemAnswer = useCallback(
    (sideProblemId: number, answer: string) => {
      if (stompClient?.connected) {
        stompClient.publish({
          destination: `/pub/side/submit`,
          body: JSON.stringify({ gameId: gameId, teamId: roomId, sideProblemId, answer }),
        });
        console.log('📨 사이드 문제 채점 요청 전송');
      }
    },
    [stompClient, gameId, roomId]
  );

  /** ✅ 사이드 문제 채점 결과 구독 */
  const subscribeToSideProblemResult = () => {
    if (stompClient?.connected) {
      stompClient.subscribe(`/sub/${gameId}/${roomId}/side-problem/result`, message => {
        const data = JSON.parse(message.body);
        console.log('📩 사이드 문제 채점 결과 수신:', data);
        setSideProblemResult(data);
      });
    }
  };

  /** ✅ 알고리즘 코드 제출 */
  const submitCode = useCallback(
    (problemId: number, lang: string, code: string) => {
      if (stompClient?.connected) {
        const payload = { gameId: gameId, teamId: roomId, problemId, lang, code }
        stompClient.publish({
          destination: `/pub/judge/submition`,
          body: JSON.stringify({ gameId: gameId, teamId: roomId, problemId: 1, lang, code }),
        });
        console.log(payload);
        
        console.log('📨 알고리즘 코드 제출 요청 전송');
      }
    },
    [stompClient, gameId, roomId]
  );

  /** ✅ 코드 채점 결과 구독 */
  const subscribeToCodeResult = () => {
    if (stompClient?.connected) {
      stompClient.subscribe(`/sub/${gameId}/${roomId}/team-submission/result`, message => {
        const data = JSON.parse(message.body);
        console.log('📩 코드 채점 결과 수신:', data);
        setCodeResult(data);

        if (data.status === "P") {
          const myUserId = localStorage.getItem("userId")
        }
      });
    }
  };

  const subscribeToOpponentCodeResult = () => {
    if (stompClient?.connected) {
      stompClient.subscribe(`/sub/${gameId}/${roomId}/opponent-submission/result`, message => {
        const data = JSON.parse(message.body);
        console.log('상대 코드 채점 결과 수신', data);

        setOpponentCodeResult(data);
      });
    }
  };

  const updateUserStatus = (userId: number) => {
    setUsers(
      users.map(user => user.userId === userId ? { ...user, status: "P"}: user)
    )
  }

  return {
    sideProblem,
    sideProblemResult,
    codeResult,
    opponentCodeResult,
    requestSideProblem,
    submitSideProblemAnswer,
    submitCode,
  };
};

export default useGameWebSocket;
