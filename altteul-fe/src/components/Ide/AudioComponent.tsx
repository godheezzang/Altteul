import SmallButton from '@components/Common/Button/SmallButton ';
import UserProfile from '@components/Match/UserProfile';
import useAuthStore from '@stores/authStore';
import useGameStore from '@stores/useGameStore';
import { LocalAudioTrack, RemoteAudioTrack } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';

interface AudioComponentProps {
  track: LocalAudioTrack | RemoteAudioTrack;
  participantIdentity?: string;
  handleMuted?: () => void;
  handleUnmuted?: () => void;
}

function AudioComponent({ track }: AudioComponentProps) {
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const { userId } = useAuthStore();
  const { myTeam } = useGameStore();
  const [isMuted, setIsMuted] = useState(false);

  // 현재 유저 아이디랑 participantIdentity랑 비교해서 같다면 유저 아이디+프로필 렌더링
  // 유저 정보는 gameStore의 myTeam에서 가져올 것
  console.log('myTeam:', myTeam);

  const userInfo = myTeam.users.filter(user => user.userId === userId)[0];
  console.log('userInfo:', userInfo);

  console.log('소리 상태:', track.isMuted);
  const handleChangeMuted = () => {
    track.isMuted = !track.isMuted;
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (audioElement.current) {
      track.attach(audioElement.current);
    }

    return () => {
      track.detach();
    };
  }, [track]);

  return (
    <>
      <audio ref={audioElement} id={track.sid} />

      <button onClick={handleChangeMuted}>
        {isMuted}
        <UserProfile
          nickname={userInfo.nickname}
          profileImg={userInfo.profileImg}
          tierId={userInfo.tierId}
        />
        <span>{userInfo.nickname}</span>
      </button>
    </>
  );
}

export default AudioComponent;
