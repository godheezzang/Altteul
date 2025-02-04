package com.c203.altteulbe.common.response;

import java.util.List;

import org.springframework.data.domain.Page;

import lombok.AllArgsConstructor;
import lombok.Getter;

// page전용 dto

@Getter
@AllArgsConstructor
public class PageResponse<T> {
	private List<T> key;
	private int currentPage;
	private int totalPages;
	private long totalElements;
	private boolean isLast;

	public PageResponse(String key, Page<T> page) {
		this.key = page.getContent();
		this.currentPage = page.getNumber();
		this.totalPages = page.getTotalPages();
		this.totalElements = page.getTotalElements();
		this.isLast = page.isLast();

	}

}
