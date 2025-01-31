-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: altteul
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '관리자 ID',
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '관리자 비밀번호',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '변경 일시',
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board` (
  `board_id` int unsigned NOT NULL AUTO_INCREMENT,
  `board_title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `board_type` enum('NOTIFICATION','FAQ') COLLATE utf8mb4_unicode_ci NOT NULL,
  `board_content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`board_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chat_message`
--

DROP TABLE IF EXISTS `chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_message` (
  `chat_message_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '채팅 메시지ID',
  `chatroom_id` int unsigned NOT NULL COMMENT '채팅방 ID',
  `sender_id` int unsigned NOT NULL COMMENT '채팅 메시지를 보내는 유저',
  `message_content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '채팅 시 주고받는 내용',
  `checked` tinyint(1) NOT NULL COMMENT '수신자 채팅 확인 여부',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '채팅 보낸 일시',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '확인 여부가 수정되는 일시',
  PRIMARY KEY (`chat_message_id`),
  KEY `fk_chat_message_sender_id_user_id` (`sender_id`),
  KEY `fk_chat_message_chatroom_id_chatroom_id` (`chatroom_id`),
  CONSTRAINT `fk_chat_message_chatroom_id_chatroom_id` FOREIGN KEY (`chatroom_id`) REFERENCES `chat_room` (`chatroom_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_chat_message_sender_id_user_id` FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chat_room`
--

