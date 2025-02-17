import UserProfileImg from '@components/Common/UserProfileImg';
import useAuthStore from '@stores/authStore';
import { useSocketStore } from '@stores/socketStore';
import useGameStore from '@stores/useGameStore';
import { OpenVidu, Publisher, Session, Subscriber } from 'openvidu-browser';
import { useEffect, useRef, useState } from 'react';
import { User } from 'types/types';
import { JL } from 'jsnlog';

JL.setOptions({ enabled: false });

interface VoiceChatProps {
  roomId: number;
  voiceToken: string;
}

const VoiceChat = ({ roomId, voiceToken }: VoiceChatProps) => {
  const { gameId, myTeam, opponent } = useGameStore();
  const { userId, token } = useAuthStore();
  const { subscribe, sendMessage } = useSocketStore();

  const [session, setSession] = useState<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userMicStatus, setUserMicStatus] = useState<{ [key: string]: boolean }>({});

  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  // const initializeSession = async () => {
  //   if (!voiceToken) return;

  //   const OV = new OpenVidu();
  //   const newSession = OV.initSession();

  //   newSession.on('streamCreated', event => handleStreamCreated(newSession, event));
  //   newSession.on('streamDestroyed', handleStreamDestroyed);

  //   try {
  //     await newSession.connect(voiceToken, { clientData: userId });

  //     const newPublisher = OV.initPublisher(undefined, {
  //       audioSource: undefined,
  //       videoSource: false,
  //       publishAudio: true,
  //       resolution: '640x480',
  //       frameRate: 30,
  //       insertMode: 'APPEND',
  //       mirror: false,
  //     });

  //     newSession.publish(newPublisher);
  //     setPublisher(newPublisher);
  //     setSession(newSession);
  //   } catch (error) {
  //     console.error('오디오 세션 연결 실패:', error);
  //   }
  // };

  // const handleStreamCreated = (newSession: Session, event: any) => {
  //   const subscriber = newSession.subscribe(event.stream, undefined);
  //   setSubscribers(prev => [...prev, subscriber]);

  //   subscriber.on('streamPlaying', () => {
  //     const userId = event.stream.connection.data;
  //     if (!audioRefs.current[userId]) {
  //       const audioElement = new Audio();
  //       audioElement.srcObject = subscriber.stream.getMediaStream();
  //       audioElement.autoplay = true;
  //       audioRefs.current[userId] = audioElement;
  //     }
  //   });
  // };

  // const handleStreamDestroyed = (event: any) => {
  //   setSubscribers(prev => prev.filter(sub => sub !== event.stream.streamManager));
  // };

  // useEffect(() => {
  //   initializeSession();

  //   // JSNLog 관련 에러 무시
  //   window.onerror = () => false;
  //   window.onunhandledrejection = () => false;

  //   return () => {
  //     if (session) {
  //       session.disconnect();
  //     }
  //     setSession(null);
  //     setSubscribers([]);
  //     setPublisher(null);
  //   };
  // }, [voiceToken]);

  useEffect(() => {
    subscribe(`/sub/team/${roomId}/voice/status`, data => {
      if (data.type === 'JOIN') {
        console.log('음성 채널 참가 구독:', data.data);

        setUsers(prev => [...prev, data.data]);
      }

      if (data.type === 'MIC_STATUS') {
        console.log('마이크 상태 구독:', data.data);

        setUserMicStatus(prev => ({
          ...prev,
          [data.data.userId]: data.data.status,
        }));
      }
    });

    return () => {};
  }, [roomId]);

  const toggleMic = (userId: string) => {
    const newStatus = !userMicStatus[userId];
    setUserMicStatus(prev => ({
      ...prev,
      [userId]: newStatus,
    }));

    if (publisher) {
      publisher.publishAudio(newStatus);
    }

    sendMessage(`/pub/team/${roomId}/voice/mic-status`, {
      userId,
      isMuted: !newStatus,
    });
  };

  return (
    <div className="flex gap-2 border-t border-gray-04 py-6 px-4">
      <div className="grow">
        <p className="text-gray-02 font-semibold text-sm mb-2">우리 팀</p>
        <div className="flex gap-2">
          {myTeam.users.map(user => {
            const isMicOn = userMicStatus[user.userId] !== false; // false는 마이크 꺼짐 상태
            return (
              <div key={user.userId} className="user">
                <button onClick={() => toggleMic(String(user.userId))}>
                  <UserProfileImg
                    profileImg={user.profileImg}
                    tierId={user.tierId}
                    customClass={`max-w-[3rem] ${isMicOn ? 'border-2 border-primary-orange' : ''}`}
                  />
                  <span>{user.nickname}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grow">
        <p className="text-gray-02 font-semibold text-sm mb-2">상대 팀</p>
        <div className="flex gap-2">
          {opponent.users.map(user => {
            return (
              <div key={user.userId} className="user">
                <UserProfileImg
                  profileImg={user.profileImg}
                  tierId={user.tierId}
                  customClass={`max-w-[3rem]`}
                />
                <span>{user.nickname}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
