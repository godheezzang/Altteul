package com.c203.altteulbe.user.persistent.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.c203.altteulbe.user.persistent.entity.User;

@Repository
public interface UserRepository {
	Optional<User> findByUserId(Long userId);

	void save(User user);

	boolean existsByUsername(String username);

	boolean existsByNickname(String nickname);

	Optional<User> findByUsername(String username);

	Optional<User> findByProviderAndUsername(User.Provider provider, String username);
}
