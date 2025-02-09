package com.c203.altteulbe.editor.persistent.entity;

import com.c203.altteulbe.common.dto.BattleType;
import com.c203.altteulbe.common.entity.BaseCreatedAndUpdatedEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Editor extends BaseCreatedAndUpdatedEntity {
	@Id
	private String editorId;

	@Column(columnDefinition = "LONGBLOB") // 이진 데이터 저장
	private byte[] content;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private BattleType type;

	private Long singleRoomId;

	private Long teamRoomId;

	// 에디터가 처음 생성될 때는 content가 비어있는 상태로 만들어짐
	// 개인전이면 팀방 id null, 팀전이면 개인방 id null
	@Builder
	public Editor(BattleType type, Long roomId) {
		if (type == BattleType.S) {
			this.singleRoomId = roomId;
			this.teamRoomId = null;
		} else {
			this.teamRoomId = roomId;
			this.singleRoomId = null;
		}
		this.type = type;
		this.editorId = type.name().toLowerCase() + ":" + roomId; // s:1 -> 개인전 1번 방
	}

	public Long getRoomId() {
		return type == BattleType.S ? singleRoomId : teamRoomId;
	}

	// content 작성 내용 반영을 위한 로직
	public void updateContent(byte[] content) {
		this.content = content;
	}
}


