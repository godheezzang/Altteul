import { IdeLayout } from '@components/Ide/IdeLayout';
import { useIde } from '@hooks/useIde';

const SingleIdePage = () => {
  return <IdeLayout {...useIde(false)} />;
};

export default SingleIdePage;
