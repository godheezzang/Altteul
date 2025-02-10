import { forwardRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { configureMonaco } from "@utils/monacoConfig";
import Dropdown from "@components/common/Dropdown";
import * as monaco from "monaco-editor";
import { Cursor } from "@hooks/useIde";

const DEFAULT_CODE = {
	python: 'print("Hello World!")',
	java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}',
};

interface CodeEditorProps {
	code: string;
	setCode: (code: string) => void;
	language: "python" | "java";
	setLanguage: (lang: "python" | "java") => void;
	onCursorChange: (cursor: Cursor) => void;
	readonly?: boolean;
}

const CodeEditor = forwardRef<monaco.editor.IStandaloneCodeEditor, CodeEditorProps>(({ code, setCode, language, setLanguage, onCursorChange, readonly }, ref) => {
	useEffect(() => {
		configureMonaco();
		setCode(DEFAULT_CODE[language]);
	}, []);

	const languageOptions = [
		{ id: 1, value: "python", label: "Python" },
		{ id: 2, value: "java", label: "Java" },
	];

	const handleEditorDidMount: OnMount = (editor) => {
		if (ref) {
			(ref as React.MutableRefObject<monaco.editor.IStandaloneCodeEditor>).current = editor;
		}

		editor.onDidChangeCursorPosition((e: monaco.editor.ICursorPositionChangedEvent) => {
			const position = e.position;
			onCursorChange({ line: position.lineNumber, ch: position.column });
		});
	};

	return (
		<div className="flex flex-col border-b border-gray-04">
			{!readonly && (
				<Dropdown
					options={languageOptions}
					value={language}
					onChange={(newLang: string) => {
						setLanguage(newLang as typeof language);
					}}
					width="10rem"
					height="3.7rem"
				/>
			)}

			<Editor
				height="55vh"
				language={language}
				value={code}
				theme="vs-dark"
				options={{
					minimap: { enabled: false },
					fontSize: 14,
					automaticLayout: true,
					scrollBeyondLastLine: false,
					scrollbar: {
						vertical: "auto",
						horizontal: "auto",
					},
					readonly: readonly,
				}}
				loading="에디터를 불러오는 중입니다."
				onChange={(value) => setCode(value || "")}
				onMount={handleEditorDidMount}
				beforeMount={(monaco) => {
					monaco.editor.defineTheme("custom-dark", {
						base: "vs-dark",
						inherit: false,
						colors: { "editor.background": "#242A32" },
						rules: [],
					});

					monaco.languages.register({ id: "java" });
					monaco.languages.setLanguageConfiguration("java", {
						autoClosingPairs: [
							{ open: "{", close: "}" },
							{ open: "[", close: "]" },
							{ open: "(", close: ")" },
							{ open: '"', close: '"' },
							{ open: "'", close: "'" },
						],
					});
				}}
			/>
		</div>
	);
});

export default CodeEditor;
