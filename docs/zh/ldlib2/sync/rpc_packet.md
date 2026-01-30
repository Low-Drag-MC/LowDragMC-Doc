# RPC 数据包
在原版或基于 Forge 的模组开发中，维护自定义网络数据包通常是繁琐的。
你通常需要维护样板式的网络代码：

* 定义数据包类
* 手动注册它们
* 处理序列化和反序列化

为了简化这个过程，LDLib2 引入了基于注解的 RPC 系统，使用 `@RPCPacket`。

有了 `@RPCPacket`，你可以在代码库中的**任何地方**声明一个静态方法，并将其视为网络数据包处理器。
被注解的方法本身成为数据包执行的目标，其参数代表了在客户端和服务器之间传输的数据。

* `@RPCPacket("id")`: 将方法注册为具有唯一标识符的 RPC 处理器。
* `RPCSender` (可选): 如果声明为第一个参数，LDLib2 将注入发送方信息，允许你区分调用是在客户端还是服务器上执行的。
* 方法参数: 所有参数（除了 RPCSender）都会被自动序列化和传输。

!!! note
    参数的类型应在 [支持的类型](./types_support.md){ data-preview } 中受支持。

RPCPacketDistributor
提供实用方法来向服务器、所有玩家或特定目标发送 RPC 调用。

```java
// 在你想要的任何地方注解你的数据包方法
@RPCPacket("rpcPacketTest")
public static void rpcPacketTest(RPCSender sender, String message, boolean message2) {
    if (sender.isServer()) {
        LDLib2.LOGGER.info("从服务器接收到的 RPC 数据包: {}, {}", message, message2);
    } else {
        LDLib2.LOGGER.info("从客户端接收到的 RPC 数据包: {}, {}", message, message2);
    }
}

// 发送数据包到远程/服务器
RPCPacketDistributor.rpcToServer("rpcPacketTest", "来自客户端的问候!", true)
RPCPacketDistributor.rpcToAllPlayers("rpcPacketTest", "来自服务器的问候!", false)
```