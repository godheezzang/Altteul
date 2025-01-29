package com.c203.altteulbe.friend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.friend.persistent.entity.Friend;
import com.c203.altteulbe.friend.persistent.repository.FriendRepository;
import com.c203.altteulbe.friend.web.dto.response.FriendResponseDto;

import io.lettuce.core.RedisConnectionException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FriendService {

	private final FriendRepository friendRepository;
	private final RedisTemplate<String, String> redisTemplate;
	private final UserRepository userRepository;

	@Transactional(readOnly = true)
	public Page<FriendResponseDto> getFriendsList(Long userId, int page, int size) {
		if (!userRepository.existsById(userId)) {
			throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
		}
		Pageable pageable = PageRequest.of(page, size);
		Page<Friend> friendsPage = friendRepository.findAllByUserId(userId, pageable);
		if (friendsPage.isEmpty()) {
			return Page.empty(pageable);
		}
		return friendsPage
			.map(friend -> FriendResponseDto.from(
				friend,
				checkUserOnlineStatus(friend.getFriend().getId())
			));
	}

	private boolean checkUserOnlineStatus(Long userId) {
		try {
			return Boolean.TRUE.equals(redisTemplate.hasKey("online_user:" + userId));
		} catch (RedisConnectionException e) {
			return false;
		}
	}
}
