import React, { useEffect, useRef, useState } from 'react';
import MonacoEditor, { loader } from '@monaco-editor/react';

loader.init().then(monaco => {
  monaco.languages.register({ id: 'java' });
  // monaco.languages.setMonarchTokensProvider('java', javaLanguage);
  // monaco.languages.setLanguageConfiguration('java', javaConfiguration)
});

const codeSnippet = ` import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Solution {
    static boolean visited[];
    static List<String> lst;
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println(Arrays.toString(sol.solution(new String[][] {{"ICN", "JFK"}, {"HND", "IAD"}, {"JFK", "HND"}})));
        System.out.println(Arrays.toString(sol.solution(
            new String[][] {{"ICN", "SFO"}, {"ICN", "ATL"}, {"SFO", "ATL"}, {"ATL", "ICN"}, {"ATL", "SFO"}})));
    }

    public String[] solution(String[][] tickets) {
        String[] answer = {};
        visited = new boolean[tickets.length];
        lst = new ArrayList<String>();
        dfs(0, "ICN", "ICN", tickets);
        Collections.sort(lst);
        answer = lst.get(0).split(" ");
        return answer;
    }

    private void dfs(int depth, String start, String route, String[][] tickets) {
        if(depth == tickets.length) {
            lst.add(route);
            return;
        }
        for (int i = 0; i < tickets.length; i++) {
            if (!visited[i] && start.equals(tickets[i][0])) {
                visited[i] = true;
                dfs(depth + 1, tickets[i][1], route + " " + tickets[i][1], tickets);
                visited[i] = false;
            }
        }
    }
} `;

const AnimatedCodeEditor = (): JSX.Element => {
  const [typedCode, setTypedCode] = useState<string>('');
  const indexRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0); // ⬅ 마지막 실행 시간 기록
  const [isEditorReady, setIsEditorReady] = useState(false);

  const typingSpeed = 40; // ⬅ 속도 조절 (밀리초, 값이 클수록 느려짐)

  useEffect(() => {
    const typeNextChar = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;
      if (elapsed > typingSpeed) {
        // ⬅ 일정 간격 이상 지나야 실행
        if (indexRef.current < codeSnippet.length) {
          setTypedCode(prev => prev + codeSnippet[indexRef.current]);
          indexRef.current += 1;
          lastTimeRef.current = timestamp; // ⬅ 마지막 실행 시간 갱신
        }
      }

      if (indexRef.current < codeSnippet.length) {
        rafRef.current = requestAnimationFrame(typeNextChar);
      }
    };

    if (isEditorReady) {
      rafRef.current = requestAnimationFrame(typeNextChar);
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isEditorReady]);

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-primary-black/80 to-primary-black overflow-hidden" />
      <MonacoEditor
        height="100%"
        language="java"
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
