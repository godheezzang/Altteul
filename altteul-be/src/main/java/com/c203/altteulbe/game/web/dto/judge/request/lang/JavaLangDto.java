package com.c203.altteulbe.game.web.dto.judge.request.lang;

import lombok.Builder;
import lombok.experimental.SuperBuilder;

@SuperBuilder(toBuilder = true)
public class JavaLangDto extends LangDto {
	private CompileConfig compile;
	private RunConfig run;

	@Builder()
	public static class CompileConfig {
		private final String src_name = "Main.java";
		private final String exe_name = "Main";
		private final String compile_command = "/usr/bin/javac {src_path} -d {exe_dir}";
		@Builder.Default
		private int max_cpu_time = 5000;
		@Builder.Default
		private int max_real_time = 10000;
		@Builder.Default
		private int max_memory = 128 * 1024 * 1024;
	}

	@SuperBuilder(toBuilder = true)
	public static class RunConfig extends CommonRunConfig {
		private final String command = "/usr/bin/java -cp {exe_dir} -XX:MaxRAM={max_memory}k Main";
		private final String seccomp_rule = null;
		private final int memory_limit_check_only = 1;
	}
}