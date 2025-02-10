import { getUserRecord } from "@utils/api/userApi";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserGameRecord } from "types/types";
import BattleRecordItem from "./BattleRecordItem";

const BattleRecord = () => {
	const { userId } = useParams<{ userId: string }>();
	const [records, setRecords] = useState<UserGameRecord[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUserRecord = async () => {
			try {
				setIsLoading(true);
				if (userId) {
					const response = await getUserRecord(userId);
					const data = response.data.games;
					setRecords(data);
				}
			} catch (error) {
				console.error("Failed to fetch user record:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserRecord();
	}, [userId]);

	if (isLoading) {
		return <div>로딩 중...</div>;
	}

	if (!records || records.length === 0) {
		return <div>기록을 찾을 수 없습니다.</div>;
	}

	return (
		<div>
			{records.map((record, index) => (
				<BattleRecordItem
					key={index}
					record={record}
				/>
			))}
		</div>
	);
};

export default BattleRecord;
