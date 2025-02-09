package com.c203.altteulbe.editor.persistent.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.c203.altteulbe.editor.persistent.entity.Editor;

public interface EditorRepository extends JpaRepository<Editor, String>, EditorCustomRepository {
}
