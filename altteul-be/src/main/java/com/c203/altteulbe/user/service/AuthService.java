package com.c203.altteulbe.user.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.c203.altteulbe.aws.service.S3Service;
import com.c203.altteulbe.config.AWSConfig;
import com.c203.altteulbe.ranking.persistent.entity.Tier;
import com.c203.altteulbe.ranking.persistent.entity.TodayRanking;
import com.c203.altteulbe.ranking.persistent.repository.today_ranking.TodayRankingRepository;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
import com.c203.altteulbe.user.service.exception.DuplicateNicknameException;
import com.c203.altteulbe.user.service.exception.DuplicateUsernameException;
import com.c203.altteulbe.user.web.dto.request.RegisterUserRequestDto;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

	private final UserJPARepository userJPARepository;
	private final PasswordEncoder passwordEncoder;
	private final TodayRankingRepository rankingRepository;
	private final S3Service s3Service;
	private final AWSConfig awsConfig;

	// S3에 저장된 기본 이미지 key
	private final String defaultProfileImgKey = "uploads/1739326628591_People.svg";

	public void registerUser(RegisterUserRequestDto request, MultipartFile image) {

		//일치하는 아이디, 닉네임이 존재하는가?
		validateId(request.getUsername());
		validateNickname(request.getNickname());

		String profileImgKey = (image == null || image.isEmpty())
								? defaultProfileImgKey                            // 기본 이미지 objectKey 저장
								: s3Service.uploadFiles(image, "uploads/"); // S3에 업로드 후 objectKey 저장

		User user = User.builder()
			.username(request.getUsername())
			.password(request.getPassword())
			.nickname(request.getNickname())
			.mainLang(request.getMainLang())
			.profileImg(profileImgKey)        // objectKey 저장
			.rankingPoint(0L)
			.provider(User.Provider.LC)
			.userStatus(User.UserStatus.A)
			.tier(new Tier(1L, "BRONZE", 0, 200))
			.build();

		TodayRanking todayRanking = TodayRanking.builder()
			.user(user)
			.tier(user.getTier())
			.rankingPoint(user.getRankingPoint())
			.rankingChange(0L)
			.id(rankingRepository.count()+1)
			.build();

		user.hashPassword(passwordEncoder);
		userJPARepository.save(user);
		rankingRepository.save(todayRanking);
	}

	public void validateId(String username) {
		if (userJPARepository.existsByUsername(username)) {
			throw new DuplicateUsernameException();
		}
	}

	public void validateNickname(String nickname) {
		if (userJPARepository.existsByNickname(nickname)) {
			throw new DuplicateNicknameException();
		}
	}
}
