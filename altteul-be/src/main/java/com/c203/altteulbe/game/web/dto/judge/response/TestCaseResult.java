package com.c203.altteulbe.game.web.dto.judge.response;

public class TestCaseResult {
	private Long testCaseId;
	private int testCaseNumber;
	private String status; // "P", "F", "RUN", "COMP", "TLE", "MLE" 등
	private Integer executionTime;   // ms 단위
	private Integer executionMemory; // KB 단위

}
