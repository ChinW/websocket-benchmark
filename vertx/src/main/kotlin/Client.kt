import io.vertx.core.AbstractVerticle
import io.vertx.core.Vertx
import io.vertx.core.buffer.Buffer
import io.vertx.core.http.ServerWebSocket

class Server : AbstractVerticle() {
    override fun start() {
        vertx
            .createHttpServer()
            .webSocketHandler {  ws: ServerWebSocket ->
                run {
                    ws.handler { data: Buffer? -> ws.writeBinaryMessage(data) }
                }
            }
            .listen(8080)
    }
}

fun main(args: Array<String>) {
    Vertx.vertx().deployVerticle(Server())
}