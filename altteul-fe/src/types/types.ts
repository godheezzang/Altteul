export interface User {
  nickName: string;
  profileImage: string;
  tier: string;
}

export interface Users {
  [key: string]: User;
}
