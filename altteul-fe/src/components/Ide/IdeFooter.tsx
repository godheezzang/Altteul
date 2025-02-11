import SmallButton from '@components/Common/Button/SmallButton ';

interface IdeFooterProps {
  onExecute: () => void;
}

const IdeFooter = ({ onExecute }: IdeFooterProps) => {
  const handleSubmitCode = () => {
    // 코드 제출 axios
  };

  return (
    <div className="flex justify-end items-center p-2 bg-primary-black border-t border-gray-04">
      <SmallButton onClick={onExecute} children="코드 실행" backgroundColor="gray-04" />
      <SmallButton onClick={handleSubmitCode} children="코드 제출" type="submit" />
    </div>
  );
};

export default IdeFooter;
