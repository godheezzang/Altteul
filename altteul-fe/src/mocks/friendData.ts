// mocks/friendData.ts
import PeopleIcon from '@assets/icon/People.svg';
import { ChatMessage, ChatRoom, Friend, FriendRequest, NotificationItem } from 'types/types';

export const mockFriends: Friend[] = [
  // {
  //   userId: 1654,
  //   nickname: '매리오',
  //   profileImg: PeopleIcon,
  //   isOnline: true,
  // },
  // {
  //   userId: 1655,
  //   nickname: '루이지',
  //   profileImg: PeopleIcon,
  //   isOnline: false,
  // },
  // {
  //   userId: 1656,
  //   nickname: '피치공주',
  //   profileImg: PeopleIcon,
  //   isOnline: true,
  // },
  // {
  //   userId: 1657,
  //   nickname: '요시',
  //   profileImg: PeopleIcon,
  //   isOnline: true,
  // },
  // {
  //   userId: 1658,
  //   nickname: '쿠파',
  //   profileImg: PeopleIcon,
  //   isOnline: false,
  // },
  // {
  //   userId: 1659,
  //   nickname: '도널드',
  //   profileImg: PeopleIcon,
  //   isOnline: true,
  // },
  // {
  //   userId: 1660,
  //   nickname: '미키',
  //   profileImg: PeopleIcon,
  //   isOnline: false,
  // },
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
  // {
  //   friendId: 1654,
  //   nickname: '매리오',
  //   profileImg: PeopleIcon,
  //   isOnline: true,
  //   recentMessage: '점프할 준비 됐어!',
  //   isMessageRead: false,
  //   createdAt: '2024.02.10 14:30:00',
  // },
  // {
  //   friendId: 1655,
  //   nickname: '루이지',
  //   profileImg: PeopleIcon,
  //   isOnline: false,
  //   recentMessage: '오늘 같이 게임할래?',
  //   isMessageRead: true,
  //   createdAt: '2024.02.09 11:45:00',
  // },
  // {
  //   friendId: 1656,
  //   nickname: '피치공주',
  //   profileImg: PeopleIcon,
  //   isOnline: true,
  //   recentMessage: '성에서 놀러와!',
  //   isMessageRead: false,
  //   createdAt: '2024.02.08 16:20:00',
  // },
  // {
  //   friendId: 1659,
  //   nickname: '도널드',
  //   profileImg: PeopleIcon,
  //   isOnline: true,
  //   recentMessage: '디즈니랜드 언제 갈거야?',
  //   isMessageRead: true,
  //   createdAt: '2024.02.07 10:15:00',
  // },
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
// 기존 mockFriends, mockFriendRequests 등은 그대로 유지

export const mockNotifications: NotificationItem[] = [
  // {
  //   id: 1,
  //   type: 'friendRequest',
  //   from: {
  //     id: 1656,
  //     nickname: '피치공주',
  //     profileImg: PeopleIcon,
  //     isOnline: true,
  //   },
  //   createdAt: new Date().toISOString(),
  // },
  // {
  //   id: 2,
  //   type: 'gameInvite',
  //   from: {
  //     id: 1657,
  //     nickname: '요시',
  //     profileImg: PeopleIcon,
  //     isOnline: true,
  //   },
  //   roomId: 1, // 게임 초대의 경우 roomId 추가
  //   createdAt: new Date().toISOString(),
  // },
  // {
  //   id: 3,
  //   type: 'gameInvite',
  //   from: {
  //     id: 1659,
  //     nickname: '도널드',
  //     profileImg: PeopleIcon,
  //     isOnline: true,
  //   },
  //   roomId: 2, // 게임 초대의 경우 roomId 추가
  //   createdAt: new Date().toISOString(),
  // },
];
