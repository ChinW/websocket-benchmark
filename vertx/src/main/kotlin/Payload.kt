import kotlinx.serialization.Serializable

@Serializable
data class Payload(
    var action: String,
    var share: String = "",
    var price: Double = 0.0,
    var updatedAt: Long = System.currentTimeMillis()
)
