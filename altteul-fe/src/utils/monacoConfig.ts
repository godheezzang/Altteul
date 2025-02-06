import { loader } from '@monaco-editor/react';

export const configureMonaco = async () => {
  await loader.init();
  const monaco = await loader.__getMonacoInstance();

  // Python 언어 설정
  monaco.languages.register({ id: 'python' });
  monaco.languages.setMonarchTokensProvider('python', {
    keywords: ['def', 'class', 'import', 'from', 'as'],
    tokenizer: {
      root: [
        [
          /[a-zA-Z_]\w*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@default': 'identifier',
            },
          },
        ],
      ],
    },
  });

  // 커스텀 자동 완성 추가
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: (model, position) => ({
      suggestions: [
        {
          label: 'print',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'print("${1:message}")',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
      ],
    }),
  });

  // Java 언어 설정
  monaco.languages.register({ id: 'java' });
  monaco.languages.setLanguageConfiguration('java', {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },
  });
};
