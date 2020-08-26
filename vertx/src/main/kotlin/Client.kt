import io.vertx.core.AbstractVerticle
import io.vertx.core.Vertx
import io.vertx.core.buffer.Buffer
import io.vertx.core.http.WebSocket
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.*
import kotlinx.serialization.*
import kotlin.system.exitProcess

@Serializable
data class Payload(
    var channel: String,
    var action: String,
    var shareName: String = "",
    var price: Double = 0.0
)
var numClients = 200;
var tradersFraction = 0.1;

class Client(var clientIndex: Int) : AbstractVerticle() {
    var shares = arrayOf("NFLX", "TSLA", "AMZN", "GOOG", "NVDA")
    var ws: WebSocket? = null
    var value: Double = 0.0
    var shareOfInterest = "NFLX"

    override fun start() = runBlocking {
        val client = vertx.createHttpClient()
        this@Client.shareOfInterest = shares[Math.random().toInt() * shares.size]
        client.webSocket(8080, "localhost", "/") { websocket ->
                var ws = websocket.result()
                this@Client.ws = ws
                ws.handler { data ->
                    val payload = Json.decodeFromString<Payload>(data.toString())
                    value = payload.price
                }
                ws.writeTextMessage(Json.encodeToString(Payload("test", "sub")))
                ws.exceptionHandler {
                    println("We did not expect any client to disconnect, exiting!")
                    exitProcess(1)
                }
            }

    }

    fun sendMsg() = runBlocking {
        launch {
            while(true) {
                if(this@Client.ws != null) {
                   if(clientIndex <= numClients * tradersFraction) {
                       if(Math.random() < 0.5) {
                           this@Client.ws!!.writeTextMessage(Json.encodeToString(Payload("test", "sell", shareName = shareOfInterest)))
                       } else {
                           this@Client.ws!!.writeTextMessage(Json.encodeToString(Payload("test", "buy", shareName = shareOfInterest)))
                       }
                       delay(1)
                   }
                } else {
                    delay(1000)
                }

            }
        }
    }
}

fun createClient(remainingClients: Int): Client {

    val client = Client(remainingClients)
    Vertx.vertx().deployVerticle(client)
    client.sendMsg()
    return client
//    if(remainingClients > 0) {
//        launch {
//            createClient(remainingClients - 1)
//        }
//
//    }
}


fun main(args: Array<String>) {
//    createClient(numClients)
    var clientList: MutableList<Client> = mutableListOf()
    for (i in 0..200) {
        println("create client $i")
        GlobalScope.launch {
            clientList.add(i, createClient(i.toInt()))
        }
    }
    while(true) {
    }
}