// pages/TeamIdePage.tsx
import { IdeLayout } from "@components/Ide/IdeLayout";
import { useIde } from "@hooks/useIde";

const TeamIdePage = () => {
	const ideProps = useIde(true);
	return <IdeLayout {...ideProps} />;
};

export default TeamIdePage;
