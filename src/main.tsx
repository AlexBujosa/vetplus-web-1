import ReactDOM from "react-dom/client";
import App from "./index.tsx";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ApolloProvider } from "@apollo/client";
import client from "@/utils/apolloClient.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 1000,
      refetchIntervalInBackground: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
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
);
