package com.c203.altteulbe.templates.persistent.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.c203.altteulbe.templates.persistent.entity.PlayerEntity;

@Repository
public interface PlayerRepository extends CrudRepository<PlayerEntity, String> {
	List<PlayerEntity> findByStatus(String status);
}