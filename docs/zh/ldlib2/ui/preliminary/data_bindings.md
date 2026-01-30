# 数据绑定与RPCEvent

{{ version_badge("2.1.5", label="Since", icon="tag") }}

在学习**数据绑定**和**RPCEvent**之前，了解**UI组件**与**数据**之间的关系非常重要。

---

## 客户端的数据绑定

如果UI组件是数据驱动的，它在数据模型中的角色通常属于以下类别之一：

*   **数据消费者**：被动接收数据并渲染它。
*   **数据生产者**：产生可能变化的数据（实践中纯生产者很少见）。
*   **数据消费者 + 生产者**：既显示数据，也修改数据。

### **数据消费者**与 `IDataConsumer<T>`

**被动接收数据**的组件实现了 `IDataConsumer<T>` 接口，例如 `Label` 和 `ProgressBar`。

此接口允许您绑定一个 `IDataProvider<T>`，它负责**提供更新后的数据值**。

当您想要显示**动态文本**或**变化的进度值**时，这很有用。

=== "Java"

    ```java
    var valueHolder = new AtomicInteger(0);
    // 绑定一个 DataSource 来通知标签和进度条的值变化
    new Label().bindDataSource(SupplierDataSource.of(() -> 
        Component.literal("绑定值: ").append(String.valueOf(valueHolder.get())))),
    new ProgressBar()
            .bindDataSource(SupplierDataSource.of(() -> valueHolder.get() / 100f))
            .label(label -> label.bindDataSource(SupplierDataSource.of(() -> 
                Component.literal("进度: ").append(String.valueOf(valueHolder.get())))))
    ```

=== "KubeJS"
   
    ```js
    let valueHolder = {
        "value": 0
    }
    // 绑定一个 DataSource 来通知标签和进度条的值变化
    new Label().bindDataSource(SupplierDataSource.of(() => `绑定值: ${valueHolder.value}`)),
    new ProgressBar()
        .bindDataSource(SupplierDataSource.of(() => valueHolder.value / 100))
        .label(label => label.bindDataSource(SupplierDataSource.of(() => `进度: ${valueHolder.value}`)))
    ```

### **数据生产者**与 `IObservable<T>`
产生可变数据的组件实现了 `IObservable<T>` 接口。
大多数数据驱动的组件都属于此类，例如 `Toggle`、`TextField`、`Selector`。

此接口允许您绑定一个 `IObserver<T>`，每当组件的值发生变化时，它都会收到通知。

例如，要观察 `TextField` 的变化：

=== "Java"

    ```java
    var valueHolder = new AtomicInteger(0);
    // 绑定一个 Observer 来观察文本框的值变化
    new TextField()
        .setNumbersOnlyInt(0, 100)
        .setValue(String.valueOf(valueHolder.get()))
        // 绑定一个 Observer 来更新值持有器
        .bindObserver(value -> valueHolder.set(Integer.parseInt(value)))
        // 实际上，等同于 setTextResponder
        //.setTextResponder(value -> valueHolder.set(Integer.parseInt(value)))
    ```

=== "KubeJS"
   
    ```js
    let valueHolder = {
        "value": 0
    }
    // 绑定一个 Observer 来观察文本框的值变化
    new TextField()
        .setNumbersOnlyInt(0, 100)
        .setValue(valueHolder.value)
        // 绑定一个 Observer 来更新值持有器
        .bindObserver(value => valueHolder.value = int(value))
        // 实际上，等同于 setTextResponder
        //.setTextResponder(value => valueHolder.value = int(value))
    ```

!!! note
    像 `Toggle`、`Selector` 和 `TextField` 这样的组件同时支持 `IDataConsumer<T>` 和 `IObservable<T>`，因为它们负责同时显示数据和修改数据。

---

## 客户端与服务器之间的数据绑定

如果您的UI**仅在客户端运行**，`IDataConsumer<T>` 和 `IObservable<T>` 通常就足够了。它们覆盖了观察和更新本地数据的大部分需求。

但是，许多UI是**基于容器的UI**，实际数据存储在**服务器**上。在这种情况下，您通常希望：

*   在客户端UI组件中**显示服务器端数据**。
*   将**客户端UI上所做的更改同步回服务器**。

这被称为**双向数据绑定**。

```mermaid
sequenceDiagram
  autonumber
  Server->>Client UI: 同步初始数据（如果允许s->c）
  Note right of Client UI: 初始化UI状态
  Server->>Server: 检测服务器端数据变化
  Server->>Client UI: 同步更新后的数据（如果允许s->c）
  Note right of Client UI: 更新UI显示

  Client UI->>Client UI: UI交互改变值
  Client UI->>Server: 同步更改的数据（如果允许c->s）
  Note left of Server: 应用服务器端更新

```

