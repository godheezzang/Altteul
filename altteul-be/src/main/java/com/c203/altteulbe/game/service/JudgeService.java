package com.c203.altteulbe.game.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.c203.altteulbe.game.service.exception.JudgeCompileException;
import com.c203.altteulbe.game.service.exception.JudgeServerException;
import com.c203.altteulbe.game.web.dto.request.JavaLangDto;
import com.c203.altteulbe.game.web.dto.request.JudgeRequest;
import com.c203.altteulbe.game.web.dto.request.SubmitCodeRequest;
import com.c203.altteulbe.game.web.dto.response.JudgeResponse;
import com.c203.altteulbe.game.web.dto.response.PingResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JudgeService {
	private final RestTemplate restTemplate;

	@Value("${judge.server.url}")
	private String judgeServerUrl;

	// 시스템 정보 조회
	public PingResponse getSystemInfo() {
		String url = judgeServerUrl + "/ping";
		return restTemplate.postForObject(url, null, PingResponse.class);
	}

	// 일반 채점 실행
	public JudgeResponse judgeSubmission(SubmitCodeRequest request) {

		String url = judgeServerUrl + "/judge";

		// Compile 설정
		JavaLangDto.CompileConfig compileConfig = JavaLangDto.CompileConfig.builder()
			.src_name("Main.java")
			.exe_name("Main")
			.max_cpu_time(5000)
			.max_real_time(10000)
			.max_memory(-1)
			.compile_command("/usr/bin/javac {src_path} -d {exe_dir}")
			.build();

		// Run 설정
		JavaLangDto.RunConfig runConfig = JavaLangDto.RunConfig.builder()
			.command("/usr/bin/java -cp {exe_dir} -XX:MaxRAM={max_memory}k Main")
			.seccomp_rule(null)
			.env(List.of("LANG=en_US.UTF-8", "LANGUAGE=en_US:en", "LC_ALL=en_US.UTF-8"))
			.memory_limit_check_only(1)
			.build();

		// JavaLangDto 생성
		JavaLangDto javaLangDto = JavaLangDto
			.builder()
			.template("//PREPEND BEGIN\nclass Main {\n//PREPEND END\n\n//TEMPLATE BEGIN\n  static int add(int a, int b) {\n    // code\n  }\n//TEMPLATE END\n\n//APPEND BEGIN\n  public static void main(String [] args) {\n    System.out.println(add(1, 2));\n  }\n}\n//APPEND END")
			.compile(compileConfig)
			.run(runConfig)
			.build();
		JudgeRequest judgeRequest = JudgeRequest.builder()
			.language_config(javaLangDto)
			.src(request.getCode())
			.max_cpu_time(5000L)
			.max_memory(1024*1024*100L)
			.test_case_id(request.getProblemId())
			.output(true)
			.build();
		return restTemplate.postForObject(url, judgeRequest, JudgeResponse.class);
	}

	// 컴파일 에러 처리
	public void handleJudgeError(JudgeResponse response) {
		if (response.getErr() != null) {
			if (response.getErr().equals("CompileError")) {
				throw new JudgeCompileException(response.getData().toString());
			}
			throw new JudgeServerException();
		}
	}
}

