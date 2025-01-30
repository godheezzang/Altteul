package com.c203.altteulbe.friend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.exception.BusinessException;
import com.c203.altteulbe.friend.persistent.entity.Friend;
import com.c203.altteulbe.friend.persistent.repository.FriendRepository;
import com.c203.altteulbe.friend.web.dto.response.FriendResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FriendService {

	private final FriendRepository friendRepository;
	private final UserStatusService userStatusService;
	private final UserRepository userRepository;

	@Transactional(readOnly = true)
	public Page<FriendResponseDto> getFriendsList(Long userId, int page, int size) {
		if (!userRepository.existsById(userId)) {
			// 나중에 UserNotFoundException으로 교체 예정
			throw new BusinessException("사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
		}
		Pageable pageable = PageRequest.of(page, size);
		Page<Friend> friendsPage = friendRepository.findAllByUserId(userId, pageable);
		if (friendsPage.isEmpty()) {
			return Page.empty(pageable);
		}
		return friendsPage
			.map(friend -> FriendResponseDto.from(
				friend,
				userStatusService.isUserOnline(friend.getFriend().getUserId())
			));
	}

}
