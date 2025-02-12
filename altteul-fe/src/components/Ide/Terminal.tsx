interface TerminalProps {
  output: string;
}

const Terminal = ({ output }: TerminalProps) => {
  return (
    <div className="h-[25vh] bg-gray-04 text-gray-02 p-3 overflow-auto">
      <pre className="whitespace-pre-wrap text-sm text-gray-01">{output}</pre>
    </div>
  );
};

export default Terminal;
