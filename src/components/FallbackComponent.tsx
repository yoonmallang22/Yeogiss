import type { FallbackProps } from 'react-error-boundary';
import errorImage from '@/assets/error.svg';
import Button from '@/components/common/Button';

const FallbackComponent = ({ resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <img src={errorImage} alt="Error" className="w-30 h-50 mb-4" />
      <p className="font-bold text-xl mb-2">현재 서비스에 문제가 발생했어요.</p>
      <p className="font-thin text-sm mb-10">인터넷 연결을 확인하거나 다시 시도해주세요.</p>
      <Button onClick={resetErrorBoundary}>다시 시도</Button>
    </div>
  );
};

export default FallbackComponent;
