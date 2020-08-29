import io.vertx.core.AbstractVerticle
import io.vertx.core.Vertx
import io.vertx.core.http.WebSocket
import kotlinx.coroutines.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.*
import kotlinx.serialization.*
import kotlin.system.exitProcess

@Serializable
data class Payload(
    var action: String,
    var share: String = "",
    var price: Double = 0.0,
    var channel: String = ""
)

var numClients = 200;
var tradersFraction = 0.1;

class Client(var clientIndex: Int) : AbstractVerticle() {
    var shares = arrayOf("NFLX", "TSLA", "AMZN", "GOOG", "NVDA")
    var ws: WebSocket? = null
    var value: Double = 0.0
    var shareOfInterest = "NFLX"

    override fun start() {
        println("$clientIndex started")
        val client = vertx.createHttpClient()
        this@Client.shareOfInterest = shares[Math.random().toInt() * shares.size]
        client.webSocket(8080, "localhost", "/") { websocket ->
            run {
                if (websocket.succeeded()) {
                    val ws = websocket.result()
                    println("$clientIndex connected")
                    this@Client.ws = ws
                    ws.handler { data ->
                        val payload = Json.decodeFromString<Payload>(data.toString())
                        value = payload.price
                    }
                    ws.writeTextMessage(Json.encodeToString(Payload("sub")))
                    ws.exceptionHandler {
                        println("We did not expect any client to disconnect, exiting!")
                        exitProcess(1)
                    }
                    GlobalScope.launch {
                        this@Client.sendMsg()
                    }
                } else {
                    println("$clientIndex failed to conenct")
                }
            }
        }
    }

    suspend fun sendMsg() {
        println("$clientIndex in sendMsg")
        if (clientIndex <= numClients * tradersFraction) {
            while (true) {
                if (Math.random() < 0.5) {
                    this@Client.ws!!.writeTextMessage(
                        Json.encodeToString(
                            Payload(
                                "sell",
                                share = shareOfInterest
                            )
                        )
                    )
                } else {
                    this@Client.ws!!.writeTextMessage(
                        Json.encodeToString(
                            Payload(
                                "buy",
                                share = shareOfInterest
                            )
                        )
                    )
                }
                delay(1)
            }
        }
    }
}

fun createClient(remainingClients: Int, vertx: Vertx): Client {
    val client = Client(remainingClients)
    vertx.deployVerticle(client)
    return client
}

fun main(args: Array<String>) = run {
    val clientList: MutableList<Client> = mutableListOf()
    val vertx = Vertx.vertx()
    for (i in 0..199) {
        val client = createClient(i.toInt(), vertx)
        clientList.add(i, client)
    }
}