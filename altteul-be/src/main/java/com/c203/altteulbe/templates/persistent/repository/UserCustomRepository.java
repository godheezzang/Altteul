package com.c203.altteulbe.templates.persistent.repository;

import com.c203.altteulbe.templates.persistent.entity.UserJPA;

public interface UserCustomRepository {
	UserJPA findById(Long id);
}