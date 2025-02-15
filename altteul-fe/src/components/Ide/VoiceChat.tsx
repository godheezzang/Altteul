import useGameStore from "@stores/useGameStore";


const VoiceChat = () => {
  const { gameId, roomId } = useGameStore()
  return (
    <>
      <h1>Voice</h1>
    </>
  );
};

export default VoiceChat;
