//매칭관련 API(싱글이든 팀이든)
import { sigleApi } from "@utils/api/commonApi";
import axios from 'axios';

//싱글 매칭 입장시 사용 api
export const singleEnter = async (userId: number) => {
  try {
    const res = await sigleApi.post("enter", { "userId": userId })
    console.log(res.data)
    if (res.data.status === 200) {
      //응답값에서 data부분 return
      return res.data
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("방 입장 error: ", (error.response.data as { message: string }).message)
      console.log("방 나가기 로직을 실행합니다, 다시 입장해주세요")
      singleOut(Number(userId))
    }
  }
}

//싱글 매칭 퇴장시 사용 api
export const singleOut = async (userId: number) => {
  const res = await sigleApi.post("leave", { "userId": userId })
  return res.data.status
}

//싱글 매칭 시작시 사용 api
export const singleStart = (roomId: number, leaderId: number, type: string) => {
  // const res = await sigleApi.post("start", {"roomId":roomId, "leaderId":leaderId, "type":type})
  // return res.data.status
  return 200;
}