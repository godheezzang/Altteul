// package com.c203.altteulbe.ranking.service;
//
// import java.util.Optional;
//
// import org.springframework.context.ApplicationEventPublisher;
// import org.springframework.data.domain.Pageable;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.parameters.P;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
//
// import com.c203.altteulbe.common.dto.BattleType;
// import com.c203.altteulbe.common.dto.PointType;
// import com.c203.altteulbe.common.response.PageResponse;
// import com.c203.altteulbe.game.persistent.entity.Game;
// import com.c203.altteulbe.game.persistent.entity.PointHistory;
// import com.c203.altteulbe.game.persistent.entity.Problem;
// import com.c203.altteulbe.game.persistent.entity.side.SideProblem;
// import com.c203.altteulbe.game.persistent.repository.game.GameJPARepository;
// import com.c203.altteulbe.game.persistent.repository.history.PointHistoryRepository;
// import com.c203.altteulbe.game.persistent.repository.problem.ProblemRepository;
// import com.c203.altteulbe.game.persistent.repository.side.SideProblemJPARepository;
// import com.c203.altteulbe.game.service.PointHistorySavedEvent;
// import com.c203.altteulbe.ranking.web.response.RankingListResponseDto;
// import com.c203.altteulbe.user.persistent.entity.User;
// import com.c203.altteulbe.user.persistent.repository.UserJPARepository;
// import com.c203.altteulbe.user.service.exception.NotFoundUserException;
//
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
//
// @Service
// @RequiredArgsConstructor
// @Slf4j
// public class RankingService {
//
// 	private final UserJPARepository userJPARepository;
//
// 	public PageResponse<RankingListResponseDto> getRankingList(Pageable pageable) {
// 		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//
// 		// 비로그인 사용자
// 		if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
// 			log.info("비로그인한 유저의 랭킹 페이지 조회");
//
// 		// 로그인 사용자
// 		} else {
// 			Long userId = (Long) authentication.getPrincipal();
// 			User user = userJPARepository.findByUserId(userId).orElseThrow(()->new NotFoundUserException());
// 			log.info("로그인한 유저의 랭킹 페이지 조회");
//
// 		}
// 	}
//
// }
