package com.c203.altteulbe.common.security.service;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.dto.Language;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
import com.c203.altteulbe.user.persistent.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class Default0Auth2UserServiceImpl extends DefaultOAuth2UserService {
	private final UserJPARepository userJPARepository;
	private final UserRepository userRepository;
	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) {
		OAuth2User oAuth2User = super.loadUser(userRequest);
		Map<String, Object> attributes = oAuth2User.getAttributes();


		// GitHub에서 사용자 정보 추출
		String username = attributes.get("id").toString();
		String nickname = attributes.get("login").toString();

		return userRepository.findByProviderAndUsername(User.Provider.GH, username)
			.orElseGet(() -> {
				// 신규 사용자 생성
				User newUser = User.builder()
					.username(username)
					.nickname(nickname)
					.provider(User.Provider.GH)
					.mainLang(Language.PY)
					.profileImg("기본 이미지 URL")
					.build();
				userJPARepository.save(newUser);
				return newUser;
			});
	}
}