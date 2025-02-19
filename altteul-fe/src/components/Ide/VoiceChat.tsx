import UserProfileImg from '@components/Common/UserProfileImg';
import { useEffect, useState } from 'react';

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
import VideoComponent from '@components/Ide/VideoComponent';
import AudioComponent from '@components/Ide/AudioComponent';
import { createToken } from '@utils/openVidu';

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
  const { userRoomId, myTeam } = useGameStore();
  const { userId } = useAuthStore();
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [localTrack, setLocalTrack] = useState<LocalAudioTrack | undefined>(undefined);
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);

  const [participantName, setParticipantName] = useState(
    () => `${userId}-${Math.floor(Math.random() * 100)}`
  );
  const [roomName, setRoomName] = useState('Test Room');

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
          if (myTeam.users.some(user => String(user.userId) === participant.identity)) {
            setRemoteTracks(prev => [
              ...prev,
              { trackPublication: publication, participantIdentity: participant.identity },
            ]);

            console.log('remoteTracks:', remoteTracks);
          }
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
      // console.log('token:', token);

      // Connect to the room with the LiveKit URL and the token
      await room.connect(LIVEKIT_URL, token);

      // Publish your camera and microphone

      const audioTrack = await createLocalAudioTrack();
      await room.localParticipant.publishTrack(audioTrack);
      // await room.localParticipant.enableCameraAndMicrophone();
      // setLocalTrack(room.localParticipant.videoTrackPublications.values().next().value.videoTrack);
      setLocalTrack(audioTrack);
    } catch (error) {
      console.log('There was an error connecting to the room:', (error as Error).message);
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
  }

  console.log('remoteTracks:', remoteTracks);
  console.log('localTrack:', localTrack);

  /**
   * --------------------------------------------
   * GETTING A TOKEN FROM YOUR APPLICATION SERVER
   * --------------------------------------------
   * The method below request the creation of a token to
   * your application server. This prevents the need to expose
   * your LiveKit API key and secret to the client side.
   *
   * In this sample code, there is no user control at all. Anybody could
   * access your application server endpoints. In a real production
   * environment, your application server must identify the user to allow
   * access to the endpoints.
   */

  return (
    <div id="room">
      <h2>{roomName}</h2>
      <button onClick={leaveRoom}>Leave Room</button>
      <div id="layout-container">
        {/* 🔥 로컬 오디오 트랙만 표시 */}
        {localTrack && <AudioComponent track={localTrack} />}

        {/* 🔥 원격 오디오 트랙만 표시 */}
        {remoteTracks.map(remoteTrack => (
          <AudioComponent
            key={remoteTrack.trackPublication.trackSid}
            participantIdentity={remoteTrack.participantIdentity}
            track={remoteTrack.trackPublication.audioTrack!}
            handleMuted={remoteTrack.trackPublication.handleMuted}
            handleUnmuted={remoteTrack.trackPublication.handleUnmuted}
          />
        ))}
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