这听起来可能很复杂，但LDLib2完全抽象了这个过程。

---

### 使用 `DataBindingBuilder<T>`

使用 `DataBindingBuilder<T>`，您**无需自己编写任何同步逻辑**。您只需要描述：

*   **数据存储在哪里**
*   **如何读取它**
*   **如何应用更新**

#### 简单的双向绑定

=== "Java"

    ```java
    // 服务器端值
    // boolean bool = true;
    // String string = "hello";
    // ItemStack item = new ItemStack(Items.APPLE);

    new Switch()
        .bind(DataBindingBuilder.bool(() -> bool, value -> bool = value).build());

    new TextField()
        .bind(DataBindingBuilder.string(() -> string, value -> string = value).build());

    new ItemSlot()
        .bind(DataBindingBuilder.itemStack(() -> item, stack -> item = stack).build());
    ```

=== "KubeJS"

    ```js
    // 服务器端值
    // let bool = true;
    // let string = "hello";
    // let item = new ItemStack(Items.APPLE);

    new Switch()
        .bind(DataBindingBuilder.bool(() => bool, v => bool = v).build());

    new TextField()
        .bind(DataBindingBuilder.string(() => string, v => string = v).build());

    new ItemSlot()
        .bind(DataBindingBuilder.itemStack(() => item, v => item = v).build());
    ```

例如，在：

```java
DataBindingBuilder.bool(() -> bool, value -> bool = value).build()
```

*   第一个lambda定义服务器如何向客户端提供数据。
*   第二个lambda定义客户端更改如何更新服务器数据。

---

### 单向绑定（仅服务器→客户端）

有时，您**不希望客户端的更改影响服务器**，例如仅用于显示的 `Label`。

LDLib2 允许您明确控制同步策略。

??? info "SyncStrategy 概览"
    - `NONE`
    完全不进行同步。
    - `CHANGED_PERIODIC`
    仅当数据变化时同步（默认：每tick一次）。
    - `ALWAYS`
    强制每tick同步，即使未更改（谨慎使用）。

=== "Java"

    ```java
    // 阻止客户端 -> 服务器的更新
    new Label().bind(
        DataBindingBuilder.component(() -> Component.literal(data), c -> {})
            .c2sStrategy(SyncStrategy.NONE)
            .build()
    );

    // 仅服务器 -> 客户端的简写形式
    new Label().bind(
        DataBindingBuilder.componentS2C(() -> Component.literal(data)).build()
    );
    ```

=== "KubeJS"

    ```js
    // 阻止客户端 -> 服务器的更新
    new Label().bind(
        DataBindingBuilder.component(() => data, c => {})
            .c2sStrategy("NONE")
            .build()
    );

    // 仅服务器 -> 客户端的简写形式
    new Label().bind(
        DataBindingBuilder.componentS2C(() => data).build()
    );
    ```

---

### 自定义 `IBinding<T>`

`DataBindingBuilder<T>` 为常见数据类型提供了内置绑定。
对于自定义类型（例如 `int[]`），您可以创建自己的绑定。

```java
// 服务器端值
// int[] data = new int[]{1, 2, 3};

new BindableValue<int[]>().bind(
    DataBindingBuilder.create(
        () -> data,
        v -> data = v
    ).build()
);
```

!!! warning inline end
    默认并非所有类型都受支持。
    参见[类型支持](../../sync/types_support.md){ data-preview }。
    不支持的类型需要自定义类型访问器。

如果某个类型是**只读的**（参见[类型支持](../../sync/types_support.md){ data-preview }）：

*   getter**必须返回一个稳定的、非空的实例**。
*   您必须定义类型和初始值。

使用 `INBTSerializable` 的示例：

```java
// 服务器端值
// INBTSerializable<CompoundTag> data = ...;

new BindableValue<INBTSerializable>().bind(
    DataBindingBuilder.create(
        () -> data,
        v -> {
            // 实例已更新，只需在此做出反应
        }
    )
    .initialValue(data).syncType(INBTSerializable.class)
    .build()
);
```

这确保了正确的同步，并避免了只读对象的歧义。

### 客户端的 `Getter` 和 `Setter`
您可能想知道，为什么我们只在服务器端定义 getter 和 setter 逻辑，而不在客户端定义。

这是因为所有支持 bind 方法的组件都继承自 `IBindable<T>`。
对于这些组件，LDLib2 会自动为数据同步设置相应的客户端 getter 和 setter 逻辑。

在大多数情况下，这种默认行为就足够了，无需额外配置。

