import axios from "axios";

const single = axios.create({
  baseURL: "http://localhost:8080/api/single",
  headers : {
    //TODO: 토큰값 집어넣어야함
    Authorization : "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTQsImlhdCI6MTczODgyNDY3MywiZXhwIjoxNzM4ODYwNjczfQ.J8_1V6JQ4n1keLJONXUR4wM7RqlDUEwufW0CsaR5h3o"
  }

});

//싱글 매칭 입장시 사용 api
export const singleEnter = async (userId:number) => {
  
  try{
    const res = await single.post("enter", {"userId":userId})
    if(res.data.status === "200 OK") {
      //응답값에서 data부분 return
      return res.data
    }
  }catch(error){
    console.log(error)
  }

}

//싱글 매칭 퇴장시 사용 api
export const singleOut = async (userId:number) => {
  const res = await single.post("leave", {"userId":userId})
  return res.data.status
}