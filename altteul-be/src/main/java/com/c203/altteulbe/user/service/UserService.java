package com.c203.altteulbe.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.c203.altteulbe.friend.service.UserStatusService;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserRepository;
import com.c203.altteulbe.user.service.exception.NotFoundUserException;
import com.c203.altteulbe.user.service.exception.SelfSearchException;
import com.c203.altteulbe.user.web.dto.request.UpdateProfileRequestDto;
import com.c203.altteulbe.user.web.dto.response.SearchUserResponseDto;
import com.c203.altteulbe.user.web.dto.response.UserProfileResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
	private final UserRepository userRepository;
	private final UserStatusService userStatusService;

	public SearchUserResponseDto searchUser(Long userId, String nickname) {
		User user = userRepository.findByNickname(nickname).orElseThrow(NotFoundUserException::new);

		if (userId.equals(user.getUserId())) {
			throw new SelfSearchException();
		}
		Boolean isOnline = userStatusService.isUserOnline(userId);
		return SearchUserResponseDto.from(user, isOnline);
	}

	public UserProfileResponseDto getUserProfile(Long userId, Long currentUserId) {
		User user = userRepository.findWithRankingByUserId(userId)
			.orElseThrow(NotFoundUserException::new);


		Long totalCount = userRepository.count();
		return UserProfileResponseDto.from(user, totalCount, currentUserId);
	}

	public void updateUserProfile(UpdateProfileRequestDto request, MultipartFile image, Long currentUserId) {
		User user = userRepository.findById(currentUserId).orElseThrow(NotFoundUserException::new);
		user.updateProfile(request.getNickname(), request.getMainLang());
		// 이미지 로직 넣어주기
	}
}
