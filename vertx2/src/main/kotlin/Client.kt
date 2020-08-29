import kotlinx.coroutines.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.*
import kotlinx.serialization.*
import kotlin.system.exitProcess
import org.vertx.java.core.http.WebSocket;
import org.vertx.java.platform.Verticle;

var numClients = 200;
var tradersFraction = 0.1;

class Client() : Verticle() {
    var clientIndex: Int = 0
    var shares = arrayOf("NFLX", "TSLA", "AMZN", "GOOG", "NVDA")
    var ws: WebSocket? = null
    var value: Double = 0.0
    var shareOfInterest = "NFLX"

    fun createClient(remainingClients: Int): Client {
        val instance = Client()
        instance.setVertx(this.vertx)
        instance.setContainer(this.container)
        instance.clientIndex = remainingClients
        instance.run()
        return instance
    }

    fun run() {
        println("$clientIndex started")
        val client = vertx.createHttpClient()
        this@Client.shareOfInterest = shares[Math.random().toInt() * shares.size]
        client.setHost("localhost").setPort(8080).connectWebsocket("/") { websocket ->
            run {
                val ws = websocket
                println("$clientIndex connected")
                this@Client.ws = ws
                ws.dataHandler { data ->
                    val payload = Json.decodeFromString<Payload>(data.toString())
                    value = payload.price
                }
                ws.writeTextFrame(Json.encodeToString(Payload("test", "sub")))
                ws.exceptionHandler {
                    println("We did not expect any client to disconnect, exiting!")
                    exitProcess(1)
                }
                GlobalScope.launch {
                    this@Client.sendMsg()
                }
            }
        }
    }

    override fun start() {
        println("start")
        val clientList: MutableList<Client> = mutableListOf()
        for (i in 0..199) {
            val client = createClient(i)
            clientList.add(i, client)
        }
    }

    suspend fun sendMsg() {
        println("$clientIndex in sendMsg")
        if (clientIndex <= numClients * tradersFraction) {
            while (true) {
                if (Math.random() < 0.5) {
                    this@Client.ws!!.writeTextFrame(
                        Json.encodeToString(
                            Payload(
                                "test",
                                "sell",
                                shareName = shareOfInterest
                            )
                        )
                    )
                } else {
                    this@Client.ws!!.writeTextFrame(
                        Json.encodeToString(
                            Payload(
                                "test",
                                "buy",
                                shareName = shareOfInterest
                            )
                        )
                    )
                }
                delay(1)
            }
        }
    }
}
