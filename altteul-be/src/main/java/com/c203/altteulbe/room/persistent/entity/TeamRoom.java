package com.c203.altteulbe.room.persistent.entity;

import java.util.ArrayList;
import java.util.List;

import com.c203.altteulbe.game.persistent.entity.item.ItemHistory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class TeamRoom extends Room {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "team_room_id", nullable = false, updatable = false)
	private Long id;

	@OneToMany(mappedBy = "teamRoom")
	private List<UserTeamRoom> userTeamRooms = new ArrayList<>();

	@OneToMany(mappedBy = "teamRoom")
	private List<ItemHistory> itemHistories = new ArrayList<>();
}
