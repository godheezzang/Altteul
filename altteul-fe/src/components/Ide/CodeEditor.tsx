import { useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { configureMonaco } from '@utils/monacoConfig';
import Dropdown from '@components/Common/Dropdown';
import { useSocketStore } from '@stores/socketStore';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { Awareness } from 'y-protocols/awareness';

const DEFAULT_CODE = {
  python: 'print("Hello World!")',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}',
};

interface CodeEditorProps {
  language?: 'python' | 'java';
  setLanguage?: (lang: 'python' | 'java') => void;
  readOnly?: boolean;
  roomId: string;
}

const SOCKET_URL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_SOCKET_URL_PROD
    : import.meta.env.VITE_SOCKET_URL_DEV;

const CodeEditor = ({ language, setLanguage, readOnly, roomId }: CodeEditorProps) => {
  const { sendMessage, subscribe } = useSocketStore();

  const editorRef = useRef(null);
  const ydoc = useRef(new Y.Doc());
  const provider = useRef(new WebsocketProvider(SOCKET_URL, roomId, ydoc.current));
  const yText = useRef(ydoc.current.getText('monaco'));
  const awareness = useRef(new Awareness(ydoc.current));

  useEffect(() => {
    configureMonaco();
  }, [language]);

  useEffect(() => {
    if (!readOnly) {
      // 실시간 코드 공유 (편집 가능)
      new MonacoBinding(
        yText.current,
        editorRef.current,
        new Set([editorRef.current]),
        provider.current.awareness
      );
    } else {
      // 상대 팀 코드 (읽기 전용, WebSocket 수신)
      subscribe(`/sub/editor/${roomId}`, data => {
        if (data?.type === 'UPDATE' && data?.data?.content) {
          const decodedContent = atob(data.data.content);
          yText.current.delete(0, yText.current.length);
          yText.current.insert(0, decodedContent);
        }
      });
    }

    return () => {
      provider.current.destroy();
    };
  }, [roomId, readOnly]);

  useEffect(() => {
    if (!readOnly) {
      const updateAwareness = () => {
        if (!editorRef.current) return;
        const position = editorRef.current.getPosition();
        if (!position) return;

        const cursorInfo = {
          roomId,
          cursor: {
            lineNumber: position.lineNumber,
            column: position.column,
          },
        };

        sendMessage(`/pub/editor/${roomId}/awareness`, {
          awareness: btoa(JSON.stringify(cursorInfo)),
        });
      };

      editorRef.current?.onDidChangeCursorPosition(updateAwareness);
    }

    return () => {
      awareness.current.destroy();
    };
  }, [roomId, readOnly]);

  useEffect(() => {
    subscribe(`/sub/editor/${roomId}/awareness`, data => {
      if (data?.type === 'AWARENESS' && data?.data?.content) {
        const decodedData = JSON.parse(atob(data.data.content));
        console.log('awareness update:', decodedData);
      }
    });
  }, [roomId]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    if (!yText.current.toString()) {
      yText.current.insert(0, DEFAULT_CODE[language]);
    }

    if (editor.getModel()) {
      new MonacoBinding(
        yText.current,
        editor.getModel()!,
        new Set([editor]),
        provider.current.awareness
      );
    }

    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: false,
      colors: { 'editor.background': '#242A32' },
      rules: [],
    });

    monaco.languages.register({ id: 'java' });
    monaco.languages.setLanguageConfiguration('java', {
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
    });
  };

  useEffect(() => {
    if (readOnly) {
      subscribe(`/sub/editor/${roomId}`, data => {
        if (data?.type === 'UPDATE' && data?.data?.content) {
          const decodedContent = atob(data.data.content);
          yText.current.delete(0, yText.current.length);
          yText.current.insert(0, decodedContent);
        }
      });
    }

    return () => {
      provider.current.destroy();
    };
  }, [roomId, readOnly]);

  const handleChange = (value: string | undefined) => {
    if (!readOnly && value !== undefined) {
      yText.current.delete(0, yText.current.length);
      yText.current.insert(0, value);
      sendMessage(`/pub/editor/${roomId}/update`, { content: btoa(value) });
    }
  };

  return (
    <div
      className={`flex flex-col border-b border-gray-04 items-end ${readOnly ? 'mt-[2.35rem]' : ''}`}
    >
      {/* 언어 선택 드롭다운 */}
      {!readOnly && setLanguage && (
        <Dropdown
          options={[
            { id: 1, value: 'python', label: 'Python' },
            { id: 2, value: 'java', label: 'Java' },
          ]}
          value={language}
          onChange={newLang => setLanguage(newLang as 'python' | 'java')}
          width="10rem"
          height="3.7rem"
          className="bg-gray-06 border-0 text-sm"
          optionCustomName="bg-gray-05 border-0"
          borderColor="border-gray-06"
          fontSize="text-sm"
        />
      )}

      <Editor
        height="55vh"
        language={language}
        value={yText.current.toString()}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
          },
          readOnly: readOnly ? true : false,
        }}
        loading="에디터를 불러오는 중입니다."
        onChange={handleChange}
        onMount={handleEditorMount}
      />
    </div>
  );
};

export default CodeEditor;
