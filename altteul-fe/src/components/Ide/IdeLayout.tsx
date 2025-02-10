// components/Ide/IdeLayout.tsx
import { MutableRefObject } from "react";
import CodeEditor from "@components/Ide/CodeEditor";
import GameUserList from "@components/Ide/GameUserList";
import IdeFooter from "@components/Ide/IdeFooter";
import ProblemInfo from "@components/Ide/ProblemInfo";
import Terminal from "@components/Ide/Terminal";
import * as monaco from "monaco-editor";
import { Cursor } from "@hooks/useIde";

interface IdeLayoutProps {
	code: string;
	setCode: (code: string) => void;
	partnerCode: string;
	language: "python" | "java";
	setLanguage: (lang: "python" | "java") => void;
	output: string;
	editorRef: MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
	handleCodeExecution: () => void;
	handleCursorChange: (cursor: Cursor) => void;
	teamMembers: string[];
	opponentMembers: string[];
	isTeamMode: boolean;
}

export const IdeLayout = ({
	code,
	setCode,
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
}: IdeLayoutProps) => {
	return (
		<div className="flex h-screen bg-primary-black border-t border-gray-04">
			<div className="min-w-[23rem] border-r border-gray-04">
				<ProblemInfo />
			</div>
			<div className="flex-1 flex">
				<div className={`flex flex-col ${isTeamMode ? "w-1/2" : "w-full"}`}>
					<CodeEditor
						code={code}
						setCode={setCode}
						language={language}
						setLanguage={setLanguage}
						onCursorChange={handleCursorChange}
						ref={editorRef}
					/>
					<Terminal output={output} />
					<IdeFooter onExecute={handleCodeExecution} />
				</div>
				{isTeamMode && (
					<div className="w-1/2 border-r border-gray-04">
						<CodeEditor
							code={partnerCode}
							setCode={() => {}}
							language={language}
							setLanguage={() => {}}
							onCursorChange={() => {}}
							readonly
						/>
					</div>
				)}
			</div>
			<div className="min-w-[13rem] border-l border-gray-04">
				<GameUserList
					teamMembers={teamMembers}
					opponentMembers={opponentMembers}
				/>
			</div>
		</div>
	);
};
