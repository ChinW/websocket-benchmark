# Test result

System:
```
MacBook Pro (13-inch, 2020, Four Thunderbolt 3 ports)
2 GHz Quad-Core Intel Core i5
16 GB 3733 MHz LPDDR4X
Intel Iris Plus Graphics 1536 MB
```

Each termnial is aiming to run 200 client connections.

### ws

**able to run 4 termnials!!**

```
# 1 terminal
Transactions per second: 13886.611338866114, here are the curret shares:
{
  NFLX: 437.1223171406717,
  TSLA: 456.961027490464,
  AMZN: 4261.093117452719,
  GOOG: 257.07999752338515,
  NVDA: 129.07510307757653
}

node cpu: 50%

# 4 terminals

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
# 1 terminal

Transactions per second: 7340, here are the curret shares:
{
  NFLX: 187.94536025799889,
  TSLA: 220.0134946526879,
  AMZN: 1749.0660218384803,
  GOOG: 1688.5973105484613,
  NVDA: 156.66073122908176
}

node cpu: 100%

# 2 terminals
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

**Each terminal can only open up to 190 connections**

```
//terminal #1:
187 started
188 started
189 started
190 started
191 started
191 failed to conenct
We did not expect any client to disconnect, exiting!
90 connected
67 connected
47 connected
102 connected
```

## 1 terminal 

```
transactions: 15499 req/s
transactions: 15097 req/s
transactions: 14833 req/s
transactions: 15798 req/s
transactions: 14953 req/s
```

## 2 instnaces

Make my mac died every time...

```
transactions: 16213 req/s
transactions: 15717 req/s
transactions: 15582 req/s
transactions: 10231 req/s
transactions: 38092 req/s
transactions: 13396 req/s
transactions: 0 req/s
transactions: 0 req/s
```

```
// from terminal log
java.lang.NoClassDefFoundError: Could not initialize class java.time.zone.ZoneRulesProvider
	at java.base/java.time.ZoneRegion.ofId(ZoneRegion.java:120)
	at java.base/java.time.ZoneId.of(ZoneId.java:408)
	....
Exception in thread "main" java.lang.IllegalStateException: failed to create a child event loop
	at io.netty.util.concurrent.MultithreadEventExecutorGroup.<init>(MultithreadEventExecutorGroup.java:88)
	at io.netty.util.concurrent.MultithreadEventExecutorGroup.<init>(MultithreadEventExecutorGroup.java:58)
```