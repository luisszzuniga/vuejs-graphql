import './assets/main.css'

import { createApp, provide, h } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client/core'
import { createPinia } from 'pinia'
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities"
import App from './App.vue'
import router from './router'

const wsLink = new GraphQLWsLink(
    createClient({
        url: "ws://localhost:3000/graphql",
    })
);

const httpLink = new HttpLink({
    uri: "http://localhost:3000/graphql"
})

const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        )
    },
    wsLink,
    httpLink
)

const apolloClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
})

const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient)
    },
    render: () => h(App),
});

app.use(createPinia());
app.use(router);

app.mount('#app');
