import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './store';
import './index.css';

const qc = new QueryClient({ defaultOptions: { queries: { staleTime: 60000, retry: 1 } } });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={qc}>
        <App />
        <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '13px', fontWeight: 500 } }} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
