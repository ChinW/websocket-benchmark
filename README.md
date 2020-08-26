# Test result

### ws

**able to run 4 instances!!**

```
# 1 instance
Transactions per second: 13886.611338866114, here are the curret shares:
{
  NFLX: 437.1223171406717,
  TSLA: 456.961027490464,
  AMZN: 4261.093117452719,
  GOOG: 257.07999752338515,
  NVDA: 129.07510307757653
}

node cpu: 50%

# 4 instances

Transactions per second: 71886.0227954409, here are the curret shares:
{
  NFLX: 182.87433194656498,
  TSLA: 1022.9054384145393,
  AMZN: 560.8868971120006,
  GOOG: 39.01386533078053,
  NVDA: 127.94287310162221
}

Transactions per second: 70142.47150569885, here are the curret shares:
{
  NFLX: 224.0494447452168,
  TSLA: 930.0257595240352,
  AMZN: 390.7555392111635,
  GOOG: 119.73092859061563,
  NVDA: 211.4590822967352
}

Transactions per second: 64547.43576926922, here are the curret shares:
{
  NFLX: 199.38162742102753,
  TSLA: 1243.7519691091143,
  AMZN: 219.98226822017372,
  GOOG: 86.10292130285285,
  NVDA: 212.1739601913941
}

node cpu: 70 - 100%
```

### socket.io

**die after 20s**

```
Transactions per second: 3160.2962255136167, here are the curret shares:
{
  NFLX: 291.1087571528243,
  TSLA: 244.74,
  AMZN: 1788.6559198253308,
  GOOG: 1187.1239999812924,
  NVDA: 174.6441644522588
}

Transactions per second: 2765.8108500145054, here are the curret shares:
{
  NFLX: 266.70212617623343,
  TSLA: 244.74,
  AMZN: 1886.6456659331966,
  GOOG: 1463.9000516492076,
  NVDA: 169.91079195983414
}

Transactions per second: 4459.919839679359, here are the curret shares:
{
  NFLX: 279.7711420327037,
  TSLA: 244.74,
  AMZN: 1886.6456659331966,
  GOOG: 1458.7379458036958,
  NVDA: 172.04241585307955
}

node cpu: >120%
```

## uwebsocket

```
# 1 instance

Transactions per second: 7340, here are the curret shares:
{
  NFLX: 187.94536025799889,
  TSLA: 220.0134946526879,
  AMZN: 1749.0660218384803,
  GOOG: 1688.5973105484613,
  NVDA: 156.66073122908176
}

node cpu: 100%

# 2 instances
Transactions per second: 10720, here are the curret shares:
{
  NFLX: 138.2916936187233,
  TSLA: 216.42452533864503,
  AMZN: 1415.6048107890945,
  GOOG: 1810.855182392591,
  NVDA: 199.2807423671192
}

Transactions per second: 8712.28771228771, here are the curret shares:
{
  NFLX: 134.77377978096976,
  TSLA: 211.10800308317812,
  AMZN: 1506.3377720439512,
  GOOG: 1903.744481874943,
  NVDA: 189.77621833208994
}

Transactions per second: 7911.08891108891, here are the curret shares:
{
  NFLX: 146.33875807939432,
  TSLA: 203.88943339334205,
  AMZN: 1549.454444575022,
  GOOG: 1954.0658149383273,
  NVDA: 179.2964463232948
}

node cpu: 100%

```

# Vert.X

1 Server, 8 Clients, no connection drop

```
// 1 instance 
transactions: 1807 req/s
transactions: 2559 req/s
transactions: 2562 req/s
transactions: 2564 req/s
transactions: 2561 req/s
transactions: 2572 req/s

// 8 instances
transactions: 13902 req/s
transactions: 12920 req/s
transactions: 20967 req/s
transactions: 12504 req/s
transactions: 10136 req/s
transactions: 18372 req/s
transactions: 19506 req/s
transactions: 22219 req/s
transactions: 21095 req/s
transactions: 18889 req/s
transactions: 20714 req/s
transactions: 19929 req/s
transactions: 20336 req/s
transactions: 20090 req/s
transactions: 11139 req/s
transactions: 10888 req/s
transactions: 22506 req/s
transactions: 30698 req/s
transactions: 53726 req/s
transactions: 21483 req/s
transactions: 21422 req/s
transactions: 21746 req/s
transactions: 21190 req/s
transactions: 21425 req/s
transactions: 12889 req/s
transactions: 22996 req/s
```