const { ApolloServer, gql, PubSub } = require("apollo-server");

const MAX_CLIENTS = 1;
const SHARES = {
  NFLX: 280.48,
  TSLA: 244.74,
  AMZN: 1720.26,
  GOOG: 1208.67,
  NVDA: 183.03,
};
const SHARE_NAMES = ["NFLX", "TSLA", "AMZN", "GOOG", "NVDA"];
let transactionsPerSecond = 0;
let connectedClients = 0;
const pubsub = new PubSub();
const POST_EVENT = "POST_EVENT";

const payload = (action, share, price = 0, updatedAt = Date.now()) => {
  const result = {
      postEvent: {
        action,
        share,
        price,
        updatedAt,
      }
  };
  return result;
};

const sendMessageTest = (clientIndex, ms) => {
  const share = SHARE_NAMES[parseInt(Math.random() * SHARE_NAMES.length)];
  setInterval(() => {
    if (Math.random() < 0.5) {
      SHARES[share] *= 1.001;
      pubsub.publish(`${POST_EVENT}`, payload("return", share, SHARES[share]));
    } else {
      SHARES[payload.share] *= 0.999;
      pubsub.publish(`${POST_EVENT}`, payload("return", share, SHARES[share]));
    }
    transactionsPerSecond++;
  }, ms);
};

const typeDefs = gql`
  type Post {
    action: String
    share: String
    price: Float
    updatedAt: Float
  }

  type Query {
    post: [Post]
  }

  type Subscription {
    postEvent: Post
  }
`;

const resolvers = {
  Query: {
    post: () => [],
  },
  Subscription: {
    postEvent: {
      subscribe: (parent, args, context, info) => {
        const { clientIndex } = context.connection.variables;
        sendMessageTest(clientIndex, 50);
        return pubsub.asyncIterator([`${POST_EVENT}`]);
      },
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: (connectionParams, ws) => {
      connectedClients++;
      //   sendMessageTest(ws, 50);
      //   ws.on("message", (message) => {
      //     const { action, share } = JSON.parse(message);
      //     switch (action) {
      //       case "sub": {
      //         ws.send(payload("return", share));
      //         break;
      //       }
      //     }
      //   });
    },
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Apollo server ready at ${url}`);
  console.log(`Apollo subscriptionsUrl ready at ${subscriptionsUrl}`);
});

let last = Date.now();
setInterval(() => {
  transactionsPerSecond /= (Date.now() - last) * 0.001;
  console.log(`clients: ${connectedClients}, tps: ${transactionsPerSecond}`);
  transactionsPerSecond = 0;
  last = Date.now();
}, 2000);
