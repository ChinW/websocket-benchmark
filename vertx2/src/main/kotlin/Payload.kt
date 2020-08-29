import kotlinx.serialization.Serializable

@Serializable
data class Payload(
    var channel: String,
    var action: String,
    var shareName: String = "",
    var price: Double = 0.0
)
