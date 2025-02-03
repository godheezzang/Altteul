package com.c203.altteulbe.game.web.dto.request;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class JudgeRequest {
	String src;
	JavaLangDto language_config;
	Long max_cpu_time;
	Long max_memory;
	String test_case_id;
	Boolean output;
	String io_mode;
}