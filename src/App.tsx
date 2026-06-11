import FallbackComponent from "@/components/FallbackComponent";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import Router from "@/routes/Router";
import Toast from "@/components/common/Toast";
import { LoadingProvider } from "@/lib/loading/LoadingContext";

function App() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache(),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <LoadingProvider>
          <Router />
          <Toast />
        </LoadingProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
