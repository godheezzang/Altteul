package com.c203.altteulbe.common.response;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;

import com.fasterxml.jackson.annotation.JsonAnyGetter;

import lombok.AllArgsConstructor;
import lombok.Getter;

// page전용 dto

@Getter
@AllArgsConstructor
public class PageResponse<T> {
	private String key;
	private List<T> content;
	private int currentPage;
	private int totalPages;
	private long totalElements;
	private boolean isLast;

	public PageResponse(String key, Page<T> page) {
		this.key = key;
		this.content = page.getContent();
		this.currentPage = page.getNumber();
		this.totalPages = page.getTotalPages();
		this.totalElements = page.getTotalElements();
		this.isLast = page.isLast();

	}

	@JsonAnyGetter
	public Map<String, Object> getResponseData() {
		Map<String, Object> responseData = new HashMap<>();
		responseData.put(key, content);
		responseData.put("currentPage", currentPage);
		responseData.put("totalPages", totalPages);
		responseData.put("totalElements", totalElements);
		responseData.put("isLast", isLast);
		return responseData;
	}

}
