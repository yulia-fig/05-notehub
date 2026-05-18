// src/main.tsx

import ReactDOM from 'react-dom/client';
import { StrictMode } from "react";
import App from "./components/App/App";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
  </StrictMode>
);
