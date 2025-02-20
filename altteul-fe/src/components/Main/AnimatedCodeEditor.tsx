import React, { useEffect, useRef, useState } from 'react';
import MonacoEditor, { loader } from '@monaco-editor/react';
// 1) txt 파일 import
import mcWar from '@assets/solved/MC 전쟁.txt';
import gridCity from '@assets/solved/격자 도시.txt?raw';
import headMeeting from '@assets/solved/머리맞대기.txt?raw';
import warehouseRobot from '@assets/solved/물류 창고 로봇.txt?raw';
import busTransfer from '@assets/solved/버스 환승.txt?raw';

loader.init().then(monaco => {
  monaco.languages.register({ id: 'python' });
});

// 2) 코드 스니펫 배열
const codeSnippets = [
  mcWar,
  gridCity,
  headMeeting,
  warehouseRobot,
  busTransfer,
];

const AnimatedCodeEditor = (): JSX.Element => {
  // codeSnippet을 상태로 갖고, 무작위로 선택
  const [codeSnippet, setCodeSnippet] = useState('');
  const [typedCode, setTypedCode] = useState('');
  const indexRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // 타이핑 속도 (ms)
  const typingSpeed = 30;

  // 3) 마운트 시점에 무작위 스니펫 선택
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * codeSnippets.length);
    setCodeSnippet(codeSnippets[randomIndex]);
  }, []);

  // 4) codeSnippet이 정해지면 타이핑 시작
  useEffect(() => {
    // codeSnippet이 아직 ''이면 타이핑 로직이 필요없음
    if (!codeSnippet || !isEditorReady) return;

    // typedCode 초기화
    setTypedCode('');
    indexRef.current = 0;
    lastTimeRef.current = 0;

    const typeNextChar = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;
      if (elapsed > typingSpeed) {
        if (indexRef.current < codeSnippet.length) {
          setTypedCode(prev => prev + codeSnippet[indexRef.current]);
          indexRef.current += 1;
          lastTimeRef.current = timestamp;
        }
      }

      if (indexRef.current < codeSnippet.length) {
        rafRef.current = requestAnimationFrame(typeNextChar);
      }
    };

    rafRef.current = requestAnimationFrame(typeNextChar);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [codeSnippet, isEditorReady]);

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-primary-black/80 to-primary-black" />

      <MonacoEditor
        height="100%"
        language="python"
        theme="vs-dark"
        value={typedCode}
        onMount={() => setIsEditorReady(true)}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 16,
          wordWrap: 'on',
          scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default AnimatedCodeEditor;
