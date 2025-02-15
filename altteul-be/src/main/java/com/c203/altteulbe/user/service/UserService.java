package com.c203.altteulbe.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.c203.altteulbe.aws.service.S3Service;
import com.c203.altteulbe.aws.util.S3Util;
import com.c203.altteulbe.friend.service.UserStatusService;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserRepository;
import com.c203.altteulbe.user.service.exception.NotFoundUserException;
import com.c203.altteulbe.user.service.exception.SelfSearchException;
import com.c203.altteulbe.user.web.dto.request.UpdateProfileRequestDto;
import com.c203.altteulbe.user.web.dto.response.SearchUserResponseDto;
import com.c203.altteulbe.user.web.dto.response.UserProfileResponseDto;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
	private final S3Service s3Service;
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

	public void updateUserProfile(UpdateProfileRequestDto request, MultipartFile newImg, Long currentUserId) {
		String defaultProfileImgKey = S3Util.getDefaultImgKey();
		User user = userRepository.findById(currentUserId).orElseThrow(NotFoundUserException::new);
		user.updateProfile(request.getNickname(), request.getMainLang());

		String currentProfileImg = user.getProfileImg();

		if (newImg != null && !newImg.isEmpty()) {
			// S3에 새 이미지 업로드
			String newProfileImgKey = s3Service.uploadFiles(newImg, "uploads/");

			// 기존 이미지가 기본 이미지가 아니면 S3에서 삭제
			if (!defaultProfileImgKey.equals(currentProfileImg)) {
				s3Service.deleteFile(currentProfileImg);
			}
			// 새로운 프로필 이미지 저장
			user.updateProfileImage(newProfileImgKey);
		}
	}
}
