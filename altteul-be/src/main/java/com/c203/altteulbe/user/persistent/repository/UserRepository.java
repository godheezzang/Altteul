package com.c203.altteulbe.user.persistent.repository;

import com.c203.altteulbe.user.persistent.entity.User;

public interface UserRepository {
	User findByUserId(Long userId);
	void save(User user);
	boolean existsByUsername(String username);
	boolean existsByNickname(String nickname);
}