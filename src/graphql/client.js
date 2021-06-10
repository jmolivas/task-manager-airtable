import { ApolloClient, InMemoryCache } from "@apollo/client";

const { REACT_APP_GRAPHQL_URI } = process.env;

const client = new ApolloClient({
  uri: REACT_APP_GRAPHQL_URI,
  cache: new InMemoryCache(),
});

export default client;
