package com.c203.altteulbe.user.web.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

	@GetMapping("/me")
	public Long getCurrentUserId(@AuthenticationPrincipal Long id) {
		System.out.println(id);
		return id;
	}
}
