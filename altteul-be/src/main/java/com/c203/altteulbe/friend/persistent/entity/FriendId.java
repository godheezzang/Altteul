package com.c203.altteulbe.friend.persistent.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FriendId implements Serializable {
	@Column(name = "user_id")
	private int userId;

	@Column(name = "friend_id")
	private int friendId;
}
