import { ApolloClient, ApolloLink, FetchResult, HttpLink, Observable, split } from '@apollo/client'
// import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

import { ORION_GRAPHQL_URL, QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL } from '@/config/env'

import cache from './cache'

// const BATCHED_QUERIES = ['GetBasicVideos', 'GetDistributionBucketsWithBags', 'GetStorageBucketsWithBags']

const delayLink = new ApolloLink((operation, forward) => {
  const ctx = operation.getContext()
  if (!ctx.delay) {
    return forward(operation)
  }

  return new Observable<FetchResult>((observer) => {
    setTimeout(() => {
      forward(operation).subscribe((value) => {
        observer.next(value)
      })
    }, ctx.delay)
  })
})

const createApolloClient = () => {
  const subscriptionLink = new GraphQLWsLink(
    createClient({
      url: QUERY_NODE_GRAPHQL_SUBSCRIPTION_URL,
      retryAttempts: 5,
    })
  )

  const orionLink = ApolloLink.from([delayLink, new HttpLink({ uri: ORION_GRAPHQL_URL })])
  // todo batching not working with new orion?
  // const batchedOrionLink = ApolloLink.from([
  //   delayLink,
  //   new BatchHttpLink({ uri: ORION_GRAPHQL_URL, batchMax: 10, batchInterval: 300 }),
  // ])

  // const orionSplitLink = split(
  //   ({ operationName }) => {
  //     return BATCHED_QUERIES.includes(operationName)
  //   },
  //   batchedOrionLink,
  //   orionLink
  // )

  const operationSplitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    subscriptionLink,
    // orionSplitLink
    orionLink
  )

  return new ApolloClient({ cache, link: operationSplitLink })
}

export default createApolloClient
