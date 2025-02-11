// pages/TeamIdePage.tsx
import { IdeLayout } from '@components/Ide/IdeLayout';
import { useIde } from '@hooks/useIde';

const TeamIdePage = () => {
  return <IdeLayout {...useIde(true)} />;
};

export default TeamIdePage;
