import {ApolloClient, InMemoryCache} from "@apollo/client";
import {SERVER_URL} from "@/lib/constants/url.constant";
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'

const httpLink = createUploadLink({
    uri: SERVER_URL,
    credentials: 'include',
    headers: {
        'apollo-require-preflight': 'true'
    }
});
export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
})