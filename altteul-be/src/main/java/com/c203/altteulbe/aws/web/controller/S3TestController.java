package com.c203.altteulbe.aws.web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.c203.altteulbe.aws.service.S3Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/s3")
@RequiredArgsConstructor
public class S3TestController {
	private final S3Service s3Service;

	@PostMapping("/upload")
	public ResponseEntity<String> uploadFile(MultipartFile file) {
		String fileUrl = s3Service.uploadFile(file, "uploads/");
		return ResponseEntity.ok(fileUrl);
	}


	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteFile(@RequestParam("key") String objectKey) {
		s3Service.deleteFile(objectKey);
		return ResponseEntity.ok("파일 삭제 성공: " + objectKey);
	}
}
