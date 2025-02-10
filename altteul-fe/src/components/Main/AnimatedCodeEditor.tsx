import React, { useEffect, useState, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";

const codeSnippet = `import java.util.ArrayList;
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
}`;

const AnimatedCodeEditor = (): JSX.Element => {
  const [typedCode, setTypedCode] = useState<string>("");
  const indexRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < codeSnippet.length) {
        setTypedCode((prev) => prev + codeSnippet[indexRef.current]);
        indexRef.current += 1;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-primary-black/80 to-primary-black" />
      <MonacoEditor
        height="100%"
        defaultLanguage="java"
        theme="vs-dark"
        value={typedCode}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 16,
          wordWrap: "on",
          scrollbar: { vertical: "hidden", horizontal: "hidden" },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};
export default AnimatedCodeEditor;
