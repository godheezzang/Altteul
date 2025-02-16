// 1:1 채팅방 뷰

// src/components/Modal/Chat/views/ChatView.tsx
import useAuthStore from '@stores/authStore';
import { useSocketStore } from '@stores/socketStore';
import { getChatRoom } from '@utils/Api/chatApi';
import { useEffect, useState, useRef } from 'react';
import { ChatRoom } from 'types/types';

interface ChatViewProps {
  friendId: number;
  onBack: () => void;
}

const ChatView = ({ friendId, onBack }: ChatViewProps) => {
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useSocketStore();
  const { userId } = useAuthStore();

  useEffect(() => {
    const fetchChatRoom = async () => {
      try {
        setIsLoading(true);
        const response = await getChatRoom(friendId);
        //setChatRoom(response.data);
      } catch (error) {
        console.error('채팅방 로드 실패:', error);
        setError('채팅방을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatRoom();
  }, [friendId]);

  // 새 메시지가 추가될 때마다 스크롤 맨 아래로
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatRoom?.messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !chatRoom) return;

    // 소켓으로 메시지 전송
    sendMessage('/pub/chat/send', {
      friendId,
      message: message.trim(),
    });

    setMessage('');
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center">로딩 중...</div>;
  if (error)
    return <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>;
  if (!chatRoom) return null;

  return (
    <div className="flex flex-col h-full">
      {/* 채팅방 헤더 */}
      <div className="border-b border-gray-700 p-4 flex items-center gap-3">
        <div className="relative">
          <img src={chatRoom.profileImg} alt="프로필" className="w-10 h-10 rounded-full" />
          <div
            className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
              chatRoom.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
        </div>
        <span className="font-medium text-white">{chatRoom.nickname}</span>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatRoom.messages.map(message => (
          <div
            key={message.chatMessageId}
            className={`flex ${message.senderId === Number(userId) ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === Number(userId)
                  ? 'bg-primary-orange text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              <p>{message.messageContent}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* 메시지 입력 */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="메시지를 입력하세요"
            className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="px-4 py-2 bg-primary-orange text-white rounded-lg disabled:opacity-50"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
