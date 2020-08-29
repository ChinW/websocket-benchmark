import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.coroutines.*
import org.vertx.java.platform.Verticle;

var shares: MutableMap<String, Double> = mutableMapOf(
    "NFLX" to 280.48,
    "TSLA" to 244.74,
    "AMZN" to 1720.26,
    "GOOG" to 1208.67,
    "NVDA" to 183.03,
)

var transPerSecond = 0
var clients = 0

class Server : Verticle() {
    override fun start() {
        this.timer()
        vertx
            .createHttpServer()
            .websocketHandler { ws ->
                run {
                    clients++
                    ws.dataHandler { data ->
                        run {
                            val payload = Json.decodeFromString<Payload>(data.toString())
                            when (payload.action) {
                                "sub" -> {
                                    ws.writeTextFrame(
                                        Json.encodeToString(
                                            Payload(
                                                "shares/${payload.shareName}/value",
                                                "return"
                                            )
                                        )
                                    )
                                }
                                "buy" -> {
                                    transPerSecond++
                                    val share = shares.get(payload.shareName)
                                    if (share != null) {
                                        shares.put(payload.shareName, share * 1.001)
                                    }
                                    ws.writeTextFrame(
                                        Json.encodeToString(
                                            Payload(
                                                "shares/${payload.shareName}/value",
                                                "return",
                                                price = shares.get(payload.shareName)!!
                                            )
                                        )
                                    )
                                }
                                "sell" -> {
                                    transPerSecond++
                                    val share = shares.get(payload.shareName)
                                    if (share != null) {
                                        shares.put(payload.shareName, share * 0.999)
                                    }
                                    ws.writeTextFrame(
                                        Json.encodeToString(
                                            Payload(
                                                "shares/${payload.shareName}/value",
                                                "return",
                                                price = shares.get(payload.shareName)!!
                                            )
                                        )
                                    )
                                }
                            }
                        }
                    }
                }
            }
            .listen(8080, "localhost")
    }

    fun timer() {
        var lastTime = System.currentTimeMillis()
        GlobalScope.launch {
            while (true) {
                println(
                    "clients: ${clients}, tx/second: ${
                        transPerSecond.toDouble() / (System.currentTimeMillis() - lastTime).toDouble() * 1000
                    }"
                )
                lastTime = System.currentTimeMillis()
                transPerSecond = 0
                delay(2000)
            }
        }
    }
}

//fun main(args: Array<String>) = runBlocking<Unit> {
//    val server = Server()
//    server.start()
//    var lastTime = System.currentTimeMillis()
//    launch {
//        while (true) {
//            println(
//                "clients: ${clients}, tx/second: ${
//                    transPerSecond.toDouble() / (System.currentTimeMillis() - lastTime).toDouble() * 1000
//                }"
//            )
//            lastTime = System.currentTimeMillis()
//            transPerSecond = 0
//            delay(2000)
//        }
//    }
//}