package com.c203.altteulbe.chat.persistent.repository;

import java.util.List;

import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.chat.persistent.entity.ChatMessage;
import com.c203.altteulbe.chat.persistent.entity.QChatMessage;
import com.querydsl.jpa.impl.JPAQueryFactory;

@Repository
public class ChatMessageCustomRepositoryImpl extends QuerydslRepositorySupport implements ChatMessageCustomRepository {
	private final JPAQueryFactory queryFactory;

	public ChatMessageCustomRepositoryImpl(JPAQueryFactory queryFactory) {
		super(ChatMessage.class);
		this.queryFactory = queryFactory;
	}

	@Override
	@Transactional
	public void updateMessageAsRead(List<Long> messageIds) {
		QChatMessage qChatMessage = QChatMessage.chatMessage;

		queryFactory
			.update(qChatMessage)
			.set(qChatMessage.checked, true)
			.where(qChatMessage.chatMessageId.in(messageIds))
			.execute();
	}

	@Override
	public List<ChatMessage> findUnreadMessages(Long chatroomId, Long readerId) {
		QChatMessage qChatMessage = QChatMessage.chatMessage;

		return queryFactory
			.selectFrom(qChatMessage)
			.where(qChatMessage.chatroom.chatroomId.eq(chatroomId)
				.and(qChatMessage.sender.userId.ne(readerId))
				.and(qChatMessage.checked.eq(false)))
			.orderBy(qChatMessage.createdAt.asc())
			.fetch();
	}
}
