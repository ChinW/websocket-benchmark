const WebSocket = require("ws");

const numClients = 200;
const tradersFraction = 0.1;
let rps = 0;
let shares = ["NFLX", "TSLA", "AMZN", "GOOG", "NVDA"];

function establishConnections(remainingClients) {
  if (!remainingClients) {
    return;
  }

  let value;

  const ws = new WebSocket("ws://localhost:8080");
  ws.on("open", function open() {
    let shareOfInterest = shares[parseInt(Math.random() * shares.length)];
    ws.send(JSON.stringify({ action: "sub", share: shareOfInterest }));
    if (remainingClients <= numClients * tradersFraction) {
      setInterval(() => {
        if (Math.random() < 0.5) {
          ws.send(JSON.stringify({ action: "buy", share: shareOfInterest }));
        } else {
          ws.send(JSON.stringify({ action: "sell", share: shareOfInterest }));
        }
        rps++;
      }, 1);
    }

    establishConnections(remainingClients - 1);
  });

  ws.on("message", function incoming(data) {
    let json = JSON.parse(data);
    for (let share in json) {
      value = json[share];
    }
  });

  ws.on("close", () => {
    console.log("We did not expect any client to disconnect, exiting!");
    process.exit();
  });
}

establishConnections(numClients);

let last = Date.now();
setInterval(() => {
  rps /= (Date.now() - last) * 0.001;
  console.log(`sent req/s: ${rps}`);
  rps = 0;
  last = Date.now();
}, 2000);
