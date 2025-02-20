import { useEffect, useState } from 'react';
import onVoice from '@assets/icon/on_voice.svg';
import offVoice from '@assets/icon/off_voice.svg';

import {
  createLocalAudioTrack,
  LocalAudioTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from 'livekit-client';
import useGameStore from '@stores/useGameStore';
import useAuthStore from '@stores/authStore';
import AudioComponent from '@components/Ide/AudioComponent';
import { createToken } from '@utils/openVidu';
import UserProfile from '@components/Match/UserProfile';

type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

let APPLICATION_SERVER_URL = 'https://i12c203.p.ssafy.io:8443/';
let LIVEKIT_URL = 'wss://i12c203.p.ssafy.io:8443/';
configureUrls();

function configureUrls() {
  if (!APPLICATION_SERVER_URL) {
    if (window.location.hostname === 'localhost') {
      APPLICATION_SERVER_URL = 'http://localhost:8443/';
    } else {
      APPLICATION_SERVER_URL = 'https://' + window.location.hostname + ':8443/';
    }
  }

  if (!LIVEKIT_URL) {
    if (window.location.hostname === 'localhost') {
      LIVEKIT_URL = 'ws://localhost:8443/';
    } else {
      LIVEKIT_URL = 'wss://' + window.location.hostname + ':8443/';
    }
  }
}

const VoiceChat = () => {
  const { userRoomId, myTeam, opponent } = useGameStore();
  const { userId } = useAuthStore();
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [localTrack, setLocalTrack] = useState<LocalAudioTrack | undefined>(undefined);
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (userRoomId && userId) {
      joinRoom();
    }
  }, [userRoomId, userId]);

  async function joinRoom() {
    try {
      // Initialize a new Room object
      const room = new Room();
      setRoom(room);

      // Specify the actions when events take place in the room
      // On every new Track received...
      room.on(
        RoomEvent.TrackSubscribed,
        (
          _track: RemoteTrack,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant
        ) => {
          setRemoteTracks(prev => [
            ...prev,
            { trackPublication: publication, participantIdentity: participant.identity },
          ]);
        }
      );

      // On every Track destroyed...
      room.on(
        RoomEvent.TrackUnsubscribed,
        (_track: RemoteTrack, publication: RemoteTrackPublication) => {
          setRemoteTracks(prev =>
            prev.filter(track => track.trackPublication.trackSid !== publication.trackSid)
          );
        }
      );

      // Get a token from your application server with the room name and participant name
      const token = await createToken(userRoomId, userId);
      console.log('openviduToken:', token);

      // Connect to the room with the LiveKit URL and the token
      await room.connect(LIVEKIT_URL, token);

      // Publish your camera and microphone

      const audioTrack = await createLocalAudioTrack();
      await room.localParticipant.publishTrack(audioTrack);
      setLocalTrack(audioTrack);
      setIsConnected(true);
    } catch (error) {
      console.log('There was an error connecting to the room:', error as Error);
      await leaveRoom();
    }
  }

  async function leaveRoom() {
    // Leave the room by calling 'disconnect' method over the Room object
    await room?.disconnect();

    // Reset the state
    setRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]);
    setIsConnected(false);
  }

  function toggleVoiceChat() {
    if (isConnected) {
      leaveRoom();
    } else {
      joinRoom();
    }
  }

  const activeParticipants = new Set(remoteTracks.map(track => track.participantIdentity));
  activeParticipants.add(String(userId));

  console.log('localTrack:', localTrack);
  console.log('remoteTrack:', remoteTracks);

  return (
    <div id="room" className="px-8 border-t border-gray-04 pt-4">
      <div className="flex-1 mb-4">
        <div className="flex gap-2 mb-4">
          <p className="text-sm font-semibold text-gray-02">우리팀</p>
          <button onClick={toggleVoiceChat}>
            {isConnected ? (
              <img src={onVoice} alt="음성 채팅 떠나기" />
            ) : (
              <img src={offVoice} alt="음성채팅 재입장" />
            )}
          </button>
        </div>

        <div id="layout-container" className="flex gap-4">
          {isConnected ? (
            <>
              {/* 🔥 로컬 오디오 트랙만 표시 */}
              {localTrack && (
                <AudioComponent track={localTrack} participantIdentity={String(userId)} />
              )}

              {/* 🔥 원격 오디오 트랙만 표시 */}
              {remoteTracks.map(remoteTrack => (
                <AudioComponent
                  key={remoteTrack.trackPublication.trackSid}
                  participantIdentity={remoteTrack.participantIdentity}
                  track={remoteTrack.trackPublication.audioTrack!}
                />
              ))}

              {myTeam.users
                .filter(user => !activeParticipants.has(String(user.userId)))
                .map(user => (
                  <AudioComponent key={user.userId} participantIdentity={String(user.userId)} />
                ))}
            </>
          ) : (
            <>
              {myTeam.users.map(user => (
                <AudioComponent key={user.userId} participantIdentity={String(user.userId)} />
              ))}
            </>
          )}
        </div>
      </div>

      {/* 상대팀 */}
      <div className="flex-1">
        <p className="mb-4 text-sm font-semibold text-gray-02">상대팀</p>
        <div className="flex gap-4">
          {opponent.users.map(user => (
            <div key={user.userId}>
              <div className="p-1 rounded-full bg-gray-04">
                <UserProfile
                  nickname={user.nickname}
                  profileImg={user.profileImg}
                  tierId={user.tierId}
                  isNameShow={false}
                  className="w-[2.5rem] h-[2.5rem]"
                />
              </div>
              <p className="font-semibold text-gray-01">{user.nickname}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex gap-2 border-t border-gray-04 py-6 px-4">
      <div className="grow">
        <p className="text-gray-02 font-semibold text-sm mb-2">우리 팀</p>
        <div className="flex gap-2">
          {/* {myTeam.users.map(user => {
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
          })} */}
        </div>
      </div>
      <div className="grow">
        <p className="text-gray-02 font-semibold text-sm mb-2">상대 팀</p>
        <div className="flex gap-2">
          {/* {opponent.users.map(user => {
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
          })} */}
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
