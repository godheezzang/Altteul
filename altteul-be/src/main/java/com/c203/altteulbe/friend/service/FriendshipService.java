package com.c203.altteulbe.friend.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.exception.BusinessException;
import com.c203.altteulbe.common.utils.RedisUtils;
import com.c203.altteulbe.friend.persistent.entity.Friendship;
import com.c203.altteulbe.friend.persistent.repository.FriendshipRepository;
import com.c203.altteulbe.friend.web.dto.response.FriendResponseDto;
import com.c203.altteulbe.user.persistent.repository.UserRepository;
import com.c203.altteulbe.user.service.exception.NotFoundUserException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FriendshipService {

	private final FriendshipRepository friendshipRepository;
	private final UserStatusService userStatusService;
	private final UserRepository userRepository;
	private final SimpMessagingTemplate messagingTemplate;
	private final RedisUtils redisUtils;

	@Transactional(readOnly = true)
	public Page<FriendResponseDto> getFriendsList(Long userId, int page, int size) {
		userRepository.findByUserId(userId)
			.orElseThrow(NotFoundUserException::new);

		Page<Friendship> friendships = friendshipRepository.findAllByUserIdWithFriend(
			userId,
			PageRequest.of(page, size)
		);
		// 친구 관계이 있는 유저의 id들을 리스트로 만들기
		List<Long> friendIds = friendships.getContent().stream()
			.map(friendship -> friendship.getFriend().getUserId())
			.toList();
		// 유저들의 온라인 상태 확인
		Map<Long, Boolean> onlineStatus = userStatusService.getBulkOnlineStatus(friendIds);

		return friendships.map(friendship -> FriendResponseDto.from(
			friendship, onlineStatus.get(friendship.getFriend().getUserId())
		));
	}

	// 친구 관계 삭제
	@Transactional
	public void deleteFriendship(Long userId, Long friendId) {
		if (!friendshipRepository.existsByUserAndFriend(userId, friendId)) {
			throw new BusinessException("친구 관계가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
		}
		friendshipRepository.deleteFriendshipBiDirectional(userId, friendId);

		// redis에서도 친구 관계 삭제
		redisUtils.deleteFriendRelation(userId, friendId);
	}

}
