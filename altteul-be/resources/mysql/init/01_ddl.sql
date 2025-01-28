use altteul;

CREATE TABLE IF NOT EXISTS `team_room` (
                                           `team_room_id`	INT UNSIGNED	NOT NULL	COMMENT '팀방ID',
                                           `game_id`	INT UNSIGNED	NULL	COMMENT '게임ID',
                                           `code`	TEXT	NULL	COMMENT '팀 현재 기준 최종 제출 코드',
                                           `solved_testcase_count`	INT UNSIGNED	NULL	COMMENT '팀의 현재까지 제출 기록 중 최대 정답 개수',
                                           `battle_result`	ENUM('0','1','2','3','4','5','6','7','8')	NULL	COMMENT '-1: 문제 못풀었을 때, 0: 무승부, 1~8: 순위',
    `reward_point`	INT	NULL	COMMENT '문제풀이 성공 시 기본 100, 그 이후 등수에 따라 차등 지급',
    `last_execute_time`	VARCHAR(20)	NULL	COMMENT '초 단위, 미제출 시 NULL',
    `last_execute_memory`	VARCHAR(20)	NULL	COMMENT 'MB 단위, 미제출 시 NULL',
    `lang`	ENUM('JV', 'PY')	NULL	COMMENT '배틀에서 사용할 언어',
    `activation`	BOOLEAN	NOT NULL	DEFAULT TRUE	COMMENT '게임 종료된 방인가? 취소된 방인가?',
    `created_at`	TIMESTAMP	NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '생성 일시',
    `finish_time`	TIMESTAMP	NULL	COMMENT '유저가 문제를 해결하거나 타임아웃된 후 게임을 나간 시간'
    );

CREATE TABLE IF NOT EXISTS `game_side_problem` (
                                                   `game_id`	INT UNSIGNED	NOT NULL	COMMENT '게임ID',
                                                   `side_problem_id`	INT UNSIGNED	NOT NULL	COMMENT '사이드 문제ID',
                                                   `side_problem_order`	TINYINT	NOT NULL	COMMENT '출제 순서',
                                                   `created_at`	TIMESTAMP	NOT NULL
);

CREATE TABLE IF NOT EXISTS `testcase` (
                                          `testcase_id`	INT UNSIGNED	NOT NULL	COMMENT '테스트케이스ID',
                                          `problem_id`	INT UNSIGNED	NOT NULL	COMMENT '문제ID',
                                          `testcase_number`	TINYINT	NOT NULL	COMMENT '테스트케이스번호',
                                          `input`	TEXT	NOT NULL	COMMENT 'input 값',
                                          `output`	TEXT	NOT NULL	COMMENT 'output 값',
                                          `created_at`	TIMESTAMP	NOT NULL	COMMENT '테스트케이스 생성 일시',
                                          `updated_at`	TIMESTAMP	NOT NULL	COMMENT '테스트케이스 수정 일시'
);

CREATE TABLE IF NOT EXISTS `friendship` (
                                            `friend_id`	INT UNSIGNED	NOT NULL	COMMENT '친구ID',
                                            `user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저ID',
                                            `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '서로 친구가 된 일시'
);

