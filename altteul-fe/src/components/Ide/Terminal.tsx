interface TerminalProps {
	output: string;
}

const Terminal = ({ output }: TerminalProps) => {
	return (
		<div className="h-[25vh] bg-primary-black text-gray-100 flex flex-col">
			<h3 className="font-semibold">Terminal</h3>
			<p>{output}</p>
		</div>
	);
};

export default Terminal;
