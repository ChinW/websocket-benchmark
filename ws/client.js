const WebSocket = require("ws");
const _ = require("lodash");
const { payload } = require("../utils.js");

const TOTAL_CLIENTS = 5000;
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
  const ws = new WebSocket("ws://localhost:8080");
  ws.on("open", function open() {
    sendMessageTest(clientIndex, ws, 500);
    establishConnections(clientIndex + 1);
  });

  ws.on("message", (data) => {
    const res = JSON.parse(data);
    sharePrice = res.price;
    LATENCY_RESULTS[clientIndex] = Date.now() - res.updatedAt;
  });

  ws.on("close", () => {
    console.log("We did not expect any client to disconnect, exiting!");
    process.exit();
  });
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