CREATE TABLE IF NOT EXISTS `chat_room` (
                                           `chatroom_id`	INT UNSIGNED	NOT NULL	COMMENT '채팅방 ID',
                                           `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '채팅방이 생성된 일시'
);

CREATE TABLE IF NOT EXISTS `single_room` (
                                             `single_room_id`	INT UNSIGNED	NOT NULL	COMMENT '개인방ID',
                                             `game_id`	INT UNSIGNED	NULL	COMMENT '게임ID',
                                             `user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저ID',
                                             `matching_order`	TINYINT	NOT NULL	COMMENT '한 방에 매칭된 순서',
                                             `code`	TEXT	NULL	COMMENT '팀 현재 기준 최종 제출 코드',
                                             `solved_testcase_count`	INT UNSIGNED	NULL	COMMENT '개인의 현재까지 제출 기록 중 최대 정답 개수',
                                             `battle_result`	ENUM('0','1','2','3','4','5','6','7','8')	NULL	COMMENT '-1: 문제 못풀었을 때, 0: 무승부, 1~8: 순위',
    `reward_point`	INT	NULL	COMMENT '문제풀이 성공 시 기본 100, 그 이후 등수에 따라 차등 지급',
    `last_execute_time`	VARCHAR(20)	NULL	COMMENT '초 단위, 미제출 시 NULL',
    `last_execute_memory`	VARCHAR(20)	NULL	COMMENT 'MB단위, 미제출 시 NULL',
    `lang`	ENUM('JV', 'PY')	NULL	COMMENT '배틀에서 사용할 언어',
    `activatation`	BOOLEAN	NOT NULL	DEFAULT TRUE	COMMENT '게임 종료된 방인가? 취소된 방인가?',
    `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '생성 일시',
    `finish_time`	TIMESTAMP	NULL	COMMENT '유저가 문제를 해결하거나 타임아웃된 후 게임을 나간 시간'
    );

CREATE TABLE IF NOT EXISTS `test_result` (
                                             `test_result_id`	INT UNSIGNED	NOT NULL	COMMENT '테스트 결과ID',
                                             `test_history_id`	INT UNSIGNED	NOT NULL	COMMENT '제출ID',
                                             `execute_time`	VARCHAR(20)	NOT NULL	COMMENT '초 단위',
    `execute_memory`	VARCHAR(20)	NOT NULL	COMMENT 'MB 단위',
    `test_result`	ENUM('P','F')	NOT NULL	COMMENT '성공/실패 여부',
    `user_output`	TEXT	NOT NULL	COMMENT '유저 출력',
    `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '결과 데이터 생성 일시'
    );

CREATE TABLE IF NOT EXISTS `user_connection_history` (
                                                         `user_connection_history_id`	INT UNSIGNED	NOT NULL	COMMENT '유저 접속 ID',
                                                         `user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저ID',
                                                         `connection_type`	ENUM('I', 'O')	NOT NULL	COMMENT '연결과 연결끊김 관리',
    `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '로그 생성일시'
    );

CREATE TABLE IF NOT EXISTS `side_problem_history` (
                                                      `side_problem_history_id`	INT UNSIGNED	NOT NULL	COMMENT '기록 ID',
                                                      `game_id`	INT UNSIGNED	NOT NULL	COMMENT '게임ID',
                                                      `team_room_id`	INT UNSIGNED	NULL	COMMENT '팀방ID',
                                                      `user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저ID',
                                                      `side_problem_id`	INT UNSIGNED	NOT NULL	COMMENT '사이드 문제ID',
                                                      `user_answer`	VARCHAR(128)	NOT NULL	COMMENT '유저가 제출한 답',
    `result`	ENUM('P','F')	NOT NULL	COMMENT '정답 여부',
    `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '사이드 문제를 푼 일시'
    );

CREATE TABLE IF NOT EXISTS `user_team_room` (
                                                `team_room_id`	INT UNSIGNED	NOT NULL	COMMENT '팀방ID',
                                                `user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저ID',
                                                `team_order`	TINYINT	NOT NULL
);

CREATE TABLE IF NOT EXISTS `user` (
                                      `user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저ID',
                                      `tier_id`	TINYINT	NOT NULL	COMMENT '등급 ID',
                                      `profile_img`	VARCHAR(1024)	NOT NULL	DEFAULT '기본 이미지 URL'	COMMENT '프로필 이미지 URL',
    `nickname`	VARCHAR(50)	NOT NULL	COMMENT '닉네임',
    `main_lang`	ENUM('JV', 'PY')	NOT NULL	COMMENT '유저의 선호 프로그래밍 언어',
    `user_status`	ENUM('A', 'S', 'D')	NOT NULL	DEFAULT 'A'	COMMENT '정지 유저, 활성화 유저 구분',
    `email`	VARCHAR(50)	NOT NULL	COMMENT '유니크한 이메일',
    `password`	VARCHAR(128)	NULL	COMMENT '비밀번호',
    `provider`	ENUM('LC',  'GH')	NOT NULL	COMMENT '로그인 유형 구별',
    `ranking_point`	INT UNSIGNED	NOT NULL	DEFAULT 0	COMMENT '랭킹 점수',
    `last_out_time`	TIMESTAMP	NULL	COMMENT '가장 마지막에 소켓에서 나간 순간',
    `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '유저 정보 생성 일시',
    `updated_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '유저 정보 수정 일시'
    );

