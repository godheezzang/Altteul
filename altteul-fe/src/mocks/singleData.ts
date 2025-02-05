export const mockSingleEnterData = { //처음 방 입장시
    "data": {
        "roomId":"1",      // 입장한 방 id
        "leaderId":"1",   // 방장 id
        "users":[
                    {"userId":1,
                    "nickname":"오리진",
                    "profileImage":"",
                    "tierId":1
                    },
                    {"userId":2,
                    "nickname":"리카스",
                    "profileImage":"",
                    "tierId":2
                    },
                    {"userId":3,
                    "nickname":"콜드캐슬",
                    "profileImage":"",
                    "tierId":3
                    },
        ],
        "message": "OK",
        "status": "200 OK"
  },
};

export const mockSingleWatingData = {   //대기중일 때 신규 상대 등장 시
	"type":"ENTER",
	"data": {
		"roomId":"1",      // 입장한 방 id
		"leaderId":"23",   // 방장 id
		"users":[
					{"userId":1,
					 "nickname":"닉넴1",
					 "profileImage":"",
					 "tierId":1
					 },
					 {"userId":2,
					 "nickname":"닉넴2",
					 "profileImage":"",
					 "tierId":1
					 },
                ]
            },
}