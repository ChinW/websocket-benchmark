import io.vertx.core.AbstractVerticle
import io.vertx.core.Vertx
import io.vertx.core.buffer.Buffer
import io.vertx.core.http.ServerWebSocket
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.coroutines.*

var shares: MutableMap<String, Double> = mutableMapOf(
    "NFLX" to 280.48,
    "TSLA" to 244.74,
    "AMZN" to 1720.26,
    "GOOG" to 1208.67,
    "NVDA" to 183.03,
)
val SHARE_NAMES = arrayOf("NFLX", "TSLA", "AMZN", "GOOG", "NVDA");
var transPerSecond = 0
var clients = 0

class Server : AbstractVerticle() {

    suspend fun messageTest(ws: ServerWebSocket, ms: Long) {
        val share = SHARE_NAMES[(Math.random() * shares.size).toInt()]
        while (true) {
            if (Math.random() < 0.5) {
                shares.put(share, shares[share]!! * 1.001)
                ws.writeTextMessage(
                    Json.encodeToString(
                        Payload(
                            "sell",
                            share = share,
                            price = shares.get(share)!!
                        )
                    )
                )
            } else {
                shares.put(share, shares[share]!! * 0.999)
                ws.writeTextMessage(
                    Json.encodeToString(
                        Payload(
                            "buy",
                            share = share,
                            price = shares.get(share)!!
                        )
                    )
                )
            }
            transPerSecond ++
            delay(ms)
        }
    }

    override fun start() {
        vertx
            .createHttpServer()
            .webSocketHandler { ws: ServerWebSocket ->
                run {
                    clients++
//                    wsSet.add(ws)
                    GlobalScope.launch {
                        this@Server.messageTest(ws, 100)
                    }
                    ws.handler { data: Buffer? ->
                        run {
                            val payload = Json.decodeFromString<Payload>(data.toString())
                            when (payload.action) {
                                "sub" -> {
                                    ws.writeTextMessage(Json.encodeToString(Payload("return")))
                                }
                            }
                            ws.writeBinaryMessage(data)
                        }
                    }
                }
            }
            .listen(8080)
    }
}

fun main(args: Array<String>) = runBlocking<Unit> {
    Vertx.vertx().deployVerticle(Server())
    var lastTime = System.currentTimeMillis()
    launch {
        while (true) {
//            wsSet.forEach { it ->
//                it.writeTextMessage(
//                    Json.encodeToString(
//                        Payload(
//                            "return",
//                            updatedAt = System.currentTimeMillis()
//                        )
//                    )
//                )
//            }
            println(
                "clients: ${clients}, tps: ${
                    transPerSecond.toDouble() / (System.currentTimeMillis() - lastTime).toDouble() * 1000
                }"
            )
            lastTime = System.currentTimeMillis()
            transPerSecond = 0
            delay(2000)
        }
    }
}