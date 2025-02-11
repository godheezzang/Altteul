import BattleRecord from '@components/User/BattleRecord';
import UserInfo from '@components/User/UserInfo';

const UserPage = () => {
  return (
    <div className='w-1/2 mx-auto'>
      <div>
        <UserInfo />
        <BattleRecord />
      </div>
    </div>
  );
};

export default UserPage;
