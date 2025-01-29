package com.c203.altteulbe.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.c203.altteulbe.common.response.ApiResponse;
import com.c203.altteulbe.common.response.ApiResponseEntity;
import com.c203.altteulbe.common.response.ResponseBody;
import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice(annotations = {RestController.class})
public class GlobalExceptionHandler {

  /**
   * javax.validation.Valid 또는 @Validated binding error가 발생할 경우
   */
  @ExceptionHandler(BindException.class)
  protected ApiResponseEntity<ResponseBody.Failure> handleBindException(BindException e) {
    log.error("handleBindException", e);
    return ApiResponse.error(e.getBindingResult(), HttpStatus.BAD_REQUEST);
  }

  /**
   * 주로 @RequestParam enum으로 binding 못했을 경우 발생
   */
  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  protected ApiResponseEntity<ResponseBody.Failure> handleMethodArgumentTypeMismatchException(
      MethodArgumentTypeMismatchException e) {
    log.error("handleMethodArgumentTypeMismatchException", e);
    return ApiResponse.error(e.getMessage(), HttpStatus.BAD_REQUEST);
  }

  /**
   * 지원하지 않은 HTTP method 호출 할 경우 발생
   */
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  protected ApiResponseEntity<ResponseBody.Failure> handleHttpRequestMethodNotSupportedException(
      HttpRequestMethodNotSupportedException e) {
    log.error("handleHttpRequestMethodNotSupportedException", e);
    return ApiResponse.error(e.getMessage(), HttpStatus.METHOD_NOT_ALLOWED);
  }

  /**
   * Redis 같은 경우 Json 변환을 할 가능성이 높기 때문에 추가
   */
  @ExceptionHandler(JsonProcessingException.class)
  protected ApiResponseEntity<ResponseBody.Failure> JsonProcessingException(
      JsonProcessingException e) {
    log.error("JsonProcessingException", e);
    return ApiResponse.error(e.getMessage(), HttpStatus.BAD_REQUEST);
  }

  /**
   * 비즈니스 로직 실행 중 오류 발생
   */
  @ExceptionHandler(value = {BusinessException.class})
  protected ApiResponseEntity<ResponseBody.Failure> handleConflict(BusinessException e) {
    log.error("BusinessException", e);
    return ApiResponse.error(e.getMessage(), e.getHttpStatus());
  }

  /**
   * 나머지 예외 발생
   */
  @ExceptionHandler(Exception.class)
  protected ApiResponseEntity<ResponseBody.Failure> handleException(Exception e) {
    log.error("Exception", e);
    return ApiResponse.error(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}