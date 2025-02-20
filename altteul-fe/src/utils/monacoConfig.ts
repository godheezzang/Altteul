import { loader } from '@monaco-editor/react';

export const configureMonaco = async () => {
  await loader.init();
  const monaco = loader.__getMonacoInstance();

  // Python 언어 설정
  monaco.languages.register({ id: 'python' });
  monaco.languages.setMonarchTokensProvider('python', {
    defaultToken: 'invalid',
    tokenPostfix: '.python',
    
    keywords: [
      'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def',
      'del', 'elif', 'else', 'except', 'exec', 'finally', 'for', 'from', 'global',
      'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'print',
      'raise', 'return', 'try', 'while', 'with', 'yield', 'Altteul'
    ],
    
    builtins: [
      'abs', 'all', 'any', 'bin', 'bool', 'bytearray', 'bytes', 'chr', 'complex',
      'dict', 'dir', 'divmod', 'enumerate', 'filter', 'float', 'format', 'frozenset',
      'getattr', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance',
      'issubclass', 'iter', 'len', 'list', 'map', 'max', 'memoryview', 'min', 'next',
      'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'range', 'repr',
      'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str',
      'sum', 'super', 'tuple', 'type', 'vars', 'zip'
    ],
    
    collections: [
      'collections', 'deque', 'defaultdict', 'Counter', 'OrderedDict', 'namedtuple', 'ChainMap'
    ],
    
    magicMethods: [
      '__init__', '__del__', '__repr__', '__str__', '__call__', '__lt__', '__gt__',
      '__le__', '__ge__', '__eq__', '__ne__', '__add__', '__sub__', '__mul__', '__div__'
    ],
    
    booleans: ['True', 'False', 'None'],
    
    brackets: [
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '[', close: ']', token: 'delimiter.square' },
      { open: '(', close: ')', token: 'delimiter.parenthesis' }
    ],
    
    tokenizer: {
      root: [
        [/^\s*#.*$/, 'comment'],
        [/("""|\'\'\')/, { token: 'string.quote', bracket: '@open', next: '@multistring.$1' }],
        [/'[^']*'/, 'string'],
        [/"[^"]*"/, 'string'],
        [/[0-9]+\.[0-9]+/, 'number.float'],
        [/[0-9]+/, 'number'],
        [/\b(self|cls)\b/, 'variable.predefined'],
        [/\b(__[a-zA-Z0-9_]+__)\b/, 'constant.language'],
        [
          /[a-zA-Z_]\w*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@builtins': 'type.identifier',
              '@collections': 'type.collection',
              '@booleans': 'constant.boolean',
              '@magicMethods': 'constant.language',
              '@default': 'identifier'
            }
          }
        ],
        [/\+|\-|\*|\/|\%|\=|\<|\>|\&|\||\!|\^|\~/, 'operator'],
        [/[\{\}\(\)\[\]]/, '@brackets'],
        [/[;,.]/, 'delimiter']
      ],
      multistring: [
        [/[^\\"']+/, 'string'],
        [/("""|''')/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
        [/./, 'string']
      ]
    }
  });

  // Java 언어 설정
  monaco.languages.register({ id: 'java' });
  monaco.languages.setMonarchTokensProvider('java', {
    defaultToken: 'invalid',
    tokenPostfix: '.java',
    
    keywords: [
      'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
      'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
      'extends', 'final', 'finally', 'float', 'for', 'if', 'goto', 'implements',
      'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package',
      'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
      'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
      'try', 'void', 'volatile', 'while', 'var'
    ],
    
    primitives: [
      'boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short', 'void'
    ],
    
    modifiers: [
      'abstract', 'final', 'native', 'private', 'protected', 'public', 'static',
      'strictfp', 'synchronized', 'transient', 'volatile'
    ],
    
    booleans: ['true', 'false', 'null'],
    
    brackets: [
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '[', close: ']', token: 'delimiter.square' },
      { open: '(', close: ')', token: 'delimiter.parenthesis' },
      { open: '<', close: '>', token: 'delimiter.angle' }
    ],
    
    tokenizer: {
      root: [
        // 주석
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
        
        // 문자열
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string'],
        
        // 문자
        [/'[^\\']'/, 'string'],
        [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
        [/'/, 'string.invalid'],
        
        // 숫자
        [/\b\d+\.\d+([eE][\-+]?\d+)?\b/, 'number.float'],
        [/\b0[xX][0-9a-fA-F_]*[0-9a-fA-F]\b/, 'number.hex'],
        [/\b0[0-7_]*[0-7]\b/, 'number.octal'],
        [/\b0[bB][0-1_]*[0-1]\b/, 'number.binary'],
        [/\b\d+\b/, 'number'],
        
        // Annotations
        [/@[a-zA-Z_$][\w$]*/, 'annotation'],
        
        // 식별자
        [/[a-zA-Z_$][\w$]*/, { 
          cases: {
            '@primitives': 'type.primitive',
            '@keywords': 'keyword',
            '@modifiers': 'keyword.modifier',
            '@booleans': 'constant.boolean',
            '@default': 'identifier' 
          }
        }],
        
        // 특수 키워드 확인
        [/\b(System|String|Math|ArrayList|HashMap|Arrays)\b/, 'type.class'],
        [/\b(List|Map|Set|Queue|Deque|Collection)\b/, 'type.collection'],
        
        // 괄호
        [/[{}()\[\]]/, '@brackets'],
        
        // 연산자
        [/[<>](?!@brackets)/, 'operator'],
        [/[+\-*/=&|^~!%]/, 'operator'],
        
        // 구분자 (쉼표는 특별한 색상 지정 안함)
        [/[;,.]/, 'delimiter']
      ],
      
      comment: [
        [/[^/*]+/, 'comment'],
        [/\/\*/, 'comment', '@push'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment']
      ],
      
      string: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop']
      ]
    },
    
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/
  });

  // Python 자동 완성 설정 - 확장
  monaco.languages.registerCompletionItemProvider('python', {
    triggerCharacters: ['.', '('],
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        {
          label: 'print',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'print(${1:})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          detail: '출력 함수',
          documentation: '콘솔에 출력하는 함수입니다.'
        },
        {
          label: 'def',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'def ${1:function_name}(${2:parameters}):\n\t${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          detail: '함수 정의',
          documentation: '새 함수를 정의합니다.'
        },
        {
          label: 'if',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'if ${1:condition}:\n\t${2:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
        },
        {
          label: 'for',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'for ${1:item} in ${2:iterable}:\n\t${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
        },
        {
          label: 'while',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'while ${1:condition}:\n\t${2:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
        },
        {
          label: 'class',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'class ${1:ClassName}:\n\tdef __init__(self${2:, parameters}):\n\t\t${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
        },
        {
          label: 'True',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'True',
          range: range,
          detail: 'boolean 상수',
          documentation: '참 값을 나타내는 boolean 상수'
        },
        {
          label: 'False',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'False',
          range: range,
          detail: 'boolean 상수',
          documentation: '거짓 값을 나타내는 boolean 상수'
        },
        {
          label: 'None',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'None',
          range: range,
          detail: 'null 값',
          documentation: '값이 없음을 나타내는 특수 상수'
        },
        {
          label: 'range',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'range(${1:start}, ${2:stop}, ${3:step})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          detail: '범위 생성 함수',
          documentation: '지정된 범위의 숫자 시퀀스를 생성합니다.'
        },
        {
          label: 'max',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'max(${1:iterable})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          detail: '최댓값 반환',
          documentation: '인자 중 최댓값을 반환합니다.'
        },
        {
          label: 'min',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'min(${1:iterable})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          detail: '최솟값 반환',
          documentation: '인자 중 최솟값을 반환합니다.'
        },
        {
          label: 'sum',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'sum(${1:iterable})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          detail: '합계 계산',
          documentation: '모든 항목의 합계를 반환합니다.'
        },
        {
          label: 'collections',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'collections',
          range: range,
          detail: '컬렉션 모듈',
          documentation: '특수 컨테이너 데이터형을 구현하는 모듈'
        },
        {
          label: 'deque',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'collections.deque(${1:iterable})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          detail: '양방향 큐',
          documentation: '양쪽 끝에서 효율적으로 추가/제거할 수 있는 리스트형 컨테이너'
        }
      ];

      // collections 모듈 자동완성
      const lineContent = model.getLineContent(position.lineNumber);
      if (lineContent.includes('collections.') || word.word === 'collections.') {
        suggestions.push(
          {
            label: 'deque',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'deque(${1:iterable})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
            detail: '양방향 큐',
            documentation: '양쪽 끝에서 효율적으로 추가/제거할 수 있는 리스트형 컨테이너'
          },
          {
            label: 'Counter',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'Counter(${1:iterable})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
            detail: '요소 카운팅',
            documentation: '해시 가능한 객체의 카운트를 위한 사전 서브클래스'
          },
          {
            label: 'defaultdict',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'defaultdict(${1:default_factory})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
            detail: '기본값 사전',
            documentation: '기본값을 제공하는 사전 서브클래스'
          },
          {
            label: 'OrderedDict',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'OrderedDict(${1:items})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
            detail: '순서 있는 사전',
            documentation: '항목이 추가된 순서를 기억하는 사전 서브클래스'
          }
        );
      }

      return { suggestions };
    },
  });

  // Java 자동 완성은 이전과 동일

  // 테마 설정
  monaco.editor.defineTheme('pythonTheme', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'type.identifier', foreground: '267f99' },
      { token: 'type.collection', foreground: '8A2BE2' }, // Collections 보라색
      { token: 'constant.boolean', foreground: '0000FF', fontStyle: 'bold' }, // Boolean 값 파란색 굵게
      { token: 'constant.language', foreground: 'af00db' },
      { token: 'variable.predefined', foreground: '001080' },
      { token: 'comment', foreground: '008000' },
      { token: 'string', foreground: 'a31515' },
      { token: 'number', foreground: '098658' },
      { token: 'operator', foreground: '000000' },
      { token: 'delimiter', foreground: '000000' } // 구분자(쉼표 등) 색상 변경
    ],
    colors: {}
  });

  monaco.editor.defineTheme('javaTheme', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'keyword.modifier', foreground: '0000FF' },
      { token: 'type.primitive', foreground: '008080', fontStyle: 'bold' },
      { token: 'type.class', foreground: '267f99', fontStyle: 'bold' },
      { token: 'type.collection', foreground: '8A2BE2', fontStyle: 'bold' }, // Collection 보라색 
      { token: 'constant.boolean', foreground: '0000FF', fontStyle: 'bold' }, // Boolean 값 파란색 굵게
      { token: 'annotation', foreground: '808000' },
      { token: 'comment', foreground: '008000' },
      { token: 'string', foreground: 'a31515' },
      { token: 'number', foreground: '098658' },
      { token: 'number.float', foreground: '098658' },
      { token: 'number.hex', foreground: '098658' },
      { token: 'delimiter', foreground: '000000' } // 구분자(쉼표 등) 색상 변경
    ],
    colors: {}
  });
};