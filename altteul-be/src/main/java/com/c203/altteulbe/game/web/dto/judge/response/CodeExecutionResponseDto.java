package com.c203.altteulbe.game.web.dto.judge.response;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecutionResponseDto {
	private List<ExampleResponseDto> testCases;
	private String message;
	private boolean isNotCompileError;

	public static CodeExecutionResponseDto from(JudgeResponse judgeResponse) {
		String message = null;
		boolean isNotCompileError = true;
		List<ExampleResponseDto> testCaseResponses = null;

		// 컴파일에러 아닌 경우 message : null, isNotCompileError : true, 테스트케이스 데이터 포함. 컴파일 에러인 경우 반대
		if (judgeResponse.isNotCompileError()) {
			testCaseResponses = new ArrayList<>();
			List<TestCaseResult> testCaseResults = judgeResponse.testDataGetter();
			for (int i = 0; i < testCaseResults.size(); i++) {
				TestCaseResult testCaseResult = testCaseResults.get(i);
				String status = null;
				switch (testCaseResult.getResultEnum()) {
					case SUCCESS -> status = "P";
					case WRONG_ANSWER -> status = "F";
					case RUNTIME_ERROR -> status = "RUN";
					case CPU_TIME_LIMIT_EXCEEDED -> status = "TLE";
					case MEMORY_LIMIT_EXCEEDED -> status = "MLE";
				}

				testCaseResponses.add(ExampleResponseDto.builder()
					.testCaseId((long) (i + 1))
					.testCaseNumber(i + 1)
					.status(status)
					.output(testCaseResult.getOutput())
					.answer("asdf")
					.build());
			}
		} else {
			message = judgeResponse.getData().toString();
			isNotCompileError = false;
		}
		return CodeExecutionResponseDto.builder()
			.testCases(testCaseResponses)
			.message(message)
			.isNotCompileError(isNotCompileError)
			.build();
	}
}
