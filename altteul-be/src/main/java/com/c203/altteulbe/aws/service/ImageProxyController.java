package com.c203.altteulbe.aws.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.c203.altteulbe.config.AWSConfig;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/img")
public class ImageProxyController {
	private final AWSConfig awsConfig;

	@GetMapping("/{imageKey}")
	public ResponseEntity<String> getImage(@PathVariable String imageKey) {
		try {
			// 실제 S3 URL 생성
			String s3Url = awsConfig.getS3BaseUrl() + "uploads/" + imageKey;

			return ResponseEntity.ok(s3Url);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found");
		}
	}
}