CREATE TABLE IF NOT EXISTS `ranking_history` (
                                                 `ranking_history_id`	INT UNSIGNED	NOT NULL	COMMENT '랭킹 내역ID',
                                                 `user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저ID',
                                                 `tier_id`	INT UNSIGNED	NOT NULL	COMMENT '등급 ID',
                                                 `ranking_point`	INT UNSIGNED	NOT NULL	DEFAULT 0	COMMENT '랭킹 점수',
                                                 `ranking`	INT UNSIGNED	NOT NULL	COMMENT '랭킹 순위',
                                                 `ranking_change`	INT UNSIGNED	NULL	DEFAULT 0	COMMENT '전날 랭킹과 당일 랭킹 차이',
                                                 `ranking_history_date`	DATE	NOT NULL	COMMENT '랭킹을 기록(저장)한 날짜',
                                                 `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '데이터 생성 일시'
);

CREATE TABLE IF NOT EXISTS `point_history` (
                                               `point_history_id`	INT UNSIGNED	NOT NULL	COMMENT '점수내역ID',
                                               `game_id`	INT UNSIGNED	NOT NULL	COMMENT '게임ID',
                                               `user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저ID',
                                               `side_problem_id`	INT UNSIGNED	NULL	COMMENT '사이드 문제ID',
                                               `point`	TINYINT	NOT NULL	COMMENT '획득한 점수',
                                               `game_type`	ENUM('S', 'T')	NOT NULL	COMMENT '개인전, 팀전',
    `point_type`	ENUM('B' , 'S', 'D')	NOT NULL	COMMENT '배틀, 사이드 문제, 알고리즘 문제 맞춘 경우',
    `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '점수 획득 일시'
    );

CREATE TABLE IF NOT EXISTS `problem_image` (
                                               `problem_image_id`	INT UNSIGNED	NOT NULL	COMMENT '문제 이미지ID',
                                               `problem_id`	INT UNSIGNED	NOT NULL	COMMENT '문제ID',
                                               `problem_image_url`	VARCHAR(1024)	NOT NULL	COMMENT '이미지 파일 경로',
    `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '데이터 생성 일시'
    );

CREATE TABLE IF NOT EXISTS `chat_message` (
                                              `chat_message_id`	INT UNSIGNED	NOT NULL	COMMENT '채팅 메시지ID',
                                              `chatroom_id`	INT UNSIGNED	NOT NULL	COMMENT '채팅방 ID',
                                              `sender_id`	INT UNSIGNED	NOT NULL	COMMENT '채팅 메시지를 보내는 유저',
                                              `message_content`	TEXT	NOT NULL	COMMENT '채팅 시 주고받는 내용',
                                              `checked`	BOOLEAN	NOT NULL	COMMENT '수신자 채팅 확인 여부',
                                              `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '채팅 보낸 일시',
                                              `updated_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '확인 여부가 수정되는 일시'
);

CREATE TABLE IF NOT EXISTS `tier_history` (
                                              `tier_history_id`	INT UNSIGNED	NOT NULL	COMMENT '등급변동내역ID',
                                              `user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저ID',
                                              `next_tier`	INT UNSIGNED	NOT NULL	COMMENT '변경 티어',
                                              `prev_point`	INT UNSIGNED	NOT NULL	COMMENT '이전 점수',
                                              `next_point`	INT UNSIGNED	NOT NULL	COMMENT '이후 점수',
                                              `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '생성 일시'
);

CREATE TABLE IF NOT EXISTS `today_ranking` (
                                               `ranking_id`	INT UNSIGNED	NOT NULL	COMMENT '랭킹 순위',
                                               `user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저ID',
                                               `tier_id`	INT UNSIGNED	NOT NULL	COMMENT '등급 ID',
                                               `ranking_point`	INT UNSIGNED	NOT NULL	DEFAULT 0	COMMENT '랭킹 점수',
                                               `ranking_change`	INT UNSIGNED	NOT NULL	DEFAULT 0	COMMENT '전날 랭킹과 당일 랭킹 차이',
                                               `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '데이터 생성 일시'
);

CREATE TABLE IF NOT EXISTS `friend_request` (
                                                `friend_request_id`	INT UNSIGNED	NOT NULL,
                                                `to_user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저 ID',
                                                `from_user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저 ID',
                                                `request_status`	ENUM('P','A','R')	NOT NULL	DEFAULT 'P'	COMMENT '친구 요청 - > 보류, 승인, 거부',
    `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '친구 신청 일시',
    `updated_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '친구요청을 처리한 일시'
    );

CREATE TABLE IF NOT EXISTS `lang_limit` (
                                            `lang_limit_id`	INT UNSIGNED	NOT NULL	COMMENT '제한 ID',
                                            `problem_id`	INT UNSIGNED	NOT NULL	COMMENT '문제ID',
                                            `lang`	ENUM('JV', 'PY')	NOT NULL	COMMENT 'PYTHON, JAVA',
    `limit_time`	FLOAT	NOT NULL	DEFAULT 1	COMMENT '초 단위',
    `limit_memory`	FLOAT	NOT NULL	DEFAULT 512	COMMENT 'MB 단위',
    `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '수정 일시'
    );

