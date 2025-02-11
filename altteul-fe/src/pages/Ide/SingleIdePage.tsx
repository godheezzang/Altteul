import { IdeLayout } from "@components/Ide/IdeLayout";
import { useIde } from "@hooks/useIde";

const SingleIdePage = () => {
	const ideProps = useIde(false);
	return <IdeLayout {...ideProps} />;
};

export default SingleIdePage;
