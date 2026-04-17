# 远程过程调用数据包在普通或基于 Forge 的 mod 开发中，维护自定义网络数据包通常很乏味。您通常需要维护样板网络代码：
* 定义数据包类别* 手动注册它们* 处理序列化和反序列化
为了简化这个过程，LDLib2引入了使用`@RPCPacket`的基于注释的RPC系统。
使用`@RPCPacket`，您可以在代码库中声明一个静态方法 **ANYWHERE** 并将其视为网络数据包处理程序。带注释的方法本身成为数据包的执行目标，其参数代表客户端和服务器之间传输的数据。
* `@RPCPacket("id")`：将方法注册为具有唯一标识符的 RPC 处理程序。* `RPCSender`（可选）：如果声明为第一个参数，LDLib2 会注入发送方信息，允许您区分是否* 方法参数：所有参数（RPCSender 除外）都会自动序列化并传输。调用在客户端或服务器上执行。
!!!笔记[Types Support](./types_support.md){ data-preview } 中应支持参数类型。
RPC数据包分发器提供向服务器、所有玩家或特定目标发送 RPC 调用的实用方法。
```java
// annotate your packet method anywhere you want
@RPCPacket("rpcPacketTest")
public static void rpcPacketTest(RPCSender sender, String message, boolean message2) {
    if (sender.isServer()) {
        LDLib2.LOGGER.info("Received RPC packet from server: {}, {}", message, message2);
    } else {
        LDLib2.LOGGER.info("Received RPC packet from client: {}, {}", message, message2);
    }
}

// send pacet to the remote/server 
RPCPacketDistributor.rpcToServer("rpcPacketTest", "Hello from client!", true)
RPCPacketDistributor.rpcToAllPlayers("rpcPacketTest", "Hello from server!", false)
```