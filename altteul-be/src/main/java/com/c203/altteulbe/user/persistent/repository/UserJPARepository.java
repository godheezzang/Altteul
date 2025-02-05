package com.c203.altteulbe.user.persistent.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.c203.altteulbe.user.persistent.entity.User;

public interface UserJPARepository extends JpaRepository<User, Long> {

	Optional<User> findByUserId(Long userId);
	List<User> findByUserIdIn(List<Long> userIds);

}
