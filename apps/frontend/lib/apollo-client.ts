import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import {SERVER_URL} from "@/lib/constants/url.constant";

const httpLink = createHttpLink({
    uri: SERVER_URL,
    credentials: 'include',
});
export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
})