CREATE TABLE IF NOT EXISTS `test_history` (
                                              `test_history_id`	INT UNSIGNED	NOT NULL	COMMENT '제출 ID',
                                              `game_id`	INT UNSIGNED	NOT NULL	COMMENT '게임ID',
                                              `user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저ID',
                                              `problem_id`	INT UNSIGNED	NOT NULL	COMMENT '문제ID',
                                              `code`	TEXT	NOT NULL	COMMENT '제출한 코드',
                                              `execute_time`	VARCHAR(20)	NOT NULL	COMMENT '초 단위',
    `execute_memory`	VARCHAR(20)	NOT NULL	COMMENT 'MB 단위',
    `result`	ENUM('P','F')	NOT NULL	COMMENT '성공, 실패',
    `success_count`	TINYINT	NOT NULL	COMMENT '맞은 테스트케이스 개수',
    `fail_count`	TINYINT	NOT NULL	COMMENT '틀린 테스트케이스 개수',
    `created_at`	TIMESTAMP	NOT NULL	COMMENT '코드 제출 일시'
    );

CREATE TABLE IF NOT EXISTS `game` (
                                      `game_id`	INT UNSIGNED	NOT NULL	COMMENT '게임ID',
                                      `problem_id`	INT UNSIGNED	NOT NULL	COMMENT '문제ID',
                                      `battle_type`	ENUM('S', 'T')	NOT NULL	DEFAULT 'S'	COMMENT '배틀 타입',
    `started_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '게임 시작 시간',
    `completed_at`	TIMESTAMP	NOT NULL	COMMENT '시작 시간으로부터 3시간',
    `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '생성 일시'
    );

CREATE TABLE IF NOT EXISTS `admin` (
    `admin_id`	VARCHAR(50)	NOT NULL	COMMENT '관리자 ID',
    `password`	VARCHAR(128)	NOT NULL	COMMENT '관리자 비밀번호',
    `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '생성 일시',
    `updated_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '변경 일시'
    );

CREATE TABLE IF NOT EXISTS `side_problem` (
                                              `side_problem_id`	INT UNSIGNED	NOT NULL	COMMENT '사이드 문제ID',
                                              `side_problem_title`	VARCHAR(128)	NOT NULL	COMMENT '문제 제목',
    `side_problem_content`	TEXT	NOT NULL	COMMENT '문제 내용',
    `side_problem_answer`	VARCHAR(255)	NOT NULL	COMMENT '정답',
    `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '데이터 생성 일시'
    );

CREATE TABLE IF NOT EXISTS `user_chat_room` (
                                                `user_chatroom_id`	INT UNSIGNED	NOT NULL	COMMENT '채팅 참여ID',
                                                `chatroom_id`	INT UNSIGNED	NOT NULL	COMMENT '채팅방ID',
                                                `user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저ID',
                                                `created_at`	TIMESTAMP	NOT NULL
);

CREATE TABLE IF NOT EXISTS `Item` (
                                      `item_id`	INT UNSIGNED	NOT NULL,
                                      `item_name`	VARCHAR(255)	NOT NULL,
    `item_content`	VARCHAR(255)	NOT NULL,
    `created_at`	TIMESTAMP	NOT NULL
    );

CREATE TABLE IF NOT EXISTS `ItemHistory` (
                                             `item_history_id`	INT UNSIGNED	NOT NULL,
                                             `item_id`	INT UNSIGNED	NOT NULL,
                                             `game_id`	INT UNSIGNED	NOT NULL	COMMENT '게임ID',
                                             `team_room_id`	INT UNSIGNED	NOT NULL	COMMENT '팀방ID',
                                             `user_id`	INT UNSIGNED	NOT NULL	COMMENT '유저ID',
                                             `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '생성 일시'
);

