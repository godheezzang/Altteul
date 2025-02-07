import { getUserRecord } from '@utils/api/userApi';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserGameRecord } from 'types/types';

const BattleRecord = () => {
  const userId = useParams();
  const [Record, setRecord] = useState<UserGameRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRecord = async () => {
      try {
        setIsLoading(true);
        let data;

        if (userId) {
          const response = await getUserRecord(userId);
        } else {
          return;
        }
      } catch (error) {}
    };
  });
  return (
    <>
      <h1>BattleRecord</h1>
    </>
  );
};

export default BattleRecord;
