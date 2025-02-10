package com.c203.altteulbe.game.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.c203.altteulbe.common.exception.BusinessException;
import com.c203.altteulbe.game.persistent.entity.Game;
import com.c203.altteulbe.game.persistent.entity.item.Item;
import com.c203.altteulbe.game.persistent.entity.item.ItemHistory;
import com.c203.altteulbe.game.persistent.repository.game.GameRepository;
import com.c203.altteulbe.game.persistent.repository.item.ItemHistoryRepository;
import com.c203.altteulbe.game.persistent.repository.item.ItemRepository;
import com.c203.altteulbe.game.service.exception.GameNotFoundException;
import com.c203.altteulbe.game.web.dto.item.request.UseItemRequestDto;
import com.c203.altteulbe.game.web.dto.item.response.UseItemResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ItemService {

	private final ItemHistoryRepository itemHistoryRepository;
	private final GameRepository gameRepository;
	private final ItemRepository itemRepository;
	private final ItemWebsocketService itemWebsocketService;

	public void useItem(UseItemRequestDto message, Long id) {
		// 실제 획득한 아이템이고 사용 가능한지 점검
		boolean availability = itemHistoryRepository.existsUnusedItemByGameIdAndTeamIdAndItemId(message.getGameId(), message.getTeamId(), message.getItemId());

		Item item = itemRepository.findById(message.getItemId())
			.orElseThrow(() -> new BusinessException("아이템을 찾을 수 없습니다.", HttpStatus.NOT_FOUND));

		if (availability) {
			// 상대방에게 아이템 사용 전달

			itemWebsocketService.hitItemByOther(
				UseItemResponseDto.builder()
					.itemId(item.getId())
					.itemName(item.getItemName())
					.build()
				, message.getGameId(), message.getTeamId());

			// 내역 저장
			Game game = gameRepository.findById(message.getGameId())
				.orElseThrow(GameNotFoundException::new);

			itemHistoryRepository.save(
				ItemHistory.builder()
					.game(game)
					.teamRoom(message.getTeamId())
					.item(item)
					.type(ItemHistory.Type.U)
					.build()
			);
		} else {
			throw new BusinessException("아이템을 사용할 수 없습니다.", HttpStatus.BAD_REQUEST);
		}
	}
}
