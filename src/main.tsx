import ReactDOM from 'react-dom/client'
import App from './index.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import client from '@/utils/apolloClient.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
