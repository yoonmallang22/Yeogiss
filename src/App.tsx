import FallbackComponent from '@/components/FallbackComponent';
import useApiError from '@/hooks/useApiError';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { handleError } = useApiError();

  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        onError: handleError,
      },
    },
    queryCache: new QueryCache({
      onError: handleError,
    }),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <ToastContainer position="bottom-center" limit={1} autoClose={4000} hideProgressBar />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
