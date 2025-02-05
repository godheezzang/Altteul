package com.c203.altteulbe.chat.web.dto.response;

import java.time.LocalDateTime;

import com.c203.altteulbe.chat.persistent.entity.ChatMessage;
import com.c203.altteulbe.common.dto.MessageType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponseDto {
	private MessageType type;
	private Long chatMessageId;
	private Long senderId;
	private String messageContent;
	private boolean checked;
	private LocalDateTime createdAt;

	// Entity -> Dto
	public static ChatMessageResponseDto from(ChatMessage chatMessage) {
		return ChatMessageResponseDto.builder()
			.type(MessageType.SEND)
			.chatMessageId(chatMessage.getChatMessageId())
			.senderId(chatMessage.getSender().getUserId())
			.messageContent(chatMessage.getMessageContent())
			.checked(chatMessage.isChecked())
			.createdAt(chatMessage.getCreatedAt())
			.build();
	}
}
