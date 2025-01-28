package com.c203.altteulbe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class AltteulBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(AltteulBeApplication.class, args);
	}

}
