const WebSocket = require("ws");

let transactionsPerSecond = 0;
let clientCount = 0;

let shares = {
  NFLX: 280.48,
  TSLA: 244.74,
  AMZN: 1720.26,
  GOOG: 1208.67,
  NVDA: 183.03,
};

const wss = new WebSocket.Server({
  port: 8080,
  perMessageDeflate: false
});

wss.on("connection", (ws) => {
  clientCount++;
  ws.on("message", (message) => {
    let json = JSON.parse(message);
    switch (json.action) {
      case "sub": {
        ws.send(
          JSON.stringify({
            channel: "shares/" + json.share + "/value",
          })
        );
        break;
      }
      case "buy": {
        shares[json.share] *= 1.001;
        ws.send(
          JSON.stringify({
            channel: "shares/" + json.share + "/value",
            [json.share]: shares[json.share],
          })
        );
        transactionsPerSecond++;
        break;
      }
      case "sell": {
        shares[json.share] *= 0.999;
        ws.send(
          JSON.stringify({
            channel: "shares/" + json.share + "/value",
            [json.share]: shares[json.share],
          })
        );
        transactionsPerSecond++;
        break;
      }
    }
  });
});

let last = Date.now();
setInterval(() => {
  transactionsPerSecond /= (Date.now() - last) * 0.001;
  console.log(`clients: ${clientCount}, tx/second: ${transactionsPerSecond}`);
  transactionsPerSecond = 0;
  last = Date.now();
}, 2000);
