import type { FallbackProps } from 'react-error-boundary';

const FallbackComponent = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert">
      <p>에러가 발생했습니다:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>다시 시도</button>
    </div>
  );
};

export default FallbackComponent;
