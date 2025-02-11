// // 전체 채팅 목록 (api/chatroom)
// export const mockChatRooms = [
//   {
//     friendId: 1,
//     nickname: "친구1",
//     profileImg: "/src/assets/icon/People.svg",
//     isOnline: true,
//     recentMessage: "안녕! 오랜만이야",
//     isMessageRead: false,
//     createdAt: "2025-02-09T13:03:50.844Z",
//   },
//   {
//     friendId: 2,
//     nickname: "친구2",
//     profileImg: "/src/assets/icon/People.svg",
//     isOnline: false,
//     recentMessage: "오늘 저녁 뭐 먹어?",
//     isMessageRead: true,
//     createdAt: "2025-02-08T18:45:22.123Z",
//   },
//   {
//     friendId: 3,
//     nickname: "친구3",
//     profileImg: "/src/assets/icon/People.svg",
//     isOnline: true,
//     recentMessage: "새로운 프로젝트 시작했어!",
//     isMessageRead: false,
//     createdAt: "2025-02-07T10:15:30.567Z",
//   },
// ];

// // 특정 친구와의 채팅 내역 (api/chatroom/friend/{friend})
// export const mockChatWithFriend = {
//   friendId: 1,
//   nickname: "친구1",
//   profileImg: "/src/assets/icon/People.svg",
//   isOnline: true,
//   messages: [
//     {
//       chatMessageId: 101,
//       senderId: 1,
//       senderNickname: "친구1",
//       messageContent: "안녕! 오랜만이야",
//       checked: false,
//       createdAt: "2025-02-09T13:03:50.854Z",
//     },
//     {
//       chatMessageId: 102,
//       senderId: 0,
//       senderNickname: "나",
//       messageContent: "맞아, 진짜 오랜만이야! 잘 지냈어?",
//       checked: true,
//       createdAt: "2025-02-09T13:05:20.000Z",
//     },
//     {
//       chatMessageId: 103,
//       senderId: 1,
//       senderNickname: "친구1",
//       messageContent: "응! 나는 요즘 새로운 프로젝트 시작했어",
//       checked: false,
//       createdAt: "2025-02-09T13:06:45.321Z",
//     },
//     {
//       chatMessageId: 104,
//       senderId: 0,
//       senderNickname: "나",
//       messageContent: "오 무슨 프로젝트인데?",
//       checked: true,
//       createdAt: "2025-02-09T13:07:30.000Z",
//     },
//     {
//       chatMessageId: 105,
//       senderId: 1,
//       senderNickname: "친구1",
//       messageContent: "게임 개발 프로젝트야! 재미있을 것 같아서 시작했어",
//       checked: false,
//       createdAt: "2025-02-09T13:08:15.321Z",
//     },
//     {
//       chatMessageId: 106,
//       senderId: 0,
//       senderNickname: "나",
//       messageContent: "와! 그거 진짜 재밌겠다! 어떤 게임 만드는데?",
//       checked: true,
//       createdAt: "2025-02-09T13:09:00.000Z",
//     },
//     {
//       chatMessageId: 107,
//       senderId: 1,
//       senderNickname: "친구1",
//       messageContent: "2D 플랫포머 게임이야. 마리오 같은 느낌?",
//       checked: false,
//       createdAt: "2025-02-09T13:10:30.321Z",
//     },
//     {
//       chatMessageId: 108,
//       senderId: 0,
//       senderNickname: "나",
//       messageContent: "오 재밌겠다! 나중에 테스트 플레이어로 불러줘ㅎㅎ",
//       checked: true,
//       createdAt: "2025-02-09T13:11:20.000Z",
//     },
//     {
//       chatMessageId: 109,
//       senderId: 1,
//       senderNickname: "친구1",
//       messageContent: "당연하지! 너도 한번 개발에 참여해볼래?",
//       checked: false,
//       createdAt: "2025-02-09T13:12:45.321Z",
//     },
//     {
//       chatMessageId: 110,
//       senderId: 0,
//       senderNickname: "나",
//       messageContent: "그래도 될까? 나 게임 개발은 처음이라...",
//       checked: true,
//       createdAt: "2025-02-09T13:13:30.000Z",
//     },
//   ],
//   createdAt: "2025-02-09T13:03:50.854Z",
// };

// mocks/friendData.ts
import PeopleIcon from '@assets/icon/People.svg';

export type Friend = {
  userId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
};

export type FriendRequest = {
  friendRequestId: number;
  fromUserId: number;
  fromUserNickname: string;
  fromUserProfileImg: string;
  requestStatus: 'P' | 'A' | 'R';
};

export type ChatRoom = {
  friendId: number;
  nickname: string;
  profileImage: string;
  isOnline: boolean;
  recentMessage: string;
  isMessageRead: boolean;
  createdAt: string;
};

