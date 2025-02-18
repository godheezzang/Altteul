import UserProfileImg from '@components/Common/UserProfileImg';
import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  LocalVideoTrack,
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

let APPLICATION_SERVER_URL = '';
let LIVEKIT_URL = '';
configureUrls();

function configureUrls() {
  if (!APPLICATION_SERVER_URL) {
    if (window.location.hostname === 'localhost') {
      APPLICATION_SERVER_URL = 'http://localhost:8080/';
    } else {
      APPLICATION_SERVER_URL = 'https://' + window.location.hostname + ':6443/';
    }
  }

  if (!LIVEKIT_URL) {
    if (window.location.hostname === 'localhost') {
      LIVEKIT_URL = 'ws://localhost:7880/';
    } else {
      LIVEKIT_URL = 'wss://' + window.location.hostname + ':7880/';
    }
  }
}

const VoiceChat = () => {
  const { userRoomId } = useGameStore();
  const { userId } = useAuthStore();
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(undefined);
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);

  const [participantName, setParticipantName] = useState(
    String(userId) + Math.floor(Math.random() * 100)
  );
  const [roomName, setRoomName] = useState('Test Room');

  useEffect(() => {
    joinRoom();
  }, []);
  async function joinRoom() {
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

    try {
      // Get a token from your application server with the room name and participant name
      const token = await createToken(userRoomId, userId);
      console.log(token);

      // Connect to the room with the LiveKit URL and the token
      await room.connect(LIVEKIT_URL, token);

      // Publish your camera and microphone
      await room.localParticipant.enableCameraAndMicrophone();
      setLocalTrack(room.localParticipant.videoTrackPublications.values().next().value.videoTrack);
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
    <>
      {!room ? (
        <div id="join">
          <div id="join-dialog">
            <h2>Join a Video Room</h2>
            <form
              onSubmit={e => {
                joinRoom();
                e.preventDefault();
              }}
            >
              <label htmlFor="participant-name">Participant</label>
              <input
                id="participant-name"
                value={participantName}
                onChange={e => setParticipantName(e.target.value)}
                required
              />
              <label htmlFor="room-name">Room</label>
              <input
                id="room-name"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                required
              />
              <button type="submit" disabled={!roomName || !participantName}>
                Join!
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div id="room">
          <h2>{roomName}</h2>
          <button onClick={leaveRoom}>Leave Room</button>
          <div id="layout-container">
            {localTrack && (
              <VideoComponent
                track={localTrack}
                participantIdentity={participantName}
                local={true}
              />
            )}
            {remoteTracks.map(remoteTrack =>
              remoteTrack.trackPublication.kind === 'video' ? (
                <VideoComponent
                  key={remoteTrack.trackPublication.trackSid}
                  track={remoteTrack.trackPublication.videoTrack!}
                  participantIdentity={remoteTrack.participantIdentity}
                />
              ) : (
                <AudioComponent
                  key={remoteTrack.trackPublication.trackSid}
                  track={remoteTrack.trackPublication.audioTrack!}
                />
              )
            )}
          </div>
        </div>
      )}
    </>
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