DROP TABLE IF EXISTS `chat_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room` (
  `chatroom_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '채팅방 ID',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '채팅방이 생성된 일시',
  PRIMARY KEY (`chatroom_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `friend_request`
--

DROP TABLE IF EXISTS `friend_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friend_request` (
  `friend_request_id` int unsigned NOT NULL AUTO_INCREMENT,
  `to_user_id` int unsigned NOT NULL COMMENT '유저 ID',
  `from_user_id` int unsigned NOT NULL COMMENT '유저 ID',
  `request_status` enum('P','A','R') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'P' COMMENT '친구 요청 - > 보류, 승인, 거부',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '친구 신청 일시',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '친구요청을 처리한 일시',
  PRIMARY KEY (`friend_request_id`),
  KEY `fk_friend_request_to_user_id_user_id` (`to_user_id`),
  KEY `fk_friend_request_from_user_id_user_id` (`from_user_id`),
  CONSTRAINT `fk_friend_request_from_user_id_user_id` FOREIGN KEY (`from_user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_friend_request_to_user_id_user_id` FOREIGN KEY (`to_user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `friendship`
--

DROP TABLE IF EXISTS `friendship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friendship` (
  `friend_id` int unsigned NOT NULL COMMENT '친구ID',
  `user_id` int unsigned NOT NULL COMMENT '유저ID',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '서로 친구가 된 일시',
  PRIMARY KEY (`friend_id`,`user_id`),
  KEY `fk_friend_user_id_user_id` (`user_id`),
  CONSTRAINT `fk_friend_user_id_friend_id` FOREIGN KEY (`friend_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_friend_user_id_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `game_id` int unsigned NOT NULL COMMENT '게임ID',
  `problem_id` int unsigned NOT NULL COMMENT '문제ID',
  `battle_type` enum('S','T') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'S' COMMENT '배틀 타입',
  `started_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '게임 시작 시간',
  `completed_at` timestamp NOT NULL COMMENT '시작 시간으로부터 3시간',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  PRIMARY KEY (`game_id`),
  KEY `fk_game_problem_id_problem_id` (`problem_id`),
  CONSTRAINT `fk_game_problem_id_problem_id` FOREIGN KEY (`problem_id`) REFERENCES `problem` (`problem_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_side_problem`
--

DROP TABLE IF EXISTS `game_side_problem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_side_problem` (
  `game_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '게임ID',
  `side_problem_id` int unsigned NOT NULL COMMENT '사이드 문제ID',
  `side_problem_order` tinyint NOT NULL COMMENT '출제 순서',
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`game_id`,`side_problem_id`),
  KEY `FK_side_problem_TO_game_side_problem_1` (`side_problem_id`),
  CONSTRAINT `FK_game_TO_game_side_problem_1` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_side_problem_TO_game_side_problem_1` FOREIGN KEY (`side_problem_id`) REFERENCES `side_problem` (`side_problem_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `item_id` int unsigned NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `item_history`
--

DROP TABLE IF EXISTS `item_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_history` (
  `item_history_id` int unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int unsigned NOT NULL,
  `game_id` int unsigned NOT NULL COMMENT '게임ID',
  `team_room_id` int unsigned NOT NULL COMMENT '팀방ID',
  `user_id` int unsigned NOT NULL COMMENT '유저ID',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  PRIMARY KEY (`item_history_id`),
  KEY `fk_item_history_team_room_id_team_room_id` (`team_room_id`),
  KEY `fk_item_history_user_id_user_id` (`user_id`),
  KEY `fk_item_history_game_id_game_id` (`game_id`),
  KEY `fk_item_history_item_id_item_id` (`item_id`),
  CONSTRAINT `fk_item_history_game_id_game_id` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_item_history_item_id_item_id` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_item_history_team_room_id_team_room_id` FOREIGN KEY (`team_room_id`) REFERENCES `team_room` (`team_room_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_item_history_user_id_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lang_limit`
--

DROP TABLE IF EXISTS `lang_limit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lang_limit` (
  `lang_limit_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '제한 ID',
  `problem_id` int unsigned NOT NULL COMMENT '문제ID',
  `lang` enum('JV','PY') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'PYTHON, JAVA',
  `limit_time` float NOT NULL DEFAULT '1' COMMENT '초 단위',
  `limit_memory` float NOT NULL DEFAULT '512' COMMENT 'MB 단위',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '수정 일시',
  PRIMARY KEY (`lang_limit_id`),
  KEY `fk_lang_limit_problem_id_problem_id` (`problem_id`),
  CONSTRAINT `fk_lang_limit_problem_id_problem_id` FOREIGN KEY (`problem_id`) REFERENCES `problem` (`problem_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `point_history`
--

DROP TABLE IF EXISTS `point_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `point_history` (
  `point_history_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '점수내역ID',
  `game_id` int unsigned NOT NULL COMMENT '게임ID',
  `user_id` int unsigned NOT NULL COMMENT '유저ID',
  `side_problem_id` int unsigned DEFAULT NULL COMMENT '사이드 문제ID',
  `point` tinyint NOT NULL COMMENT '획득한 점수',
  `game_type` enum('S','T') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '개인전, 팀전',
  `point_type` enum('B','S','D') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '배틀, 사이드 문제, 알고리즘 문제 맞춘 경우',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '점수 획득 일시',
  PRIMARY KEY (`point_history_id`),
  KEY `fk_point_history_game_id_game_id` (`game_id`),
  KEY `fk_point_history_user_id_user_id` (`user_id`),
  KEY `fk_point_history_side_problem_id_side_problem_id` (`side_problem_id`),
  CONSTRAINT `fk_point_history_game_id_game_id` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_point_history_side_problem_id_side_problem_id` FOREIGN KEY (`side_problem_id`) REFERENCES `side_problem` (`side_problem_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_point_history_user_id_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `problem`
--

DROP TABLE IF EXISTS `problem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `problem` (
  `problem_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '문제ID',
  `problem_title` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '문제 제목',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '문제 설명',
  `input_file` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '테스트 케이스 입력(input) 파일 경로',
  `output_file` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '테스트 케이스 출력(output) 파일 경로',
  `point` int unsigned NOT NULL DEFAULT '100' COMMENT '문제 해결 시 100 점',
  `total_count` tinyint NOT NULL COMMENT '테스트케이스 총 개수',
  `created_at` timestamp NOT NULL COMMENT '문제 생성 일시',
  `updated_at` timestamp NOT NULL COMMENT '문제 수정 일시',
  PRIMARY KEY (`problem_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `problem_image`
--

DROP TABLE IF EXISTS `problem_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `problem_image` (
  `problem_image_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '문제 이미지ID',
  `problem_id` int unsigned NOT NULL COMMENT '문제ID',
  `problem_image_url` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '이미지 파일 경로',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 생성 일시',
  PRIMARY KEY (`problem_image_id`),
  KEY `fk_problem_image_problem_id_problem_id` (`problem_id`),
  CONSTRAINT `fk_problem_image_problem_id_problem_id` FOREIGN KEY (`problem_id`) REFERENCES `problem` (`problem_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ranking_history`
--

DROP TABLE IF EXISTS `ranking_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ranking_history` (
  `ranking_history_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '랭킹 내역ID',
  `user_id` int unsigned NOT NULL COMMENT '유저ID',
  `tier_id` tinyint unsigned NOT NULL COMMENT '등급 ID',
  `ranking_point` int unsigned NOT NULL DEFAULT '0' COMMENT '랭킹 점수',
  `ranking` int unsigned NOT NULL COMMENT '랭킹 순위',
  `ranking_change` int unsigned DEFAULT '0' COMMENT '전날 랭킹과 당일 랭킹 차이',
  `ranking_history_date` date NOT NULL COMMENT '랭킹을 기록(저장)한 날짜',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 생성 일시',
  PRIMARY KEY (`ranking_history_id`),
  KEY `fk_ranking_history_user_id_user_id` (`user_id`),
  KEY `fk_ranking_history_tier_id_tier_id` (`tier_id`),
  CONSTRAINT `fk_ranking_history_tier_id_tier_id` FOREIGN KEY (`tier_id`) REFERENCES `tier` (`tier_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ranking_history_user_id_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `side_problem`
--

DROP TABLE IF EXISTS `side_problem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `side_problem` (
  `side_problem_id` int unsigned NOT NULL COMMENT '사이드 문제ID',
  `side_problem_title` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '문제 제목',
  `side_problem_content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '문제 내용',
  `side_problem_answer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '정답',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 생성 일시',
  PRIMARY KEY (`side_problem_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `side_problem_history`
--

DROP TABLE IF EXISTS `side_problem_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `side_problem_history` (
  `side_problem_history_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '기록 ID',
  `game_id` int unsigned NOT NULL COMMENT '게임ID',
  `team_room_id` int unsigned DEFAULT NULL COMMENT '팀방ID',
  `user_id` int unsigned NOT NULL COMMENT '유저ID',
  `side_problem_id` int unsigned NOT NULL COMMENT '사이드 문제ID',
  `user_answer` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '유저가 제출한 답',
  `result` enum('P','F') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '정답 여부',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '사이드 문제를 푼 일시',
  PRIMARY KEY (`side_problem_history_id`),
  KEY `fk_side_problem_history_user_id_user_id` (`user_id`),
  KEY `fk_side_problem_history_side_problem_id_side_problem_id` (`side_problem_id`),
  KEY `fk_side_problem_history_game_id_game_id` (`game_id`),
  KEY `fk_side_problem_history_team_room_id_team_room_id` (`team_room_id`),
  CONSTRAINT `fk_side_problem_history_game_id_game_id` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_side_problem_history_side_problem_id_side_problem_id` FOREIGN KEY (`side_problem_id`) REFERENCES `side_problem` (`side_problem_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_side_problem_history_team_room_id_team_room_id` FOREIGN KEY (`team_room_id`) REFERENCES `team_room` (`team_room_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_side_problem_history_user_id_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `single_room`
--

DROP TABLE IF EXISTS `single_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `single_room` (
  `single_room_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '개인방ID',
  `game_id` int unsigned DEFAULT NULL COMMENT '게임ID',
  `user_id` int unsigned NOT NULL COMMENT '유저ID',
  `matching_order` tinyint NOT NULL COMMENT '한 방에 매칭된 순서',
  `code` text COLLATE utf8mb4_unicode_ci COMMENT '팀 현재 기준 최종 제출 코드',
  `solved_testcase_count` int unsigned DEFAULT NULL COMMENT '개인의 현재까지 제출 기록 중 최대 정답 개수',
  `battle_result` enum('0','1','2','3','4','5','6','7','8') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '-1: 문제 못풀었을 때, 0: 무승부, 1~8: 순위',
  `reward_point` int DEFAULT NULL COMMENT '문제풀이 성공 시 기본 100, 그 이후 등수에 따라 차등 지급',
  `last_execute_time` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '초 단위, 미제출 시 NULL',
  `last_execute_memory` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'MB단위, 미제출 시 NULL',
  `lang` enum('JV','PY') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '배틀에서 사용할 언어',
  `activatation` tinyint(1) NOT NULL DEFAULT '1' COMMENT '게임 종료된 방인가? 취소된 방인가?',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `finish_time` timestamp NULL DEFAULT NULL COMMENT '유저가 문제를 해결하거나 타임아웃된 후 게임을 나간 시간',
  PRIMARY KEY (`single_room_id`),
  KEY `fk_single_room_game_id_game_id` (`game_id`),
  KEY `fk_single_room_user_id_user_id` (`user_id`),
  CONSTRAINT `fk_single_room_game_id_game_id` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_single_room_user_id_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_room`
--

DROP TABLE IF EXISTS `team_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_room` (
  `team_room_id` int unsigned NOT NULL COMMENT '팀방ID',
  `game_id` int unsigned DEFAULT NULL COMMENT '게임ID',
  `code` text COLLATE utf8mb4_unicode_ci COMMENT '팀 현재 기준 최종 제출 코드',
  `solved_testcase_count` int unsigned DEFAULT NULL COMMENT '팀의 현재까지 제출 기록 중 최대 정답 개수',
  `battle_result` enum('0','1','2','3','4','5','6','7','8') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '-1: 문제 못풀었을 때, 0: 무승부, 1~8: 순위',
  `reward_point` int DEFAULT NULL COMMENT '문제풀이 성공 시 기본 100, 그 이후 등수에 따라 차등 지급',
  `last_execute_time` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '초 단위, 미제출 시 NULL',
  `last_execute_memory` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'MB 단위, 미제출 시 NULL',
  `lang` enum('JV','PY') COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '배틀에서 사용할 언어',
  `activation` tinyint(1) NOT NULL DEFAULT '1' COMMENT '게임 종료된 방인가? 취소된 방인가?',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  `finish_time` timestamp NULL DEFAULT NULL COMMENT '유저가 문제를 해결하거나 타임아웃된 후 게임을 나간 시간',
  PRIMARY KEY (`team_room_id`),
  KEY `fk_team_room_game_id_game_id` (`game_id`),
  CONSTRAINT `fk_team_room_game_id_game_id` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_history`
--

DROP TABLE IF EXISTS `test_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_history` (
  `test_history_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '제출 ID',
  `game_id` int unsigned NOT NULL COMMENT '게임ID',
  `user_id` int unsigned NOT NULL COMMENT '유저ID',
  `problem_id` int unsigned NOT NULL COMMENT '문제ID',
  `code` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '제출한 코드',
  `execute_time` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '초 단위',
  `execute_memory` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'MB 단위',
  `result` enum('P','F') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '성공, 실패',
  `success_count` tinyint NOT NULL COMMENT '맞은 테스트케이스 개수',
  `fail_count` tinyint NOT NULL COMMENT '틀린 테스트케이스 개수',
  `created_at` timestamp NOT NULL COMMENT '코드 제출 일시',
  PRIMARY KEY (`test_history_id`),
  KEY `fk_test_history_game_id_game_id` (`game_id`),
  KEY `fk_test_history_user_id_user_id` (`user_id`),
  KEY `fk_test_history_problem_id_problem_id` (`problem_id`),
  CONSTRAINT `fk_test_history_game_id_game_id` FOREIGN KEY (`game_id`) REFERENCES `game` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_test_history_problem_id_problem_id` FOREIGN KEY (`problem_id`) REFERENCES `problem` (`problem_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_test_history_user_id_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_result`
--

DROP TABLE IF EXISTS `test_result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_result` (
  `test_result_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '테스트 결과ID',
  `test_history_id` int unsigned NOT NULL COMMENT '제출ID',
  `execute_time` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '초 단위',
  `execute_memory` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'MB 단위',
  `test_result` enum('P','F') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '성공/실패 여부',
  `user_output` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '유저 출력',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '결과 데이터 생성 일시',
  PRIMARY KEY (`test_result_id`),
  KEY `fk_test_result_test_history_id_test_history_id` (`test_history_id`),
  CONSTRAINT `fk_test_result_test_history_id_test_history_id` FOREIGN KEY (`test_history_id`) REFERENCES `test_history` (`test_history_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `testcase`
--

DROP TABLE IF EXISTS `testcase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testcase` (
  `testcase_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '테스트케이스ID',
  `problem_id` int unsigned NOT NULL COMMENT '문제ID',
  `testcase_number` tinyint NOT NULL COMMENT '테스트케이스번호',
  `input` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'input 값',
  `output` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'output 값',
  `created_at` timestamp NOT NULL COMMENT '테스트케이스 생성 일시',
  `updated_at` timestamp NOT NULL COMMENT '테스트케이스 수정 일시',
  PRIMARY KEY (`testcase_id`),
  KEY `fk_testcase_problem_id_problem_id` (`problem_id`),
  CONSTRAINT `fk_testcase_problem_id_problem_id` FOREIGN KEY (`problem_id`) REFERENCES `problem` (`problem_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tier`
--

DROP TABLE IF EXISTS `tier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tier` (
  `tier_id` tinyint unsigned NOT NULL AUTO_INCREMENT COMMENT '등급 ID',
  `tier_name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '등급명',
  `min_point` int unsigned NOT NULL COMMENT '등급 최소 점수',
  `max_point` int unsigned NOT NULL COMMENT '등급 최대 점수',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
  PRIMARY KEY (`tier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tier_history`
--

DROP TABLE IF EXISTS `tier_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tier_history` (
  `tier_history_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '등급변동내역ID',
  `user_id` int unsigned NOT NULL COMMENT '유저ID',
  `next_tier` tinyint unsigned NOT NULL COMMENT '변경 티어',
  `prev_point` int unsigned NOT NULL COMMENT '이전 점수',
  `next_point` int unsigned NOT NULL COMMENT '이후 점수',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성 일시',
  PRIMARY KEY (`tier_history_id`),
  KEY `fk_tier_history_user_id_user_id` (`user_id`),
  KEY `fk_tier_history_next_tier_tier_id` (`next_tier`),
  CONSTRAINT `fk_tier_history_next_tier_tier_id` FOREIGN KEY (`next_tier`) REFERENCES `tier` (`tier_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tier_history_user_id_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `today_ranking`
--

DROP TABLE IF EXISTS `today_ranking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `today_ranking` (
  `ranking_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '랭킹 순위',
  `user_id` int unsigned NOT NULL COMMENT '유저ID',
  `tier_id` tinyint unsigned NOT NULL COMMENT '등급 ID',
  `ranking_point` int unsigned NOT NULL DEFAULT '0' COMMENT '랭킹 점수',
  `ranking_change` int unsigned NOT NULL DEFAULT '0' COMMENT '전날 랭킹과 당일 랭킹 차이',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '데이터 생성 일시',
  PRIMARY KEY (`ranking_id`),
  KEY `fk_today_ranking_user_id_user_id` (`user_id`),
  KEY `fk_today_ranking_tier_id_tier_id` (`tier_id`),
  CONSTRAINT `fk_today_ranking_tier_id_tier_id` FOREIGN KEY (`tier_id`) REFERENCES `tier` (`tier_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_today_ranking_user_id_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `tier_id` tinyint unsigned NOT NULL DEFAULT '1' COMMENT '등급 ID',
  `profile_img` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '기본 이미지 URL' COMMENT '프로필 이미지 URL',
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '닉네임',
  `main_lang` enum('JV','PY') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '유저의 선호 프로그래밍 언어',
  `user_status` enum('A','S','D') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '정지 유저, 활성화 유저 구분',
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '유니크한 이메일',
  `password` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '비밀번호',
  `provider` enum('LC','GH') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '로그인 유형 구별',
  `ranking_point` int unsigned NOT NULL DEFAULT '0' COMMENT '랭킹 점수',
  `last_out_time` timestamp NULL DEFAULT NULL COMMENT '가장 마지막에 소켓에서 나간 순간',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '유저 정보 생성 일시',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '유저 정보 수정 일시',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `nickname_UNIQUE` (`nickname`),
  KEY `fk_user_tier_id_tier_id` (`tier_id`),
  CONSTRAINT `fk_user_tier_id_tier_id` FOREIGN KEY (`tier_id`) REFERENCES `tier` (`tier_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_chat_room`
--

DROP TABLE IF EXISTS `user_chat_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_chat_room` (
  `user_chatroom_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '채팅 참여ID',
  `chatroom_id` int unsigned NOT NULL COMMENT '채팅방ID',
  `user_id` int unsigned NOT NULL COMMENT '유저ID',
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`user_chatroom_id`),
  KEY `fk_user_chat_room_chatroom_id_chatroom_id` (`chatroom_id`),
  KEY `fk_user_chat_room_user_id_user_id` (`user_id`),
  CONSTRAINT `fk_user_chat_room_chatroom_id_chatroom_id` FOREIGN KEY (`chatroom_id`) REFERENCES `chat_room` (`chatroom_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_chat_room_user_id_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_connection_history`
--

DROP TABLE IF EXISTS `user_connection_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_connection_history` (
  `user_connection_history_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '유저 접속 ID',
  `user_id` int unsigned NOT NULL COMMENT '유저ID',
  `connection_type` enum('I','O') COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '연결과 연결끊김 관리',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '로그 생성일시',
  PRIMARY KEY (`user_connection_history_id`),
  KEY `fk_user_connection_history_user_id_user_id` (`user_id`),
  CONSTRAINT `fk_user_connection_history_user_id_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_team_room`
--

DROP TABLE IF EXISTS `user_team_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_team_room` (
  `team_room_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '팀방ID',
  `user_id` int unsigned NOT NULL COMMENT '유저ID',
  `team_order` tinyint NOT NULL,
  PRIMARY KEY (`team_room_id`,`user_id`),
  KEY `FK_user_TO_user_team_room_1` (`user_id`),
  CONSTRAINT `FK_team_room_TO_user_team_room_1` FOREIGN KEY (`team_room_id`) REFERENCES `team_room` (`team_room_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_TO_user_team_room_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'altteul'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-31  4:13:27
