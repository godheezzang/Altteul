// hooks/useIde.ts
import { useState, useRef, useEffect } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Client } from "@stomp/stompjs";
import useGameStore from "@stores/useGameStore";
import axios from "axios";
import { mockGameData } from "mocks/gameData";
import * as monaco from "monaco-editor";

const SOCKET_URL = import.meta.env.NODE_ENV === 'prod'
  ? import.meta.env.VITE_SOCKET_URL_PROD
  : import.meta.env.VITE_SOCKET_URL_DEV;

export interface Cursor {
	line: number;
	ch: number;
}

type TestCase = {
	testCaseId: number;
	testCaseNumber: number;
	status: string;
	output: string | null;
	answer: string;
};

interface ExecutionResponse {
	isNotCompileError: boolean;
	testCases?: TestCase[];
	message?: string;
}

export const useIde = (isTeamMode: boolean) => {
	const { setProblem, setTestcases, problem } = useGameStore();
	const [code, setCode] = useState("");
	const [language, setLanguage] = useState<"python" | "java">("python");
	const [output, setOutput] = useState("");
	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
	const ydocRef = useRef(new Y.Doc());
	const providerRef = useRef<WebsocketProvider | null>(null);
	const stompClientRef = useRef<Client | null>(null);
	const [partnerCode, setPartnerCode] = useState("");
	const [teamMembers, setTeamMembers] = useState<string[]>([]);
	const [opponentMembers, setOpponentMembers] = useState<string[]>([]);

	useEffect(() => {
		const { problem, testcases } = mockGameData.data;
		setProblem(problem);
		setTestcases(testcases);

		const editorId = `${isTeamMode ? "t" : "s"}:${problem.problemId}`;
		const ydoc = ydocRef.current;
		const ytext = ydoc.getText("codemirror");

		const stompClient = new Client({
			brokerURL: SOCKET_URL,
			connectHeaders: {},
			debug: (str) => {
				console.log(str);
			},
		});

		stompClient.onConnect = () => {
			console.log("Connected to WebSocket");

			stompClient.subscribe(`/sub/editor/${editorId}/init`, (message) => {
				const response = JSON.parse(message.body);
				if (response.type === "INIT") {
					setCode(response.data.content);
					ytext.insert(0, response.data.content);
				}
			});

			stompClient.subscribe(`/sub/editor/${editorId}`, (message) => {
				const response = JSON.parse(message.body);
				if (response.type === "UPDATE") {
					Y.applyUpdate(ydoc, new Uint8Array(response.data.content));
				}
			});

			stompClient.subscribe(`/sub/editor/${editorId}/awareness`, (message) => {
				const response = JSON.parse(message.body);
				if (response.type === "AWARENESS") {
					// Awareness 정보 처리
				}
			});

			stompClient.subscribe(`/sub/editor/${editorId}/partner`, (message) => {
				const response = JSON.parse(message.body);
				if (response.type === "PARTNER_UPDATE") {
					setPartnerCode(response.data.content);
				}
			});

			stompClient.subscribe(`/sub/game/${isTeamMode ? "team" : "single"}/members`, (message) => {
				const response = JSON.parse(message.body);
				setTeamMembers(response.teamMembers);
				setOpponentMembers(response.opponentMembers);
			});

			stompClient.publish({
				destination: `/pub/editor/${editorId}/join`,
				body: JSON.stringify({ editorId }),
			});
		};

		stompClient.activate();
		stompClientRef.current = stompClient;

		const provider = new WebsocketProvider(SOCKET_URL, editorId, ydoc);
		providerRef.current = provider;

		return () => {
			if (stompClient.active) {
				stompClient.deactivate();
			}
			if (provider) {
				provider.destroy();
			}
		};
	}, [setProblem, setTestcases, problem.problemId, isTeamMode]);

	const handleCodeExecution = async () => {
		try {
			const response = await axios.post<ExecutionResponse>("/api/judge/execution", {
				gameId: 1,
				teamId: isTeamMode ? 2 : undefined,
				problemId: problem.problemId,
				lang: language === "python" ? "PY" : "JV",
				code: code,
			});

			if (response.data.isNotCompileError) {
				let output = "";
				response.data.testCases?.forEach((testCase: TestCase) => {
					output += `테스트케이스 ${testCase.testCaseNumber}: \n`;
					let statusMessage = "";
					switch (testCase.status) {
						case "F":
							statusMessage = "실패 (Fail)";
							break;
						case "P":
							statusMessage = "통과 (Pass)";
							break;
						case "RUN":
							statusMessage = "런타임 에러 (Runtime Error)";
							break;
						case "TLE":
							statusMessage = "시간 초과 (Time limit exceed)";
							break;
						default:
							statusMessage = "알 수 없는 상태";
					}
					output += `결과: ${statusMessage} \n`;
					output += `출력: ${testCase.output}\n`;
					output += `정답: ${testCase.answer}\n\n`;
				});
				setOutput(output);
			} else {
				setOutput(`컴파일 에러(Compile Error): ${response.data.message}`);
			}
		} catch (error) {
			console.error(error);
			if (axios.isAxiosError(error)) {
				setOutput(`네트워크 오류: ${error.message}`);
			} else {
				setOutput("알 수 없는 오류가 발생했습니다.");
			}
		}
	};

	const handleCodeChange = (newCode: string) => {
		setCode(newCode);
		const ytext = ydocRef.current.getText("codemirror");
		ytext.delete(0, ytext.length);
		ytext.insert(0, newCode);

		if (stompClientRef.current?.active) {
			stompClientRef.current.publish({
				destination: `/pub/editor/${isTeamMode ? "t" : "s"}:${problem.problemId}/update`,
				body: JSON.stringify({
					editorId: `${isTeamMode ? "t" : "s"}:${problem.problemId}`,
					content: Y.encodeStateAsUpdate(ydocRef.current),
				}),
			});
		}
	};

	const handleCursorChange = (cursor: Cursor) => {
		if (stompClientRef.current?.active) {
			stompClientRef.current.publish({
				destination: `/pub/editor/${isTeamMode ? "t" : "s"}:${problem.problemId}/awareness`,
				body: JSON.stringify({
					editorId: `${isTeamMode ? "t" : "s"}:${problem.problemId}`,
					awareness: JSON.stringify(cursor),
				}),
			});
		}
	};

	return {
		code,
		setCode: handleCodeChange,
		partnerCode,
		language,
		setLanguage,
		output,
		editorRef,
		handleCodeExecution,
		handleCursorChange,
		teamMembers,
		opponentMembers,
		isTeamMode,
	};
};
