import { Problem, TestCase, User } from "./types";

interface socketResponseMessage {
  type: 'ENTER' | 'LEAVE' | 'COUNTING' | 'GAME_START';
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
  };
};


export default socketResponseMessage