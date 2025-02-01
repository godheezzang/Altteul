package com.c203.altteulbe.game.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.c203.altteulbe.game.persistent.entity.SingleRoom;

public interface SingleRoomRepository extends JpaRepository<SingleRoom, Long> {
}
