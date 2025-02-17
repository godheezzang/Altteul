import { useEffect, useRef, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { configureMonaco } from '@utils/monacoConfig';
import Dropdown from '@components/Common/Dropdown';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import { Awareness } from 'y-protocols/awareness';

const DEFAULT_CODE = {
  python: 'print("Hello World!")',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}',
};

interface CodeEditorProps {
  code?: string | null
  setCode: React.Dispatch<React.SetStateAction<string>>
  language?: 'python' | 'java';
  setLanguage?: (lang: 'python' | 'java') => void;
  readOnly?: boolean;
  roomId: string;
  onCodeChange?: (code: string) => void;
}

interface CursorData {
  roomId: string;
  clientId: number;
  username?: string;
  cursor: {
    lineNumber: number;
    column: number;
  };
  color: string;
}

const SOCKET_URL = "ws://ec2-18-212-95-231.compute-1.amazonaws.com:1234";

const CURSOR_COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
  '#FF00FF', '#00FFFF', '#FFA500', '#800080'
];

const CodeEditor = ({ 
  language = 'python', 
  setLanguage, 
  readOnly = false, 
  roomId,
  onCodeChange 
}: CodeEditorProps) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const ydoc = useRef(new Y.Doc());
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const yText = useRef(ydoc.current.getText('monaco'));
  const awareness = useRef(new Awareness(ydoc.current));
  const bindingRef = useRef<MonacoBinding | null>(null);
  const [activeCursors, setActiveCursors] = useState<Map<number, CursorData>>(new Map());
  const [username] = useState(`User${Math.floor(Math.random() * 1000)}`);
  const cursorColor = useRef(CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)]);

  // Monaco Editor 설정
  useEffect(() => {
    configureMonaco();
  }, [language]);

  // WebSocket Provider 설정
  useEffect(() => {
    if (!roomId) {
      console.error("roomId가 설정되지 않았습니다.");
      return;
    }

    const provider = new WebsocketProvider(SOCKET_URL, "test", ydoc.current);
    
    provider.on('status', (event: any) => {
      console.log(event.status); // 'connected' 또는 'disconnected' 로그
    });
    

    setProvider(provider);

    return () => {
      provider?.destroy();
      ydoc.current.destroy();
    };
  }, [roomId]);

  // Awareness (커서 위치) 업데이트
  useEffect(() => {
    if (!readOnly && awareness.current) {
      const updateAwareness = () => {
        if (!editorRef.current) return;
        
        const position = editorRef.current.getPosition();
        if (!position) return;

        awareness.current.setLocalState({
          roomId,
          clientId: awareness.current.clientID,
          username,
          cursor: {
            lineNumber: position.lineNumber,
            column: position.column,
          },
          color: cursorColor.current
        });
      };

      awareness.current.on('change', () => {
        const states = Array.from(awareness.current.getStates());
        const newCursors = new Map();
        
        states.forEach(([clientId, state]) => {
          if (clientId !== awareness.current.clientID && state.cursor) {
            newCursors.set(clientId, state as CursorData);
          }
        });
        
        setActiveCursors(newCursors);
      });


      return () => {
        awareness.current.setLocalState(null);
      };
    }
  }, [roomId, readOnly, username]);

  // Monaco Binding 설정
  useEffect(() => {
    if (!readOnly && editorRef.current && provider) {
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }

      const model = editorRef.current.getModel();
      if (model) {
        bindingRef.current = new MonacoBinding(
          ydoc.current.getText(),
          model,
          new Set([editorRef.current]),
          provider?.awareness
        );
      }
    }

    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
    };
  }, [provider, readOnly, ydoc, editorRef.current]);

  // 에디터 마운트 시 설정
  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    if (!yText.current.toString()) {
      yText.current.insert(0, DEFAULT_CODE[language]);
    }

    // 커서 데코레이션 추가
    const updateDecorations = () => {
      const decorations = [];
      activeCursors.forEach((userData) => {
        const { cursor, username, color } = userData;
        decorations.push({
          range: {
            startLineNumber: cursor.lineNumber,
            startColumn: cursor.column,
            endLineNumber: cursor.lineNumber,
            endColumn: cursor.column + 1,
          },
          options: {
            className: `cursor-${userData.clientId}`,
            hoverMessage: { value: username || 'Unknown user' },
            beforeContentClassName: 'cursor-decoration',
            after: {
              content: '|',
              color: color,
            },
          },
        });
      });
    };

    // 테마 및 언어 설정
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#242A32',
      },
    });

    monaco.editor.setTheme('custom-dark');
  };

  return (
    <div className="flex flex-col border-b border-gray-04 items-end">
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
        theme="custom-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
          },
          readOnly,
          lineNumbers: 'on',
          roundedSelection: true,
          selectOnLineNumbers: true,
          quickSuggestions: true,
        }}
        loading="에디터를 불러오는 중입니다..."
        onMount={handleEditorMount}
      />

      {/* 현재 접속자 표시 */}
      <div className="mt-2 text-sm text-gray-400">
        현재 접속자: {Array.from(activeCursors.values()).map(user => user.username).join(', ')}
      </div>
    </div>
  );
};

export default CodeEditor;