package com.c203.altteulbe.friend.persistent.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.c203.altteulbe.common.dto.RequestStatus;
import com.c203.altteulbe.friend.persistent.entity.FriendRequest;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
	Page<FriendRequest> findAllByToUserIdAndRequestStatus(Long userId, RequestStatus status, Pageable pageable);

	boolean existsByFromUserIdAndToUserIdAndRequestStatus(Long fromUserId, Long toUserId, RequestStatus requestStatus);
}
