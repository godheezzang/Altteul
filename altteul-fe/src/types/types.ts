export interface User {
  userId: number;
  nickName: string;
  profileImage: string;
  tierId: number;
}

export interface Users {
  [key: string]: User;
}
