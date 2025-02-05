package com.c203.altteulbe.friend.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.response.PageResponse;
import com.c203.altteulbe.common.utils.PaginateUtil;
import com.c203.altteulbe.friend.persistent.entity.Friendship;
import com.c203.altteulbe.friend.persistent.repository.FriendshipRepository;
import com.c203.altteulbe.friend.service.exception.FriendRelationNotFoundException;
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
	private final FriendRedisService friendRedisService;

	@Transactional(readOnly = true)
	public PageResponse<FriendResponseDto> getFriendsList(Long userId, Pageable pageable) {
		userRepository.findByUserId(userId)
			.orElseThrow(NotFoundUserException::new);

		// 캐시된 친구 리스트 조회
		List<FriendResponseDto> cachedFriendList = friendRedisService.getCachedFriendList(userId);
		if (cachedFriendList != null && !cachedFriendList.isEmpty()) {
			Page<FriendResponseDto> paginateResult = PaginateUtil.paginate(cachedFriendList, pageable.getPageNumber(),
				pageable.getPageSize());
			return new PageResponse<>("friends", paginateResult);
		}

		Page<Friendship> friendships = friendshipRepository.findAllByUserIdWithFriend(
			userId,
			PageRequest.of(pageable.getPageNumber(),
				pageable.getPageSize())
		);
		// 친구 관계이 있는 유저의 id들을 리스트로 만들기
		List<Long> friendIds = friendships.getContent().stream()
			.map(friendship -> friendship.getFriend().getUserId())
			.toList();
		// 유저들의 온라인 상태 확인
		Map<Long, Boolean> onlineStatus = userStatusService.getBulkOnlineStatus(friendIds);

		List<FriendResponseDto> friendList = friendships.stream()
			.map(friendship -> FriendResponseDto.from(
				friendship, onlineStatus.get(friendship.getFriend().getUserId())
			)).toList();

		// 친구 리스트 캐싱
		friendRedisService.setFriendList(userId, friendList);

		Page<FriendResponseDto> paginateResult = PaginateUtil.paginate(friendList, pageable.getPageNumber(),
			pageable.getPageSize());
		return new PageResponse<>("friends", paginateResult);
	}

	// 친구 관계 삭제
	@Transactional
	public void deleteFriendship(Long userId, Long friendId) {
		if (!friendshipRepository.existsByUserAndFriend(userId, friendId)) {
			throw new FriendRelationNotFoundException();
		}
		friendshipRepository.deleteFriendRelation(userId, friendId);

		// redis에서도 친구 관계 삭제
		friendRedisService.deleteFriendRelation(userId, friendId);

		// 친구 관계가 변함에 따라서 캐시 되어 있는 친구 리스트 삭제
		friendRedisService.invalidateFriendList(userId);
		friendRedisService.invalidateFriendList(friendId);
	}

}
