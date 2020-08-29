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

var transPerSecond = 0
var clients = 0

class Server : AbstractVerticle() {
    override fun start() {
        vertx
            .createHttpServer()
            .webSocketHandler { ws: ServerWebSocket ->
                run {
                    clients++
                    ws.handler { data: Buffer? ->
                        run {
                            val payload = Json.decodeFromString<Payload>(data.toString())
                            when(payload.action) {
                                "sub" -> {
                                    ws.writeTextMessage(Json.encodeToString(Payload(
                                        "shares/${payload.shareName}/value",
                                        "return"
                                    )))
                                }
                                "buy" -> {
                                    val share = shares.get(payload.shareName)
                                    if ( share != null) {
                                        shares.put(payload.shareName, share * 1.001)
                                    }
                                    ws.writeTextMessage(Json.encodeToString(Payload(
                                        "shares/${payload.shareName}/value",
                                        "return",
                                        price = shares.get(payload.shareName)!!
                                    )))
                                    transPerSecond ++
                                }
                                "sell" -> {
                                    val share = shares.get(payload.shareName)
                                    if ( share != null) {
                                        shares.put(payload.shareName, share * 0.999)
                                    }
                                    ws.writeTextMessage(Json.encodeToString(Payload(
                                        "shares/${payload.shareName}/value",
                                        "return",
                                        price = shares.get(payload.shareName)!!
                                    )))
                                    transPerSecond ++
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

fun main(args: Array<String>) =  runBlocking<Unit>  {
    Vertx.vertx().deployVerticle(Server())
    var lastTime = System.currentTimeMillis()
    launch {
        while(true) {
            println("clients: ${clients}, tx/second: ${
                transPerSecond.toDouble() / (System.currentTimeMillis() - lastTime).toDouble() * 1000
            }")
            lastTime = System.currentTimeMillis()
            transPerSecond = 0
            delay(2000)
        }
    }
}