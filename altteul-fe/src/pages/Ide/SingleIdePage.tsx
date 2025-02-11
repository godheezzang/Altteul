import { IdeLayout } from '@components/Ide/IdeLayout';
import { useIde } from '@hooks/useIde';

// 게임 시작 후 소켓 연결
// 사이드 문제 출제, 제출
// 코드 실행: api
// 코드 제출: socket
// 코드 정답 맞춤 -> 합격 여부, 맞은 개수, 전체 tc 개수, 실행 시간, 메모리
// 실패 -> 그대로 다시 문제 풀기

// 코드 결과창
// AI 코칭 외 다른 버튼 클릭 시 구독 끊고 페이지 이동

// TODO: 팀전과 개인전 페이지 분리 필요
const SingleIdePage = () => {
  return <IdeLayout {...useIde(false)} />;
};

export default SingleIdePage;
