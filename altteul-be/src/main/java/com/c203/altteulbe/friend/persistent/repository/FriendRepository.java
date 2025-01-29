package com.c203.altteulbe.friend.persistent.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.c203.altteulbe.friend.persistent.entity.Friend;
import com.c203.altteulbe.friend.persistent.entity.FriendId;

public interface FriendRepository extends JpaRepository<Friend, FriendId> {

	Page<Friend> findAllByUserId(Long userId, Pageable pageable);
}
