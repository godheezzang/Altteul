//매칭관련 API(싱글이든 팀이든)
import { sigleApi, teamApi } from "@utils/Api/commonApi";
import axios from 'axios';

//싱글 매칭 입장시 사용 api
export const singleEnter = async (userId: number) => {
  try {
    const res = await sigleApi.post("enter")
    if (res.data.status === 200) {
      return res.data
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("개인전 입장 error: ", (error.response.data as { message: string }).message)
      console.log("방 나가기 로직을 실행합니다, 다시 입장해주세요")
      singleOut(Number(userId))
    }
  }
}

//싱글 매칭 퇴장시 사용 api
export const singleOut = async (roomId:number) => {
  const res = await sigleApi.post(`leave/${roomId}`)
  return res.data.status
}

//싱글 매칭 시작시 사용 api
export const singleStart = async (roomId: number) => {
  const res = await sigleApi.post(`start/${roomId}`)
  return res
}

//팀전 입장 api
export const teamEnter = async (userId: number) => {
  try {
    const res = await teamApi.post("enter", { "userId": userId })
    if (res.data.status === 200) {
      return res.data
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("팀전 입장 error: ", (error.response.data as { message: string }).message)
      console.log("방 나가기 로직을 실행합니다, 다시 입장해주세요")
      teamOut(Number(userId))
    }
  }
}

//팀전 퇴장 api
export const teamOut = async (userId: number) => {
  const res = await teamApi.post("leave", { "userId": userId })
  return res.data.status
}

//팀전 초대 수락 api
export const inviteResponse = async (nickname:string, roomId:number, accepted:boolean) => {
  if (accepted) {
    const data = {"nickname" : nickname, "roomId":roomId, "accepted":accepted}
    const res = await teamApi.post('invite/reaction', data)
    return res.data
  }
}