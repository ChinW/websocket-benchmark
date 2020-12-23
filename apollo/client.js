const WebSocket = require("ws");
const { SubscriptionClient, addGraphQLSubscriptions } = require("subscriptions-transport-ws");
const { ApolloClient } = require("apollo-client");
const { InMemoryCache } = require("apollo-cache-inmemory");
const { gql } = require("@apollo/client");
const _ = require("lodash");
const { payload } = require("../utils.js");

const GRAPHQL_ENDPOINT = "ws://localhost:4000/graphql";
const TOTAL_CLIENTS = 3000;
const ACTIVE_CLIETNS = 5000;
const SHARES = ["NFLX", "TSLA", "AMZN", "GOOG", "NVDA"];
const LATENCY_RESULTS = [];
let AVG_LATENCY = 0;
let transactions = 0;

const sendMessageTest = (clientIndex, ws, ms) => {
  const share = SHARES[parseInt(Math.random() * SHARES.length)];
  ws.send(payload("sub", share));
  if (clientIndex < ACTIVE_CLIETNS) {
    setInterval(() => {
      if (Math.random() < 0.5) {
        ws.send(payload("buy", share));
      } else {
        ws.send(payload("sell", share));
      }
      transactions = transactions + 1;
    }, ms);
  }
};

const establishConnections = (clientIndex) => {
  if (clientIndex >= TOTAL_CLIENTS) {
    return;
  }
  let sharePrice = 0;
  const client = new SubscriptionClient(
    GRAPHQL_ENDPOINT,
    {
      reconnect: true,
    },
    WebSocket
  );

  const apolloClient = new ApolloClient({
    link: client,
    cache: new InMemoryCache(),
  });

  apolloClient
    .subscribe({
      query: gql`
        subscription onPostEvent {
          postEvent {
            action
            share
            price
            updatedAt
          }
        }
      `,
      variables: {
        clientIndex: clientIndex
      },
    })
    .subscribe({
      start() {
        console.log("connected");
        // sendMessageTest(clientIndex, ws, 500);
        
      },
      next(res) {
        sharePrice = res.data.postEvent.price;
        LATENCY_RESULTS[clientIndex] = Date.now() - res.data.postEvent.updatedAt;
        transactions++;
      },
      error(errorValue) {
        console.log("We did not expect any client to disconnect, exiting!");
        console.log(errorValue);
        process.exit();
      },
    });
    establishConnections(clientIndex + 1);
};

const latencyLog = () => {
  const size = LATENCY_RESULTS.length;
  if (size > 0) {
    const avg = _.sum(LATENCY_RESULTS) / size;
    if (AVG_LATENCY === 0) {
      AVG_LATENCY = avg;
    }
    AVG_LATENCY = (AVG_LATENCY + avg) / 2;
    console.log(`Average latency: ${AVG_LATENCY} ms`);
  }
};

const tpsLog = (durationMs) => {
  const tps = transactions / (durationMs * 0.001);
  console.log(`TPS: ${tps}`);
  transactions = 0;
};

const monitor = () => {
  let last = Date.now();
  setInterval(() => {
    tpsLog(Date.now() - last);
    latencyLog();
    last = Date.now();
  }, 2000);
};

establishConnections(0);
monitor();
