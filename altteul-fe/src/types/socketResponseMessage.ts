import { FriendRequest, MatchData, Problem, TestCase, User } from "./types";

interface socketResponseMessage {
  type: 'ENTER' | 'LEAVE' | 'COUNTING' | 'GAME_START' | "COUNTING_CANCEL"
      | 'MATCHING' | 'MATCH_CANCEL_SUCCESS' | 'MATCHED' | 'COUNTING_READY'
      | 'INVITE_REQUEST_RECEIVED'
      | 'SEND_REQUEST';
  data: {
    //유저 입퇴장('ENTER/LEAVE') message
    leaderId?: number;
    users?: User[];
    remainingUsers?: User[];

    //카운팅(COUNTING) message
    time?: number;

    //게임 시작(GAME_START) message
    gameId?: number;
    problem?: Problem
    testcases?: TestCase[]

    //인원 미달(COUNTING_CANCEL) message
    note?: string;

    //게임 초대(INVITE_REQUEST_RECEIVED) message
    nickname?: string;
    roomId?: number;
    
    //매칭 성사(MATCHED) message
    matchId: string

    //팀전 게임 데이터(COUNTING_READY) message
    team1: MatchData
    team2: MatchData

    //친구 신청(SEND_REQUEST) message
    friendRequests: FriendRequest

  };
};


export default socketResponseMessage