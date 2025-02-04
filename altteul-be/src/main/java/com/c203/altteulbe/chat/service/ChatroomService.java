package com.c203.altteulbe.chat.service;

import org.springframework.stereotype.Service;

import com.c203.altteulbe.chat.persistent.repository.ChatroomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatroomService {
	private final ChatroomRepository chatroomRepository;

}
