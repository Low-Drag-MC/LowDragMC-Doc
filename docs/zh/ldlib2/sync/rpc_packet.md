# RPC Packet
在原版或基于Forge的模组开发中，维护自定义网络数据包通常十分繁琐。
你通常需要编写大量的样板网络代码：

* 定义数据包类
* 手动注册它们
* 处理序列化和反序列化

为了简化这一流程，LDLib2 引入了一个基于注解的RPC系统，使用 `@RPCPacket`。

使用 `@RPCPacket`，你可以在你的代码库中**任意位置**声明一个静态方法，并将其作为网络数据包处理器。
被注解的方法本身就成为数据包的执行目标，其参数代表在客户端和服务器之间传输的数据。

* `@RPCPacket("id")`：将方法注册为具有唯一标识符的RPC处理器。
* `RPCSender`（可选）：如果声明为第一个参数，LDLib2 会注入发送方信息，允许你区分调用是在客户端还是服务器上执行的。
* 方法参数：所有参数（除RPCSender外）都会自动序列化并传输。

!!! note
    参数类型应在 [类型支持](./types_support.md){ data-preview } 中受到支持。

RPCPacketDistributor
提供工具方法，用于向服务器、所有玩家或特定目标发送RPC调用。

```java
// 在你想要的任意位置注解你的数据包方法
@RPCPacket("rpcPacketTest")
public static void rpcPacketTest(RPCSender sender, String message, boolean message2) {
    if (sender.isServer()) {
        LDLib2.LOGGER.info("Received RPC packet from server: {}, {}", message, message2);
    } else {
        LDLib2.LOGGER.info("Received RPC packet from client: {}, {}", message, message2);
    }
}

// 向远程/服务器发送数据包
RPCPacketDistributor.rpcToServer("rpcPacketTest", "Hello from client!", true)
RPCPacketDistributor.rpcToAllPlayers("rpcPacketTest", "Hello from server!", false)
```
