# Test scope and environment

- Test for:
    - NodeJS: ws, socket.io, uwebsocket
    - Java: VertX (which uses Netty)
- System:
```
MacBook Pro (13-inch, 2020, Four Thunderbolt 3 ports)
2 GHz Quad-Core Intel Core i5
16 GB 3733 MHz LPDDR4X
Intel Iris Plus Graphics 1536 MB
```
- 5000 client connections, sending msg to server per 500ms each
- Each line in log is unders 2 seconds inverval

# To Run

For vertx2: `vertx run Server -cp "classes:vertx2-1.0-SNAPSHOT.jar" `

# Resutls

### ws

Server: 
- CPU 100%
- completed in seconds
- send message to client per 50ms

```
clients: 0, tps: 0
clients: 1522, tps: 13406.5
clients: 2731, tps: 41965.01749125437
clients: 3618, tps: 62558.603491271824
clients: 4221, tps: 75828.58570714643
clients: 4572, tps: 80643.14115308151
clients: 4844, tps: 86410.76769690926
clients: 5000, tps: 89313.71571072319
clients: 5000, tps: 91170.90184354757
clients: 5000, tps: 72340.14598540145
clients: 5000, tps: 82267.92828685259
clients: 5000, tps: 88514.94023904382
clients: 5000, tps: 87901.93164933135
clients: 5000, tps: 88450.0998003992
clients: 5000, tps: 89606.9825436409
clients: 5000, tps: 84441.67497507477
```

Client (via NodeJS):
- CPU: 100%

```
TPS: 9828.009828009828
Average latency: 9.525885550821567 ms
TPS: 9893.44672336168
Average latency: 5.686742775410783 ms
TPS: 9980.49024512256
Average latency: 3.5819713877053916 ms
TPS: 9539.269634817409
Average latency: 2.258685693852696 ms
TPS: 9990.009990009989
Average latency: 1.637942846926348 ms
TPS: 7245.835026412028
Average latency: 14.647771423463173 ms
TPS: 10005.002501250625
Average latency: 7.350285711731586 ms
TPS: 10005.002501250625
Average latency: 3.697042855865793 ms
```

### Vert.X v3.9.2 

Server: 
- CPU 130%
- send message to client per `100ms` (as 50ms it makes my computer die)
- takes more than 3mins (each log is under 2 seconds interval), dropped then

```
clients: 0, tps: 0.0
clients: 0, tps: 0.0
clients: 0, tps: 0.0
clients: 0, tps: 0.0
clients: 0, tps: 0.0
clients: 0, tps: 0.0
clients: 0, tps: 0.0
clients: 377, tps: 874.1887169246131
clients: 993, tps: 5707.730673316708
clients: 1769, tps: 13499.750374438343
clients: 2593, tps: 21835.164835164836
clients: 3003, tps: 27957.04295704296
clients: 3008, tps: 28956.54345654346
clients: 3166, tps: 30418.6626746507
clients: 3263, tps: 31657.51372940589
clients: 3453, tps: 33087.86819770344
clients: 3543, tps: 34520.718921617576
clients: 3620, tps: 35061.0
clients: 3656, tps: 35845.30938123753
clients: 3678, tps: 36177.41129435282
clients: 3707, tps: 36575.5
clients: 3730, tps: 36724.637681159424
clients: 3749, tps: 36628.18590704648
clients: 3769, tps: 35519.96007984032
clients: 3789, tps: 37355.322338830585
clients: 3807, tps: 36828.67132867133
clients: 3823, tps: 36764.0
clients: 3840, tps: 37955.0
clients: 3859, tps: 38223.0
clients: 3878, tps: 37930.5
clients: 3889, tps: 38040.979510244884
clients: 3902, tps: 38278.582126809786
clients: 3907, tps: 38161.5
clients: 3911, tps: 38794.10294852574 // line 34
...
clients: 3951, tps: 37222.27772227772
clients: 3952, tps: 38845.23215177235
clients: 3952, tps: 37233.033932135724 //line 78
```

Client (via NodeJS):
- CPU: 151%

```
TPS: 9055.944055944055
Average latency: 33895.241751952984 ms
TPS: 9043.5
Average latency: 34512.603531743174 ms
TPS: 9054.5
Average latency: 35110.37179017024 ms
TPS: 9053.5
Average latency: 35783.786292699435 ms
TPS: 9056
Average latency: 36455.58598929206 ms
TPS: 9058
Average latency: 37053.6221686743 ms
TPS: 9058
Average latency: 37630.76835023821 ms
TPS: 9059.5
Average latency: 38157.07903049557 ms
```

### socket.io

**node cpu: >120%, die after 20s**

```
clients: 200, tx/second: 3160.2962255136167
clients: 200, tx/second: 2765.8108500145054
clients: 200, tx/second: 4459.919839679359
```

### uwebsocket

node cpu: 100%

```
clients: 200, tx/second: 7340
clients: 400, tx/second: 10720
clients: 400, tx/second: 8712.28771228771
clients: 400, tx/second: 7911.08891108891
```