CREATE TABLE IF NOT EXISTS `Board` (
                                       `board_id`	INT UNSIGNED	NOT NULL,
                                       `board_title`	VARCHAR(255)	NOT NULL,
    `board_type`	ENUM('NOTIFICATION','FAQ')	NOT NULL,
    `board_content`	VARCHAR(255)	NOT NULL,
    `created_at`	TIMESTAMP	NOT NULL,
    `updated_at`	TIMESTAMP	NOT NULL
    );

CREATE TABLE IF NOT EXISTS `tier` (
                                      `tier_id`	INT UNSIGNED	NOT NULL	COMMENT '등급 ID',
                                      `tier_name`	VARCHAR(10)	NOT NULL	COMMENT '등급명',
    `min_point`	INT UNSIGNED	NOT NULL	COMMENT '등급 최소 점수',
    `max_point`	INT UNSIGNED	NOT NULL	COMMENT '등급 최대 점수',
    `created_at`	TIMESTAMP	NOT NULL	DEFAULT CURRENT_TIMESTAMP	COMMENT '생성일시'
    );

CREATE TABLE IF NOT EXISTS `Untitled` (
                                          `pk`	INTEGER	NOT NULL	COMMENT '기본키',
                                          `Field`	VARCHAR(255)	NULL
    );

CREATE TABLE IF NOT EXISTS `problem` (
                                         `problem_id`	INT UNSIGNED	NOT NULL	COMMENT '문제ID',
                                         `problem_title`	VARCHAR(50)	NOT NULL	COMMENT '문제 제목',
    `description`	TEXT	NULL	COMMENT '문제 설명',
    `input_file`	VARCHAR(1024)	NOT NULL	COMMENT '테스트 케이스 입력(input) 파일 경로',
    `output_file`	VARCHAR(1024)	NOT NULL	COMMENT '테스트 케이스 출력(output) 파일 경로',
    `point`	INT UNSIGNED	NOT NULL	DEFAULT 100	COMMENT '문제 해결 시 100 점',
    `total_count`	TINYINT	NOT NULL	COMMENT '테스트케이스 총 개수',
    `created_at`	TIMESTAMP	NOT NULL	COMMENT '문제 생성 일시',
    `updated_at`	TIMESTAMP	NOT NULL	COMMENT '문제 수정 일시'
    );

ALTER TABLE `team_room` ADD CONSTRAINT `PK_TEAM_ROOM` PRIMARY KEY (
                                                                   `team_room_id`
    );

ALTER TABLE `game_side_problem` ADD CONSTRAINT `PK_GAME_SIDE_PROBLEM` PRIMARY KEY (
                                                                                   `game_id`,
                                                                                   `side_problem_id`
    );

ALTER TABLE `testcase` ADD CONSTRAINT `PK_TESTCASE` PRIMARY KEY (
                                                                 `testcase_id`
    );

ALTER TABLE `chat_room` ADD CONSTRAINT `PK_CHAT_ROOM` PRIMARY KEY (
                                                                   `chatroom_id`
    );

ALTER TABLE `single_room` ADD CONSTRAINT `PK_SINGLE_ROOM` PRIMARY KEY (
                                                                       `single_room_id`
    );

ALTER TABLE `test_result` ADD CONSTRAINT `PK_TEST_RESULT` PRIMARY KEY (
                                                                       `test_result_id`
    );

ALTER TABLE `user_connection_history` ADD CONSTRAINT `PK_USER_CONNECTION_HISTORY` PRIMARY KEY (
                                                                                               `user_connection_history_id`
    );

ALTER TABLE `side_problem_history` ADD CONSTRAINT `PK_SIDE_PROBLEM_HISTORY` PRIMARY KEY (
                                                                                         `side_problem_history_id`
    );

