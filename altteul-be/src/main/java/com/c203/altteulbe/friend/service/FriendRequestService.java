package com.c203.altteulbe.friend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.dto.RequestStatus;
import com.c203.altteulbe.common.exception.BusinessException;
import com.c203.altteulbe.common.utils.RedisUtils;
import com.c203.altteulbe.friend.persistent.entity.FriendRequest;
import com.c203.altteulbe.friend.persistent.entity.Friendship;
import com.c203.altteulbe.friend.persistent.repository.FriendRequestRepository;
import com.c203.altteulbe.friend.persistent.repository.FriendshipRepository;
import com.c203.altteulbe.friend.web.dto.response.FriendRequestResponseDto;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
import com.c203.altteulbe.user.service.exception.NotFoundUserException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FriendRequestService {
	private final FriendRequestRepository friendRequestRepository;
	private final UserJPARepository userJPARepository;
	private final FriendshipRepository friendshipRepository;
	private final RedisUtils redisUtils;

	private static final String FRIEND_REQUEST_CACHE = "friendRequests";

	// 친구 요청 목록 조회
	@Cacheable(value = FRIEND_REQUEST_CACHE, key = "#userId")
	@Transactional
	public Page<FriendRequestResponseDto> getPendingRequestsFromRedis(Long userId, int page, int size) {
		userJPARepository.findByUserId(userId).orElseThrow(() -> {
			log.error("유저 찾기 실패");
			return new NotFoundUserException();
		});
		List<FriendRequestResponseDto> allRequest = getPendingFriendRequestsFromDB(userId);
		return paginate(allRequest, page, size);
	}

	// db에서 친구 요청 목록 가져오기
	private List<FriendRequestResponseDto> getPendingFriendRequestsFromDB(Long userId) {
		return friendRequestRepository.findAllByToUserIdAndRequestStatus(
				userId,
				RequestStatus.P)
			.stream()
			.map(FriendRequestResponseDto::from)
			.collect(Collectors.toList());
	}

	// 가져온 목록을 페이지네이션하기
	private Page<FriendRequestResponseDto> paginate(List<FriendRequestResponseDto> allRequests, int page, int size) {
		int total = allRequests.size();
		int start = Math.min(page * size, total);
		int end = Math.min((page + 1) * size, total);

		return new PageImpl<>(
			allRequests.subList(start, end),
			PageRequest.of(page, size),
			total
		);
	}

	// 친구 신청 생성
	@Transactional
	public FriendRequestResponseDto createFriendRequest(Long fromUserId, Long toUserId) {
		User fromUser = userJPARepository.findById(fromUserId).orElseThrow(NotFoundUserException::new);
		User toUser = userJPARepository.findById(toUserId).orElseThrow(NotFoundUserException::new);
		validateFriendRequest(fromUser, toUser);
		FriendRequest friendRequest = FriendRequest.builder()
			.from(fromUser)
			.to(toUser)
			.build();
		return FriendRequestResponseDto.from(friendRequestRepository.save(friendRequest));
	}

	// 요청 처리
	@Transactional
	@CacheEvict(value = FRIEND_REQUEST_CACHE, key = "#userId + ':*'")
	public void processRequest(Long requestId, Long userId, RequestStatus status) {
		// 요청 조회 및 검증
		FriendRequest request = friendRequestRepository.findById(requestId)
			.orElseThrow(() -> {
				log.error("친구 신청 찾기 실패");
				return new BusinessException("친구 신청을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
			});

		// 수신자 본인 확인
		if (!request.getTo().getUserId().equals(userId)) {
			log.error("권한 없음");
			throw new BusinessException("권한이 없습니다.", HttpStatus.FORBIDDEN);
		}

		// 이미 처리된 요청인지 확인
		if (request.getRequestStatus() != RequestStatus.P) {
			log.error("이미 처리된 친구 신청");
			throw new BusinessException("이미 처리된 친구 신청입니다.", HttpStatus.BAD_REQUEST);
		}

		// 상태 업데이트
		request.updateStatus(status);
		friendRequestRepository.save(request);

		// 수락된 경우 친구 관계 생성
		if (status == RequestStatus.A) {

			validateFriendRequest(request.getFrom(), request.getTo());

			Friendship friendshipFromTo = Friendship.createFriendship(
				request.getFrom(),
				request.getTo()
			);

			Friendship friendshipToFrom = Friendship.createFriendship(
				request.getTo(),
				request.getFrom()
			);
			friendshipRepository.saveAll(
				List.of(friendshipFromTo, friendshipToFrom)
			);

			redisUtils.setFriendRelation(
				request.getFrom().getUserId(),
				request.getTo().getUserId()
			);
		}
	}

	// 친구 요청 검증
	private void validateFriendRequest(User fromUser, User toUser) {
		if (fromUser.getUserId().equals(toUser.getUserId())) {
			throw new BusinessException("자기 자신에게 친구 신청할 수 없습니다.", HttpStatus.BAD_REQUEST);
		}

		// redis에서 친구인지 확인
		if (redisUtils.checkFriendRelation(fromUser.getUserId(), toUser.getUserId())) {
			throw new BusinessException("이미 친구입니다.", HttpStatus.BAD_REQUEST);
		}

		// redis에 없는 경우 db 확인
		if (friendshipRepository.existsByUserAndFriend(fromUser.getUserId(), toUser.getUserId())) {
			// db에 있다면 redis에 캐싱
			redisUtils.setFriendRelation(fromUser.getUserId(), toUser.getUserId());
			throw new BusinessException("이미 친구 입니다.", HttpStatus.BAD_REQUEST);
		}

		if (friendRequestRepository.existsByFromUserIdAndToUserIdAndRequestStatus(
			fromUser.getUserId(), toUser.getUserId(), RequestStatus.P)) {
			throw new BusinessException("이미 보류 중인 친구 신청이 있습니다.", HttpStatus.BAD_REQUEST);
		}

		if (toUser.getUserStatus() == User.UserStatus.D) {
			throw new BusinessException("탈퇴한 사용자입니다.", HttpStatus.BAD_REQUEST);
		}

		if (toUser.getUserStatus() == User.UserStatus.S) {
			throw new BusinessException("정지된 사용자입니다.", HttpStatus.BAD_REQUEST);
		}
	}
}


