package com.c203.altteulbe.friend.persistent.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.c203.altteulbe.friend.persistent.entity.FriendRequest;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
	Page<FriendRequest> findAllByToUserId(Long userId, Pageable pageable);
}