ALTER TABLE `user_team_room` ADD CONSTRAINT `PK_USER_TEAM_ROOM` PRIMARY KEY (
                                                                             `team_room_id`,
                                                                             `user_id`
    );

ALTER TABLE `user` ADD CONSTRAINT `PK_USER` PRIMARY KEY (
                                                         `user_id`
    );

ALTER TABLE `ranking_history` ADD CONSTRAINT `PK_RANKING_HISTORY` PRIMARY KEY (
                                                                               `ranking_history_id`
    );

ALTER TABLE `point_history` ADD CONSTRAINT `PK_POINT_HISTORY` PRIMARY KEY (
                                                                           `point_history_id`
    );

ALTER TABLE `problem_image` ADD CONSTRAINT `PK_PROBLEM_IMAGE` PRIMARY KEY (
                                                                           `problem_image_id`
    );

ALTER TABLE `chat_message` ADD CONSTRAINT `PK_CHAT_MESSAGE` PRIMARY KEY (
                                                                         `chat_message_id`
    );

ALTER TABLE `tier_history` ADD CONSTRAINT `PK_TIER_HISTORY` PRIMARY KEY (
                                                                         `tier_history_id`
    );

ALTER TABLE `today_ranking` ADD CONSTRAINT `PK_TODAY_RANKING` PRIMARY KEY (
                                                                           `ranking_id`
    );

ALTER TABLE `friend_request` ADD CONSTRAINT `PK_FRIEND_REQUEST` PRIMARY KEY (
                                                                             `friend_request_id`
    );

ALTER TABLE `lang_limit` ADD CONSTRAINT `PK_LANG_LIMIT` PRIMARY KEY (
                                                                     `lang_limit_id`
    );

ALTER TABLE `test_history` ADD CONSTRAINT `PK_TEST_HISTORY` PRIMARY KEY (
                                                                         `test_history_id`
    );

ALTER TABLE `game` ADD CONSTRAINT `PK_GAME` PRIMARY KEY (
                                                         `game_id`
    );

ALTER TABLE `admin` ADD CONSTRAINT `PK_ADMIN` PRIMARY KEY (
                                                           `admin_id`
    );

ALTER TABLE `side_problem` ADD CONSTRAINT `PK_SIDE_PROBLEM` PRIMARY KEY (
                                                                         `side_problem_id`
    );

ALTER TABLE `user_chat_room` ADD CONSTRAINT `PK_USER_CHAT_ROOM` PRIMARY KEY (
                                                                             `user_chatroom_id`
    );

ALTER TABLE `Item` ADD CONSTRAINT `PK_ITEM` PRIMARY KEY (
                                                         `item_id`
    );

ALTER TABLE `ItemHistory` ADD CONSTRAINT `PK_ITEMHISTORY` PRIMARY KEY (
                                                                       `item_history_id`
    );

ALTER TABLE `Board` ADD CONSTRAINT `PK_BOARD` PRIMARY KEY (
                                                           `board_id`
    );

ALTER TABLE `tier` ADD CONSTRAINT `PK_TIER` PRIMARY KEY (
                                                         `tier_id`
    );

ALTER TABLE `problem` ADD CONSTRAINT `PK_PROBLEM` PRIMARY KEY (
                                                               `problem_id`
    );

ALTER TABLE `game_side_problem` ADD CONSTRAINT `FK_game_TO_game_side_problem_1` FOREIGN KEY (
                                                                                             `game_id`
    )
    REFERENCES `game` (
                       `game_id`
        );

ALTER TABLE `game_side_problem` ADD CONSTRAINT `FK_side_problem_TO_game_side_problem_1` FOREIGN KEY (
                                                                                                     `side_problem_id`
    )
    REFERENCES `side_problem` (
                               `side_problem_id`
        );

ALTER TABLE `user_team_room` ADD CONSTRAINT `FK_team_room_TO_user_team_room_1` FOREIGN KEY (
                                                                                            `team_room_id`
    )
    REFERENCES `team_room` (
                            `team_room_id`
        );

ALTER TABLE `user_team_room` ADD CONSTRAINT `FK_user_TO_user_team_room_1` FOREIGN KEY (
                                                                                       `user_id`
    )
    REFERENCES `user` (
                       `user_id`
        );

