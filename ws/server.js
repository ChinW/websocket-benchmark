const WebSocket = require("ws");

/* We measure transactions per second server side */
let transactionsPerSecond = 0;

/* Share valuations */
let shares = {
  NFLX: 280.48,
  TSLA: 244.74,
  AMZN: 1720.26,
  GOOG: 1208.67,
  NVDA: 183.03,
};

const wss = new WebSocket.Server({
  port: 8888,
});

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    let json = JSON.parse(message);
    switch (json.action) {
      case "sub": {
        /* Subscribe to the share's value stream */
        ws.send(JSON.stringify({
            channel: "shares/" + json.share + "/value",
          }));
        break;
      }
      case "buy": {
        transactionsPerSecond++;

        /* For simplicity, shares increase 0.1% with every buy */
        shares[json.share] *= 1.001;

        /* Value of share has changed, update subscribers */
        ws.send(
          JSON.stringify({
            channel: "shares/" + json.share + "/value",
            [json.share]: shares[json.share],
          })
        );
        break;
      }
      case "sell": {
        transactionsPerSecond++;
        /* For simplicity, shares decrease 0.1% with every sale */
        shares[json.share] *= 0.999;
        ws.send(
          JSON.stringify({
            channel: "shares/" + json.share + "/value",
            [json.share]: shares[json.share],
          })
        );
        break;
      }
    }
  });
});

/* Print transactions per second */
let last = Date.now();
setInterval(() => {
  transactionsPerSecond /= (Date.now() - last) * 0.001;
  console.log("Transactions per second: " + transactionsPerSecond + ", here are the curret shares:");
  console.log(shares);
  console.log("");
  transactionsPerSecond = 0;
  last = Date.now();
}, 10000);
