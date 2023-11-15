import { GraphQLClient } from "graphql-request";

const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT!;

const token = localStorage.getItem("token");

const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: token ? `Bearer ${token}` : "",
  },
});

export default client;
