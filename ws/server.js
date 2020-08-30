const WebSocket = require("ws");
const { payload } = require("../utils.js");

const MAX_CLIENTS = 5000;
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

const wss = new WebSocket.Server({ port: 8080, perMessageDeflate: false });

const sendMessageTest = (ws, ms) => {
  const share = SHARE_NAMES[parseInt(Math.random() * SHARES.length)];
  setInterval(() => {
    if (Math.random() < 0.5) {
      SHARES[share] *= 1.001;
      ws.send(payload("return", share, SHARES[share]));
    } else {
      SHARES[payload.share] *= 0.999;
      ws.send(payload("return", share, SHARES[share]));
    }
    transactionsPerSecond++;
  }, ms);
};


wss.on("connection", (ws) => {
  connectedClients++;
  sendMessageTest(ws, 50);
  ws.on("message", (message) => {
    const { action, share } = JSON.parse(message);
    switch (action) {
      case "sub": {
        ws.send(payload("return", share));
        break;
      }
    }
  });
});

const broadcast = () => {
  if (wss.clients.size == MAX_CLIENTS) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload("return"));
      }
    });
  }
};

let last = Date.now();
setInterval(() => {
  transactionsPerSecond /= (Date.now() - last) * 0.001;
  console.log(`clients: ${connectedClients}, tps: ${transactionsPerSecond}`);
  transactionsPerSecond = 0;
  last = Date.now();
}, 2000);
