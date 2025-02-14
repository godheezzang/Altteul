import { Problem, TestCase, User } from "./types";

interface socketResponseMessage {
  type: 'ENTER' | 'LEAVE' | 'COUNTING' | 'GAME_START' | "COUNTING_CANCEL"
      | 'INVITE_REQUEST_RECEIVED';
  data: {
    leaderId?: number;
    users?: User[];
    remainingUsers?: User[];

    //카운팅 message
    time?: number;

    //게임 시작 message
    gameId?: number;
    problem?: Problem
    testcases?: TestCase[]

    //인원 미달 message
    note?: string;

    //게임 초대 요청 message
    nickname?: string;
    roomId?: number;
    
  };
};


export default socketResponseMessage