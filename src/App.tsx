import useApiError from '@/hooks/useApiError';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
      <ToastContainer position="bottom-center" limit={1} autoClose={4000} hideProgressBar />
    </QueryClientProvider>
  );
}

export default App;