export type ChatMessage = {
  chatMessageId: number;
  senderId: number;
  senderNickname: string;
  messageContent: string;
  checked: boolean;
  createdAt: string;
};

export const mockFriends: Friend[] = [
  {
    userId: 1654,
    nickname: '매리오',
    profileImg: PeopleIcon,
    isOnline: true,
  },
  {
    userId: 1655,
    nickname: '루이지',
    profileImg: PeopleIcon,
    isOnline: false,
  },
  {
    userId: 1656,
    nickname: '피치공주',
    profileImg: PeopleIcon,
    isOnline: true,
  },
  {
    userId: 1657,
    nickname: '요시',
    profileImg: PeopleIcon,
    isOnline: true,
  },
  {
    userId: 1658,
    nickname: '쿠파',
    profileImg: PeopleIcon,
    isOnline: false,
  },
  {
    userId: 1659,
    nickname: '도널드',
    profileImg: PeopleIcon,
    isOnline: true,
  },
  {
    userId: 1660,
    nickname: '미키',
    profileImg: PeopleIcon,
    isOnline: false,
  },
];

export const mockFriendRequests: FriendRequest[] = [
  {
    friendRequestId: 1,
    fromUserId: 1656,
    fromUserNickname: '피치공주',
    fromUserProfileImg: PeopleIcon,
    requestStatus: 'P',
  },
  {
    friendRequestId: 2,
    fromUserId: 1657,
    fromUserNickname: '요시',
    fromUserProfileImg: PeopleIcon,
    requestStatus: 'P',
  },
  {
    friendRequestId: 3,
    fromUserId: 1659,
    fromUserNickname: '도널드',
    fromUserProfileImg: PeopleIcon,
    requestStatus: 'P',
  },
];

export const mockChatRooms: ChatRoom[] = [
  {
    friendId: 1654,
    nickname: '매리오',
    profileImage: PeopleIcon,
    isOnline: true,
    recentMessage: '점프할 준비 됐어!',
    isMessageRead: false,
    createdAt: '2024.02.10 14:30:00',
  },
  {
    friendId: 1655,
    nickname: '루이지',
    profileImage: PeopleIcon,
    isOnline: false,
    recentMessage: '오늘 같이 게임할래?',
    isMessageRead: true,
    createdAt: '2024.02.09 11:45:00',
  },
  {
    friendId: 1656,
    nickname: '피치공주',
    profileImage: PeopleIcon,
    isOnline: true,
    recentMessage: '성에서 놀러와!',
    isMessageRead: false,
    createdAt: '2024.02.08 16:20:00',
  },
  {
    friendId: 1659,
    nickname: '도널드',
    profileImage: PeopleIcon,
    isOnline: true,
    recentMessage: '디즈니랜드 언제 갈거야?',
    isMessageRead: true,
    createdAt: '2024.02.07 10:15:00',
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    chatMessageId: 1,
    senderId: 1654,
    senderNickname: '매리오',
    messageContent: '안녕! 오늘 같이 게임할래?',
    checked: false,
    createdAt: '2025-02-09T13:03:50.854Z',
  },
  {
    chatMessageId: 2,
    senderId: 0, // 현재 사용자
    senderNickname: '나',
    messageContent: '좋아! 어떤 게임?',
    checked: true,
    createdAt: '2025-02-09T13:05:20.000Z',
  },
  {
    chatMessageId: 3,
    senderId: 1656,
    senderNickname: '피치공주',
    messageContent: '우리 마리오 파티 하자!',
    checked: false,
    createdAt: '2025-02-09T13:06:45.321Z',
  },
  {
    chatMessageId: 4,
    senderId: 0, // 현재 사용자
    senderNickname: '나',
    messageContent: '좋아! 준비됐어!',
    checked: true,
    createdAt: '2025-02-09T13:07:30.000Z',
  },
];

export const mockChatRoomDetail = {
  friendId: 1654,
  nickname: '매리오',
  profileImg: PeopleIcon,
  isOnline: true,
  messages: mockChatMessages,
  createdAt: '2025-02-09T01:44:39.029527',
};

// 페이징을 위한 응답 형태의 목 데이터
export const mockFriendListResponse = {
  status: 200,
  message: 'ok',
  data: {
    isLast: false,
    totalPages: 2,
    currentPage: 0,
    totalElements: 7,
    friends: mockFriends.slice(0, 5),
  },
};

export const mockFriendRequestListResponse = {
  status: 200,
  message: 'ok',
  data: {
    isLast: true,
    totalPages: 1,
    currentPage: 0,
    totalElements: 3,
    friendRequests: mockFriendRequests,
  },
};