但是，如果您想完全控制客户端如何处理传入的数据，或它发送回服务器的数据，您可以手动定义自己的客户端 getter 和 setter 逻辑。

=== "Java"

    ```java
    // 服务器端值
    // Block data = ...;

    var label = new Label();
    new BindableValue<Block>().bind(
        DataBindingBuilder.blockS2C(() -> data)
            .remoteSetter(block -> label.setText(block.getDescriptionId())).build()
    );
    ```
=== "KubeJS"

    ```js
    // 服务器端值
    // Block data = ...;

    let label = new Label();
    new BindableValue().bind(
        DataBindingBuilder.blockS2C(() => data)
            .remoteSetter(block => label.setText(block.getDescriptionId())).build()
    );
    ```

### 一体化 - `BindableUIElement<T>`
您可能已经注意到，几乎所有数据驱动的组件——如 `TextArea`、`SearchComponent`、`Switch` 等——都是构建在 `BindableUIElement<T>` 之上的。
`BindableUIElement<T>` 是一个包装的 UI 元素，它实现了以下所有接口：
这意味着它既可以**显示数据**，又可以**产生数据变化**，同时支持**客户端-服务器同步**。

??? info inline end
    `BindableValue<T>` 实际上是一个实用组件，并且设置了 `display: CONTENTS;`，这意味着它在生命周期内不会影响布局。

如果您想实现自己的 UI 组件并支持客户端和服务器之间的双向数据绑定，您可以简单地扩展这个类。
对于**不**实现 `IBindable<T>` 的组件——比如基础的 `UIElement`——您仍然可以通过在内部附加一个 `BindableValue<T>` 来实现数据绑定。
下面的示例展示了如何将服务器端数据同步到客户端，并用它来控制元素的宽度：

=== "Java"

    ```java
    // 服务器端值
    // var widthOnTheServer = 100f;

    var element = new UIElement();
    element.addChildren(
        new BindableValue<Float>().bind(DataBindingBuilder.floatS2C(() -> widthOnTheServer)
            .remoteSetter(width -> element.getLayout().width(width))
            .build())
    );
    ```
=== "KubeJS"

    ```js
    // 服务器端值
    // let widthOnTheServer = 100;

    let element = new UIElement();
    element.addChildren(
        new BindableValue().bind(DataBindingBuilder.floatS2C(() => widthOnTheServer)
            .remoteSetter(width => element.getLayout().width(width))
            .build())
    );
    ```

### 复杂用法示例

好了，让我们再做一个更复杂的例子，为 `Selector` 绑定一个存储在服务器端的 `String` 列表（作为候选项）。
```java
// 方法1，我们同步 String[]
// 代表存储在服务器端的值
// var candidates = new ArrayList<>(List.of("a", "b", "c", "d"));

var selector1 = new Selector<String>();
selector1.addChild(
    // 一个用于同步候选项的占位元素值，它不会影响布局
    new BindableValue<String[]>().bind(DataBindingBuilder.create(
            () -> candidates.toArray(String[]::new), Consumers.nop())
            .c2sStrategy(SyncStrategy.NONE) // 仅 s -> c
            .remoteSetter(candidates -> {
                selector1.setCandidates(Arrays.stream(candidates).toList());
            })
            .build()
    )
);

// 方法2，我们同步 List<String>
// 代表存储在服务器端和客户端的值
// var candidates = new ArrayList<>(List.of("a", "b", "c", "d"));

var selector2 = new Selector<String>();
// 因为对于ldlib2同步系统来说，List是只读值。您必须获取 List<String> 的实际类型。
Type type = new TypeToken<List<String>>(){}.getType();
selector2.addChild(
    // 一个用于同步候选项的占位元素值，它不会影响布局
    new BindableValue<List<String>>().bind(DataBindingBuilder.create(
            () -> candidates, Consumers.nop())
            .syncType(type)
            .initialValue(candidates)
            .c2sStrategy(SyncStrategy.NONE) // 仅 s -> c
            .remoteSetter(selector2::setCandidates)
            .build()
    )
);

root.addChildren(selector1, selector2);
```
如果您理解了这段代码中展示的两种方法，您基本上就已经掌握了数据绑定的精髓。

-   **方法1** 同步一个 `String[]`，这种方法直截了当，按预期工作。
-   **方法2** 同步一个 `List<String>`。由于 `Collection<T>` 在 LDLib2 中被视为**只读类型**，您必须显式提供 `initialValue` 并指定实际类型（包括泛型）。

这确保了绑定系统能够正确识别和跟踪数据。

---

## UI RPCEvent
乍一看，数据绑定系统似乎可以处理大多数同步需求，但在实践中，情况并非总是如此。

例如，如果您想在用户点击按钮时执行服务器端逻辑，数据绑定显然不合适。

