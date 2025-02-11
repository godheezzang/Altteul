import { useState } from "react";
import noCodeImg from "@assets/icon/no_code.svg";
import { CodeInfo, Problem } from "types/types";

type TeamTabsProps = {
	problemInfo: Problem;
	teamCodeInfo: CodeInfo;
	opponentCodeInfo: CodeInfo;
};

const TeamTabs = ({ problemInfo, teamCodeInfo, opponentCodeInfo }: TeamTabsProps) => {
	const [selectedTab, setSelectedTab] = useState<"info" | "code">("info");

	return (
		<div className="mt-6">
			<div className="flex gap-4 mb-4">
				<button
					className={`flex-1 px-4 py-2 ${selectedTab === "info" ? "bg-gray-05 rounded-md font-semibold" : "text-gray-03"}`}
					onClick={() => setSelectedTab("info")}>
					문제 정보
				</button>
				<button
					className={`flex-1 px-4 py-2 ${selectedTab === "code" ? "bg-gray-05 rounded-md font-semibold" : "text-gray-03"}`}
					onClick={() => setSelectedTab("code")}>
					코드
				</button>
			</div>

			<div className={`rounded-md mt-2 ${selectedTab === "info" ? "bg-gray-05" : ""}`}>
				{selectedTab === "info" ? (
					<div className="px-4 py-6 ">
						<p className="mb-5">
							<span>{problemInfo.problemId}.</span>
							<span>{problemInfo.problemTitle}</span>
						</p>
						<p>{problemInfo.description}</p>
					</div>
				) : (
					<div className="flex gap-4">
						<div className="flex-1">
							<p className="text-center mb-4 text-sm">우리팀 코드</p>
							{teamCodeInfo.code ? (
								<pre className=" bg-gray-05 p-4 text-sm rounded-md overflow-auto min-h-[20rem]">{teamCodeInfo.code}</pre>
							) : (
								<div className="flex flex-col items-center justify-center bg-gray-05 p-4 text-sm rounded-md min-h-[20rem]">
									<img
										src={noCodeImg}
										alt="코드 정보 없음"
										className="w-[3rem]"
									/>
									<p className="p-4 text-center">코드를 제출하지 않았습니다.</p>
								</div>
							)}
							<div className="flex justify-center text-center px-14 py-4">
								<div className="flex-1">
									<p>실행 시간</p>
									<p>{teamCodeInfo.executeTime ? teamCodeInfo.executeTime + "초" : "-"}</p>
								</div>
								<div className="flex-1">
									<p>메모리</p>
									<p>{teamCodeInfo.executeMemory ? teamCodeInfo.executeMemory + "MB" : "-"}</p>
								</div>
							</div>
						</div>
						<div className="flex-1">
							<p className="text-center mb-4 text-sm">상대팀 코드</p>
							{opponentCodeInfo.code ? (
								<pre className=" bg-gray-05 p-4 text-sm rounded-md overflow-auto min-h-[20rem]">{opponentCodeInfo.code}</pre>
							) : (
								<div className="flex flex-col items-center justify-center bg-gray-05 p-4 text-sm rounded-md min-h-[20rem]">
									<img
										src={noCodeImg}
										alt="코드 정보 없음"
										className="w-[3rem]"
									/>
									<p className="p-4 text-center">코드를 제출하지 않았습니다.</p>
								</div>
							)}
							<div className="flex justify-center text-center px-14 py-4">
								<div className="flex-1">
									<p>실행 시간</p>
									<p>{opponentCodeInfo.executeTime ? opponentCodeInfo.executeTime + "초" : "-"}</p>
								</div>
								<div className="flex-1">
									<p>메모리</p>
									<p>{opponentCodeInfo.executeMemory ? opponentCodeInfo.executeMemory + "MB" : "-"}</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TeamTabs;
