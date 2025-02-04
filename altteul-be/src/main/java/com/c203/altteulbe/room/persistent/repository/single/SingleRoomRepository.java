package com.c203.altteulbe.room.persistent.repository.single;

import org.springframework.data.jpa.repository.JpaRepository;

import com.c203.altteulbe.room.persistent.entity.SingleRoom;

public interface SingleRoomRepository extends JpaRepository<SingleRoom, Long>, SingleRoomRepositoryCustom {
}
