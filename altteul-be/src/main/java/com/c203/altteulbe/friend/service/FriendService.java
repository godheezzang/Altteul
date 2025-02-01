package com.c203.altteulbe.friend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.exception.BusinessException;
import com.c203.altteulbe.friend.persistent.entity.Friendship;
import com.c203.altteulbe.friend.persistent.repository.FriendRepository;
import com.c203.altteulbe.friend.web.dto.response.FriendResponseDto;
import com.c203.altteulbe.user.persistent.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FriendService {

	private final FriendRepository friendRepository;
	private final UserStatusService userStatusService;
	private final UserRepository userRepository;
	private final SimpMessagingTemplate messagingTemplate;

	@Transactional(readOnly = true)
	public Page<FriendResponseDto> getFriendsList(Long userId, int page, int size) {
		userRepository.findByUserId(userId)
			.orElseThrow(NotFoundUserException::new);

		return friendRepository.findAllByIdUserId(
			userId,
			PageRequest.of(page, size)
		).map(friendship -> FriendResponseDto.from(
			friendship,
			userStatusService.isUserOnline(friendship.getFriend().getUserId())
		));
	}

}
