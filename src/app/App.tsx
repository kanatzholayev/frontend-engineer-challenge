import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { RouterProvider } from './providers/RouterProvider';

import 'sanitize.css';
import '@/shared/styles/base.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>

    <RouterProvider />

    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
