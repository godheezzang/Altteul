package com.c203.altteulbe.game.web.dto.request;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JavaLangDto {
	private String template;
	private CompileConfig compile;
	private RunConfig run;

	// Inner DTO for compile settings
	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class CompileConfig {
		// Getter & Setter
		private String src_name;
		private String exe_name;
		private int max_cpu_time;
		private int max_real_time;
		private int max_memory;
		private String compile_command;
	}

	// Inner DTO for run settings
	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class RunConfig {
		private String command;
		private String seccomp_rule;
		private List<String> env;
		private int memory_limit_check_only;
	}
}