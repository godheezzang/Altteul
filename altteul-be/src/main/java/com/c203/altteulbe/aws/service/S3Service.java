package com.c203.altteulbe.aws.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {
	private final S3Client s3Client;
	private final Region awsRegion;

	@Value("${cloud.aws.s3.bucket}")
	private String bucketName;

	/**
	 * S3에 파일 업로드
	 *
	 * @param file MultipartFile 객체
	 * @param folder 업로드할 폴더 경로 (예: "uploads/")
	 * @return 업로드된 파일의 S3 URL
	 */
	public String uploadFile(MultipartFile file, String folder) {
		String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
		String objectKey = folder + fileName;

		try {
			// S3에 파일 업로드
			s3Client.putObject(PutObjectRequest.builder()
					.bucket(bucketName)
					.key(objectKey)
					.contentType(file.getContentType())
					.build(),
				RequestBody.fromBytes(file.getBytes()));

			log.info("파일 업로드 성공: {}", objectKey);
			return getFileUrl(objectKey);  // 업로드된 파일의 URL 반환
		} catch (IOException e) {
			log.error("파일 업로드 실패: {}", e.getMessage());
			throw new RuntimeException("파일 업로드 중 오류 발생", e);
		}
	}

	/**
	 * S3에서 파일 삭제 : https://altteul-792301.s3.ap-northeast-2.amazonaws.com/uploads/1739291820962_pngtree-blue-bird-vector-or-color-illustration-png-image_2013004.jpg
	 *
	 * @param 삭제할 S3 오브젝트 키 (예: "uploads/파일명.jpg")
	 */
	public void deleteFile(String objectKey) {
		try {
			log.info("파일 삭제 요청: {}", objectKey);

			DeleteObjectResponse response = s3Client.deleteObject(DeleteObjectRequest.builder()
				.bucket(bucketName)
				.key(objectKey)
				.build());

			log.info("S3 응답 상태 코드: {}", response.sdkHttpResponse().statusCode());

			if (response.sdkHttpResponse().isSuccessful()) {
				log.info("파일 삭제 성공: {}", objectKey);
			} else {
				log.error("파일 삭제 실패: S3 응답 상태 코드 {}", response.sdkHttpResponse().statusCode());
			}
		} catch (S3Exception e) {
			log.error("파일 삭제 중 오류 발생: {}", e.getMessage(), e);
			throw new RuntimeException("파일 삭제 중 오류 발생", e);
		}
	}

	/**
	 * 업로드된 파일의 S3 URL 가져오기
	 *
	 * @param objectKey S3 오브젝트 키
	 * @return 파일 URL
	 */
	public String getFileUrl(String objectKey) {
		return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, awsRegion.id(), objectKey);
	}
}