现在考虑一个更复杂的场景：将 `FluidSlot` 绑定到服务器端的 `IFluidHandler`。
这看起来似乎可以用数据绑定实现。如果它仅用于服务器到客户端的显示，它工作得很好。
然而，一旦涉及交互，双向同步就变得危险。

如果允许客户端修改值，它可以轻松发送恶意数据包来操纵服务器端的 `IFluidHandler`。

??? "正确的做法是"
    *   仅对显示使用**服务器到客户端**的数据绑定
    *   将**客户端交互**（例如点击 `FluidSlot`）发送到服务器
    *   在服务器端处理交互
    *   如果服务器状态发生变化，则通过数据绑定将其同步回客户端

简而言之，我们需要一种机制来在客户端和服务器之间发送交互数据。
这种机制被称为 **`UI RPCEvent`**。

以按钮为例，如果您阅读过 [UI 事件](./event.md#register-event-listeners) 部分，您已经知道UI事件可以发送到服务器并触发逻辑。
在内部，这是使用 `RPCEvent` 实现的。

```java
// 在服务器端触发 ui 事件
var button = new UIElement().addServerEventListener(UIEvents.MOUSE_DOWN, e -> {
    // 在服务器端执行某些操作
});
```

```java
// 使用 RPCEvent 的等效实现

var clickEvent = RPCEventBuilder.simple(UIEvent.class, event -> {
    // 在服务器端执行某些操作
});

new UIElement().addEventListener(UIEvents.MOUSE_DOWN, e -> {
    e.currentElement.sendEvent(clickEvent, e);
}).addRPCEvent(clickEvent);
```

您可以使用 `RPCEventBuilder` 来构建一个 `RPCEvent`，并在需要时向服务器发送数据。

!!! note
    发送 RPC 事件时，**传递给 `sendEvent` 的参数必须与在 `RPCEventBuilder` 中定义的参数完全匹配**，包括顺序和类型，并且不要忘记使用 `addRPCEvent` 添加它们。
    否则，事件将无法被正确分发。

### 带返回值的 RPCEvent
有时您可能希望向服务器发送请求以查询数据，并期望服务器返回结果。
例如，要求服务器执行加法并返回结果，您可以这样定义：

```java
var queryAdd = RPCEventBuilder.simple(int.class, int.class, int.class, (a, b) -> {
    // 在服务器端计算结果并返回
    return a + b;
});

new UIElement().addEventListener(UIEvents.MOUSE_DOWN, e -> {
    e.currentElement.<Integer>sendEvent(queryAdd, result -> {
        // 在客户端接收结果
        assert result == 2;
    }, 1, 2);
}).addRPCEvent(queryAdd);
```

### 向客户端发送事件
在实践中，**UI RPC 事件主要设计用于客户端 → 服务器的通信**，并带有可选的响应发送回客户端。
这与大多数实际用例相匹配，即**服务器拥有数据和逻辑**，而客户端仅发送交互请求。

因此，LDLib2 **不**提供专用的 UI 级别 API 用于服务器 → 客户端的 RPC 事件。

然而，**如果您确实需要从服务器主动向客户端发送事件**，可以通过使用通用的 [RPC 数据包](../../sync/rpc_packet.md) 系统来实现。

下面是一个示例，展示了服务器如何向客户端发送 RPC 数据包，以及客户端如何定位和操作特定的 UI 元素。

```java
var element = new UIElement().setId("my_element");

// 在任意位置注释您的数据包方法
@RPCPacket("rpcEventToClient")
public static void rpcPacketTest(RPCSender sender, String message, boolean message2) {
    if (sender.isRemote()) {
        var player = Minecraft.getInstance().player;
        if (player != null && player.containerMenu instanceof IModularUIHolderMenu uiHolderMenu) {
            uiHolderMenu.getModularUI().select("#my_element").findFirst().ifPresent(element -> {
                // 在客户端使用您的元素执行某些操作。
            });
        } 
    }
}

// 向远程/服务器发送数据包
RPCPacketDistributor.rpcToAllPlayers("rpcEventToClient", "Hello from server!", false)
```

这种方法使您能够完全控制服务器发起的客户端逻辑，同时保持 UI RPC 系统简单并专注于交互驱动的工作流程。

!!! tip
    当使用带有容器绑定的 **`FluidSlot`** 时，其实现已经使用了 **服务器 → 客户端 (s→c) 的只读数据同步** 结合 **用于交互的 RPC 事件**。

    您无需自己处理同步策略。
    `FluidSlot.bind(...)` 的实现也是一个很好的参考，可以了解数据同步和基于 RPC 的交互如何协同工作。