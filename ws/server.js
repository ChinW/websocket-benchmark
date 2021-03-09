const http = require("http");
const url = require("url");
const WebSocket = require("ws");
const { payload } = require("../utils.js");
const promClient = require("prom-client");

const register = new promClient.Registry();
register.setDefaultLabels({
  app: "myApp",
});
promClient.collectDefaultMetrics({ register });
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds_custom',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
})
register.registerMetric(httpRequestDurationMicroseconds)

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

const authenticate = (request, cb) => {
  console.log("request.headers", request.headers);
  cb(false, true);
};

const server = http.createServer(async (req, res) => {
  const route = url.parse(req.url).pathname;
  const end = httpRequestDurationMicroseconds.startTimer()
  if (route === "/metrics") {
    res.setHeader("Content-Type", register.contentType);
    res.end(await register.metrics());
  }
  end({ route, code: res.statusCode, method: req.method })
});
const wss = new WebSocket.Server({ noServer: true, perMessageDeflate: false });

server.on("upgrade", (request, socket, head) => {
  authenticate(request, (err, client) => {
    if (err || !client) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, 1, 2, 3, 4, 5);
    });
  });
});

wss.on("connection", (ws, ...args) => {
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

server.listen(8080);
