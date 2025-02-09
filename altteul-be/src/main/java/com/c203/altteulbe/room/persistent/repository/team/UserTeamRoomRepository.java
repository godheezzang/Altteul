package com.c203.altteulbe.room.persistent.repository.team;

import org.springframework.data.jpa.repository.JpaRepository;

import com.c203.altteulbe.room.persistent.entity.UserTeamRoom;
import com.c203.altteulbe.room.persistent.entity.UserTeamRoomId;

public interface UserTeamRoomRepository extends JpaRepository<UserTeamRoom, UserTeamRoomId> {
}
