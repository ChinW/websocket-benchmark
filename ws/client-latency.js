const WebSocket = require("ws");
const _ = require("lodash");

const numClients = 5000;
let rps = 0;
const latencyTable = {};
let avgLatency = 0;

function establishConnections(clientIndex) {
  if (!clientIndex) {
    return;
  }

  let value;

  const ws = new WebSocket("ws://localhost:8080");
  ws.on("open", () => {
    establishConnections(clientIndex - 1);
  });

  ws.on("message", (data) => {
    let res = JSON.parse(data);
    latencyTable[clientIndex] = Date.now() - res.server_at;
  });

  ws.on("close", () => {
    console.log("We did not expect any client to disconnect, exiting!");
    process.exit();
  });
}
establishConnections(numClients);

const receiveMsg = () => {
  const latencies = Object.values(latencyTable);
  const size = latencies.length;
  if(size > 0) {
    console.log(`latencyTable size ${size}`);
    const avg = _.sum(latencies) / size;
    if (avgLatency === 0) {
      avgLatency = avg;
    }
    avgLatency = (avgLatency + avg) / 2;
    console.log(`avg latency: ${avgLatency} ms`);
  }
  
};

let last = Date.now();
setInterval(() => {
  receiveMsg();
  rps /= (Date.now() - last) * 0.001;
  console.log(`sent req/s: ${rps}`);
  rps = 0;
  last = Date.now();
}, 2000);
