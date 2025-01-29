package com.c203.altteulbe.friend.persistent.entity;

import org.springframework.data.domain.Persistable;

import com.c203.altteulbe.common.entity.BaseCreatedEntity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Friend extends BaseCreatedEntity implements Persistable<FriendId> {
	@EmbeddedId
	private FriendId id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	@MapsId("userId")
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "friend_id")
	@MapsId("friendId")
	private User friend;

	@Override
	public FriendId getId() {
		return id;
	}

	@Override
	public boolean isNew() {
		return getCreatedAt() == null;
	}

	@Builder
	public Friend(User user, User friend) {
		this.id = new FriendId(user.getId(), friend.getId());
		this.user = user;
		this.friend = friend;
	}

}
