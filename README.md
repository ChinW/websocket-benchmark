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
- 10% clients are sending req per 1ms, i.e. if there are 200 clients connected, 20 clients are sending reqs per ms
- log per 2 seconds

### ws

client nodes cpu: ~30%

```
clients: 200, tx/second: 14370
clients: 200, tx/second: 14455
clients: 200, tx/second: 15585
clients: 200, tx/second: 14836.418209104551
clients: 200, tx/second: 15843.078460769617
clients: 800, tx/second: 77924.0379810095
clients: 800, tx/second: 73444.77761119441
clients: 800, tx/second: 74230.5
clients: 800, tx/second: 75061.93806193805
clients: 800, tx/second: 73322.5162256615
clients: 957, tx/second: 72438 // add more clients at this second
clients: 1000, tx/second: 79902.5974025974
clients: 1000, tx/second: 87271.95608782435
clients: 1000, tx/second: 83435.94836146971
clients: 1000, tx/second: 88965.55167249126
clients: 1000, tx/second: 90353.82308845577
clients: 1200, tx/second: 97116.34756995582
clients: 1200, tx/second: 103316.86626746507
clients: 1200, tx/second: 99527.65321375187
clients: 1200, tx/second: 100461.95922426652
clients: 1200, tx/second: 93544.41117764471
clients: 1200, tx/second: 100236.5165759525
clients: 1202, tx/second: 93156.92153923039
clients: 1222, tx/second: 95659
clients: 1237, tx/second: 93074.8502994012
clients: 1261, tx/second: 94069.56521739131
clients: 1312, tx/second: 99765.61719140431
clients: 1368, tx/second: 97868.63136863135
clients: 1450, tx/second: 100146.47467725918
clients: 1524, tx/second: 99494.26433915213
clients: 1558, tx/second: 97112.14953271029
clients: 1563, tx/second: 109997.01492537312
clients: 1566, tx/second: 103800.1808318264
clients: 1567, tx/second: 108891.80902321507
clients: 1569, tx/second: 105133.66336633664
clients: 1570, tx/second: 106190.92872570195
clients: 1571, tx/second: 104024.52316076294
clients: 1572, tx/second: 110514.38240270727
clients: 1573, tx/second: 103524.01331431288
clients: 1573, tx/second: 108890.29535864979
clients: 1574, tx/second: 106147.56097560975
clients: 1575, tx/second: 108739.79213066073
clients: 1575, tx/second: 104334.34343434343
clients: 1576, tx/second: 108182.79901356349
clients: 1576, tx/second: 98393.45887016847
clients: 1577, tx/second: 108777.45383867834
clients: 1577, tx/second: 97900.80885483183
clients: 1577, tx/second: 105977.8963414634
clients: 1578, tx/second: 105430.28758645795
clients: 1578, tx/second: 110480.88235294117
clients: 1578, tx/second: 104346.80706521739
clients: 1579, tx/second: 108727.79081461615
clients: 1579, tx/second: 103096.62261380322
clients: 1579, tx/second: 96951.6775162744
clients: 1580, tx/second: 93642.80125195617
clients: 1580, tx/second: 92114.94928707923
clients: 1580, tx/second: 94232.14703816436
clients: 1581, tx/second: 92839.09958833319  // dies here
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

### Vert.X v3.9.2

```
clients: 200, tx/second: 16224.550898203592
clients: 200, tx/second: 15539.650872817954
clients: 200, tx/second: 16038.902743142145
clients: 200, tx/second: 16152.847152847151
clients: 200, tx/second: 16463.5
clients: 200, tx/second: 16285.785536159601
clients: 200, tx/second: 16387.225548902195
clients: 200, tx/second: 16219.171243135295
clients: 400, tx/second: 18999.5
clients: 400, tx/second: 34268.0
clients: 400, tx/second: 32361.77644710579
clients: 400, tx/second: 34642.17891054473
clients: 400, tx/second: 33277.5
clients: 400, tx/second: 33988.52867830424
clients: 400, tx/second: 33036.92614770459
clients: 600, tx/second: 40352.14785214785
clients: 600, tx/second: 53783.71628371628
clients: 600, tx/second: 55876.5
clients: 600, tx/second: 53210.5
clients: 600, tx/second: 51557.442557442555
clients: 600, tx/second: 46776.611694152925
clients: 800, tx/second: 49423.364952571144
clients: 800, tx/second: 71616.95760598504
clients: 800, tx/second: 68486.0
clients: 800, tx/second: 71874.5
clients: 800, tx/second: 75668.16367265469
clients: 800, tx/second: 75509.99000999001
clients: 800, tx/second: 75064.43556443557
clients: 800, tx/second: 74875.31172069824
clients: 800, tx/second: 75397.20558882235
clients: 800, tx/second: 73899.2015968064
clients: 800, tx/second: 71554.44555444556
clients: 800, tx/second: 73185.12974051895
clients: 800, tx/second: 67642.39401496259
clients: 800, tx/second: 53806.78981527709
clients: 1000, tx/second: 71205.79420579421
clients: 1000, tx/second: 86232.03592814371
clients: 1000, tx/second: 88658.35411471322
clients: 1000, tx/second: 82250.74925074926
clients: 1000, tx/second: 91653.86533665836
clients: 1000, tx/second: 91234.26573426573
clients: 1000, tx/second: 90478.80299251871
clients: 1000, tx/second: 77575.3493013972
clients: 1000, tx/second: 93541.41716566867
clients: 1000, tx/second: 91055.44455544456
clients: 1000, tx/second: 62859.64035964036
clients: 1000, tx/second: 85215.60780390195
clients: 1000, tx/second: 64566.0
clients: 1000, tx/second: 56672.32767232767
clients: 1000, tx/second: 70428.8567149276
clients: 1200, tx/second: 71587.61857214179
clients: 1200, tx/second: 79889.66550174737
clients: 1200, tx/second: 91149.0
clients: 1200, tx/second: 56061.0
clients: 1200, tx/second: 71107.44627686156
clients: 1200, tx/second: 84885.0
clients: 1200, tx/second: 91387.30634682659
clients: 1200, tx/second: 82824.26360459311
clients: 1200, tx/second: 28857.571214392803
clients: 1200, tx/second: 0.0 // all connections drop
clients: 1200, tx/second: 0.0
clients: 1200, tx/second: 0.0
clients: 1200, tx/second: 0.0
clients: 1200, tx/second: 0.0
clients: 1200, tx/second: 0.0
clients: 1200, tx/second: 0.0 // my computer dies

```

