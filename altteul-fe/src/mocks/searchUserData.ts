import { mockChatRooms } from "mocks/friendData";

export type User = {
  friendId: number;
  nickname: string;
  profileImg: string;
  isOnline: boolean;
};

export const mockUsers = mockChatRooms.map((user) => ({
  friendId: user.friendId,
  nickname: user.nickname,
  profileImg: user.profileImg,
  isOnline: user.isOnline,
}));

export const extendedMockUsers = [
  ...mockUsers,
  {
    friendId: 4,
    nickname: "친구4",
    profileImg: "src/assets/icon/People.svg",
    isOnline: true,
  },
  {
    friendId: 5,
    nickname: "친구5",
    profileImg: "src/assets/icon/People.svg",
    isOnline: false,
  },
];

export default extendedMockUsers;
