import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { configureMonaco } from '@utils/monacoConfig';
import Dropdown from '@components/Common/Drpodown/Dropdown';

const DEFAULT_CODE = {
  python: 'print("Hello World!")',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}',
};

const CodeEditor = () => {
  const [language, setLanguage] = useState<'python' | 'java'>('python');
  const [code, setCode] = useState(DEFAULT_CODE[language]);

  useEffect(() => {
    configureMonaco();
  }, []);

  const languageOptions = [
    { id: 1, value: 'python', label: 'Python' },
    { id: 2, value: 'java', label: 'Java' },
  ];

  return (
    <div className='flex flex-col border-b border-gray-04'>
      {/* 언어 선택 드롭다운 */}
      <Dropdown
        options={languageOptions}
        value={language}
        onChange={(newLang) => {
          setLanguage(newLang as 'python' | 'java');
          setCode(DEFAULT_CODE[newLang as keyof typeof DEFAULT_CODE]);
        }}
        width='10rem'
        height='3.7rem'
        className='p-4'
      />

      <Editor
        height='55vh'
        language={language}
        value={code}
        theme='vs-dark'
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
          },
        }}
        loading='에디터를 불러오는 중입니다.'
        onChange={(value) => setCode(value || '')}
        beforeMount={(monaco) => {
          monaco.editor.defineTheme('custom-dark', {
            base: 'vs-dark',
            inherit: false,
            colors: { 'editor.background': '#242A32' },
            rules: [],
          });

          // Java 언어 설정 추가
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
        }}
      />
    </div>
  );
};

export default CodeEditor;
