package com.c203.altteulbe.common.response;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;

import com.fasterxml.jackson.annotation.JsonAnyGetter;

import lombok.AllArgsConstructor;
import lombok.Getter;

// page전용 dto

@Getter
@AllArgsConstructor
public class PageResponse<T> {
	private final Map<String, Object> responseData = new HashMap<>();

	public PageResponse(String key, Page<T> page) {
		responseData.put(key, page.getContent());
		responseData.put("currentPage", page.getNumber());
		responseData.put("totalPages", page.getTotalPages());
		responseData.put("totalElements", page.getTotalElements());
		responseData.put("isLast", page.isLast());
	}

	@JsonAnyGetter
	public Map<String, Object> getResponseData() {
		return responseData;
	}
}
