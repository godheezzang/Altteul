package com.c203.altteulbe.game.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.c203.altteulbe.game.service.exception.JudgeCompileException;
import com.c203.altteulbe.game.service.exception.JudgeServerException;
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
		Map<String, Object> javaLangConfig = new HashMap<>();

		javaLangConfig.put("name", "java");

		Map<String, Object> compile = new HashMap<>();
		compile.put("src_name", "Main.java");
		compile.put("exe_name", "Main");
		compile.put("max_cpu_time", 3000);
		compile.put("max_real_time", 5000);
		compile.put("max_memory", -1);
		compile.put("compile_command", "/usr/bin/javac {src_path} -d {exe_dir} -encoding UTF8");

		javaLangConfig.put("compile", compile);

		Map<String, Object> run = new HashMap<>();
		run.put("command", "/usr/bin/java -cp {exe_dir} -XX:MaxRAM={max_memory}k -Djava.security.manager -Dfile.encoding=UTF-8 -Djava.security.policy==/etc/java_policy -Djava.awt.headless=true Main");
		run.put("seccomp_rule", null);
		run.put("env", "default_env");  // 실제 환경에서는 적절한 환경 변수 맵으로 대체해야 합니다.
		run.put("memory_limit_check_only", 1);

		javaLangConfig.put("run", run);
		String url = judgeServerUrl + "/judge";
		JudgeRequest judgeRequest = JudgeRequest.builder()
			.src(request.getCode())
			.test_case_id(request.getProblemId())
			.language_config(javaLangConfig)
			.max_cpu_time(1L)
			.max_memory(512L)
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

