const WebSocket = require("ws");

const numClients = 200;
const tradersFraction = 0.1;

let shares = ["NFLX", "TSLA", "AMZN", "GOOG", "NVDA"];

function establishConnections(remainingClients) {
  if (!remainingClients) {
    return;
  }

  /* Current value of our share */
  let value;

  const ws = new WebSocket("ws://localhost:8888");
  ws.on("open", function open() {
    let shareOfInterest = shares[parseInt(Math.random() * shares.length)];

    ws.send(JSON.stringify({ event: 'events', data: { 
      action: "sub", share: shareOfInterest 
    }}));

    /* Is this client going to be an active trader, or a passive watcher? */
    if (remainingClients <= numClients * tradersFraction) {
      /* If so, then buy and sell shares every 1ms, driving change in the stock market */
      setInterval(() => {
        /* For simplicity we just randomly buy/sell */
        if (Math.random() < 0.5) {
          ws.send(JSON.stringify({  event: 'events',  data: {action: "buy", share: shareOfInterest }}));
        } else {
          ws.send(JSON.stringify({  event: 'events', data: {action: "sell", share: shareOfInterest }}));
        }
      }, 1);
    }

    establishConnections(remainingClients - 1);
  });

  ws.on("message", function incoming(data) {
    let json = JSON.parse(data);

    /* Keep track of our one share value (even though current strategy doesn't care for value) */
    for (let share in json.data) {
      value = json[share];
    }
  });

  ws.on("close", () => {
    console.log("We did not expect any client to disconnect, exiting!");
    process.exit();
  });
}

establishConnections(numClients);
