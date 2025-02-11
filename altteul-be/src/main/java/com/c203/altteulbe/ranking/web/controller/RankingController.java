// package com.c203.altteulbe.ranking.web.controller;
//
// import java.awt.print.Pageable;
//
// import org.springframework.data.web.PageableDefault;
// import org.springframework.http.HttpStatus;
// import org.springframework.stereotype.Controller;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
//
// import com.c203.altteulbe.common.response.ApiResponse;
// import com.c203.altteulbe.common.response.ApiResponseEntity;
// import com.c203.altteulbe.common.response.PageResponse;
// import com.c203.altteulbe.common.response.ResponseBody;
// import com.c203.altteulbe.ranking.service.RankingService;
// import com.c203.altteulbe.ranking.web.response.RankingListResponseDto;
//
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
//
// @RestController
// @RequiredArgsConstructor
// @RequestMapping("/api/ranking")
// @Slf4j
// public class RankingController {
// 	private final RankingService rankingService;
//
// 	@GetMapping
// 	public ApiResponseEntity<ResponseBody.Success<PageResponse<RankingListResponseDto>>> getRankingList(
// 		@PageableDefault(page = 0, size = 10) Pageable pageable
// 	) {
// 		PageResponse<RankingListResponseDto> rankingList = rankingService.getRankingList(pageable);
// 		return ApiResponse.success(rankingList, HttpStatus.OK);
// 	}
// }
