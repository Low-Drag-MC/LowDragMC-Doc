# PhantomTankWidget

<div>
  <video width="50%" controls style="margin-left: 20px; float: right;">
    <source src="../../assets/phantom_tank.mp4" type="video/mp4">
    您的浏览器不支持视频播放。
  </video>
</div>

`PhantomTankWidget` 是一个**幽灵流体槽**，它允许设置流体内容而不涉及实际的传输机制。它适用于定义**配方输入**或**流体占位符**。

---

## 特性

- **幽灵流体存储** – 不会实际消耗或提供流体。
- **支持拖拽** – 接受来自 JEI、EMI 或 REI 的流体物品。
- **自定义事件处理** – 当流体变化时更新外部状态。

---

## API

它拥有 [`TankWidget`](Tank.md) 的所有 API，你可以通过其 API 获取或设置物品。

### setIFluidStackUpdater

注册一个回调函数以追踪流体变化。

=== "Java"

    ```java
    phantomTank.setIFluidStackUpdater(fluid -> {
        System.out.println("New phantom fluid: " + fluid);
    });
    ```

=== "KubeJS"

    ```javascript
    phantomTank.setIFluidStackUpdater(fluid => {
        console.log("New phantom fluid: " + fluid);
    });
    ```
