package com.c203.altteulbe.game.web.dto.judge.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestCaseResult {
	private long cpuTime;
	private long realTime;
	private long memory;
	private int signal;
	private int exitCode;
	private int error;
	private int result;
	private String testCase;
	private String outputMd5;
	private String output;

	// 결과 해석을 위한 enum
	public enum Result {
		WRONG_ANSWER(-1),
		SUCCESS(0),
		CPU_TIME_LIMIT_EXCEEDED(1),
		REAL_TIME_LIMIT_EXCEEDED(2),
		MEMORY_LIMIT_EXCEEDED(3),
		RUNTIME_ERROR(4),
		SYSTEM_ERROR(5);

		private final int value;

		Result(int value) {
			this.value = value;
		}

		public static Result fromValue(int value) {
			for (Result result : values()) {
				if (result.value == value) {
					return result;
				}
			}
			throw new IllegalArgumentException("Unknown result value: " + value);
		}
	}

	// 에러 해석을 위한 enum
	public enum Error {
		SUCCESS(0),
		INVALID_CONFIG(-1),
		CLONE_FAILED(-2),
		PTHREAD_FAILED(-3),
		WAIT_FAILED(-4),
		ROOT_REQUIRED(-5),
		LOAD_SECCOMP_FAILED(-6),
		SETRLIMIT_FAILED(-7),
		DUP2_FAILED(-8),
		SETUID_FAILED(-9),
		EXECVE_FAILED(-10),
		SPJ_ERROR(-11);

		private final int value;

		Error(int value) {
			this.value = value;
		}

		public static Error fromValue(int value) {
			for (Error error : values()) {
				if (error.value == value) {
					return error;
				}
			}
			throw new IllegalArgumentException("Unknown error value: " + value);
		}
	}

	// 결과 해석 메서드
	public Result getResultEnum() {
		return Result.fromValue(this.result);
	}

	// 에러 해석 메서드
	public Error getErrorEnum() {
		return Error.fromValue(this.error);
	}
}
