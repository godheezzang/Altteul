import { api } from "@utils/Api/commonApi";
import { UserGameRecordResponse, UserInfoResponse } from "types/types";

export const getUserInfo = async (userId: string): Promise<UserInfoResponse> => {
  const response = await api.get(`user/${userId}`);
  return response.data;
};

export const getUserRecord = async (userId: string): Promise<UserGameRecordResponse> => {
  const response = await api.get(`game/history/${userId}`);
  return response.data;
};