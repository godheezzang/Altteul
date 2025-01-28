package com.c203.altteulbe.templates.persistent.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.c203.altteulbe.templates.persistent.entity.GameEntity;
import com.c203.altteulbe.templates.persistent.entity.GameStatus;

@Repository
public interface GameRepository extends CrudRepository<GameEntity, String> {
	// CrudRepository에서 기본적인 CRUD 메서드 제공

	// 추가 쿼리 메서드
	List<GameEntity> findByGameType(String gameType);
	List<GameEntity> findByStatus(GameStatus status);
}
