package com.c203.altteulbe.ranking.service;

import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.c203.altteulbe.common.response.PageResponse;
import com.c203.altteulbe.ranking.web.response.RankingListResponseDto;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
import com.c203.altteulbe.user.service.exception.NotFoundUserException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class RankingService {

	private final UserJPARepository userJPARepository;

	/*public PageResponse<RankingListResponseDto> getRankingList(Pageable pageable) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// 비로그인 사용자
		if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
			log.info("비로그인한 유저의 랭킹 페이지 조회");

		// 로그인 사용자
		} else {
			Long userId = (Long) authentication.getPrincipal();
			User user = userJPARepository.findByUserId(userId).orElseThrow(()->new NotFoundUserException());
			log.info("로그인한 유저의 랭킹 페이지 조회");

		}

	}*/

}
