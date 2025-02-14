import { Problem, TestCase, User } from "./types";

interface socketResponseMessage {
  type: 'ENTER' | 'LEAVE' | 'COUNTING' | 'GAME_START' | "COUNTING_CANCEL";
  data: {
    leaderId?: number;
    users?: User[];
    remainingUsers?: User[];

    //couting message
    time?: number;

    //game start message
    gameId?: number;
    problem?: Problem
    testcases?: TestCase[]

    //인원 미달 message
    note?: string;
  };
};


export default socketResponseMessage