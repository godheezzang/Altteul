package com.c203.altteulbe.game.persistent.repository.side;

import org.springframework.data.jpa.repository.JpaRepository;

import com.c203.altteulbe.game.persistent.entity.side.SideProblem;

public interface SideProblemJPARepository extends JpaRepository<SideProblem, Long>, SideProblemRepository {

}
