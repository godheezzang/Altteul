package com.c203.altteulbe.chat.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.chat.persistent.entity.ChatMessage;
import com.c203.altteulbe.chat.persistent.entity.Chatroom;
import com.c203.altteulbe.chat.persistent.repository.ChatMessageRepository;
import com.c203.altteulbe.chat.persistent.repository.ChatroomRepository;
import com.c203.altteulbe.chat.persistent.repository.UserChatRoomRepository;
import com.c203.altteulbe.chat.web.dto.request.ChatMessageRequestDto;
import com.c203.altteulbe.chat.web.dto.response.ChatMessageReadResponseDto;
import com.c203.altteulbe.chat.web.dto.response.ChatMessageResponseDto;
import com.c203.altteulbe.common.dto.MessageType;
import com.c203.altteulbe.common.exception.BusinessException;
import com.c203.altteulbe.user.persistent.entity.User;
import com.c203.altteulbe.user.persistent.repository.UserRepository;
import com.c203.altteulbe.user.service.exception.NotFoundUserException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
	private final ChatroomRepository chatroomRepository;
	private final UserRepository userRepository;
	private final ChatMessageRepository chatMessageRepository;
	private final UserChatRoomRepository userChatRoomRepository;

	@Transactional
	public ChatMessageReadResponseDto markMessageAsRead(Long chatroomId, Long userId) {

		List<ChatMessage> unreadMessages = chatMessageRepository.findUnreadMessages(chatroomId, userId);

		if (unreadMessages.isEmpty()) {
			return null;
		}

		List<Long> messageIds = unreadMessages.stream()
				.map(ChatMessage::getChatMessageId)
					.toList();
		Long senderId = unreadMessages.get(0).getSender().getUserId();

		chatMessageRepository.updateMessageAsRead(messageIds);

		return ChatMessageReadResponseDto.builder()
			.type(MessageType.READ)
			.chatroomId(chatroomId)
			.readerId(userId)
			.senderId(senderId)
			.readAt(LocalDateTime.now())
			.messageIds(messageIds)
			.build();
	}

	@Transactional
	public ChatMessageResponseDto saveMessage(Long chatroomId, ChatMessageRequestDto requestDto) {
		validateMessageContent(requestDto.getContent());
		Chatroom chatroom = chatroomRepository.findById(chatroomId).orElseThrow(() ->
			new BusinessException("채팅방이 없습니다.", HttpStatus.NOT_FOUND));
		User sender = userRepository.findByUserId(requestDto.getSenderId())
			.orElseThrow(NotFoundUserException::new);

		validateChatroomParticipant(chatroomId, sender.getUserId());
		ChatMessage chatMessage = ChatMessageRequestDto.to(requestDto, chatroom, sender);

		ChatMessage savedMessage = chatMessageRepository.save(chatMessage);

		return ChatMessageResponseDto.from(savedMessage);
	}

	private void validateMessageContent(String content) {
		if (content == null || content.trim().isEmpty()) {
			throw new BusinessException("메시지 내용은 필수입니다.", HttpStatus.BAD_REQUEST);
		}
	}
	private void validateChatroomParticipant(Long chatroomId, Long userId) {
		boolean isParticipant = userChatRoomRepository.existsByChatroom_ChatroomIdAndUser_UserId(chatroomId, userId);
		if (!isParticipant) {
			throw new BusinessException("채팅방 참여자가 아닙니다.", HttpStatus.FORBIDDEN);
		}
	}
}
