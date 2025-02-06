package com.c203.altteulbe.user.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
import com.c203.altteulbe.user.persistent.repository.UserRepository;
import com.c203.altteulbe.user.service.exception.DuplicateNicknameException;
import com.c203.altteulbe.user.service.exception.DuplicateUsernameException;
import com.c203.altteulbe.user.web.dto.request.RegisterUserRequestDto;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

	private final UserJPARepository userJPARepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public void registerUser(RegisterUserRequestDto request, MultipartFile image) {

		//일치하는 아이디, 닉네임이 존재하는가?
		validateId(request.getUsername());

		validateNickname(request.getNickname());

		User user = User.builder()
						.username(request.getUsername())
						.password(request.getPassword())
						.nickname(request.getNickname())
						.mainLang(request.getMainLang())
						.profileImg("")
						.rankingPoint(0L)
						.provider(User.Provider.LC)
						.userStatus(User.UserStatus.A)
					.build();

		user.hashPassword(passwordEncoder);
		userJPARepository.save(user);
	}

	public void validateId(String username) {
		if (userRepository.existsByUsername(username)) {
			throw new DuplicateUsernameException();
		};
	}

	public void validateNickname(String nickname) {
		if (userRepository.existsByNickname(nickname)) {
			throw new DuplicateNicknameException();
		};
	}
}
