package com.c203.altteulbe.friend.persistent.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.c203.altteulbe.friend.persistent.entity.FriendId;
import com.c203.altteulbe.friend.persistent.entity.Friendship;

public interface FriendRepository extends JpaRepository<Friendship, FriendId> {

	Page<Friendship> findAllByIdUserId(Long userId, Pageable pageable);
}
