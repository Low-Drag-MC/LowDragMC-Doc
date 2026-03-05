# 数据绑定与 RPCEvent

{{ version_badge("2.1.5", label="Since", icon="tag") }}

在学习**数据绑定**和**RPCEvent**之前，理解**UI组件**与**数据**之间的关系非常重要。

---

## 客户端数据绑定

!!! info "仅客户端"
    `bindDataSource` 和 `bindObserver` 是**纯客户端**机制。
    它们在 UI 组件和本地变量之间建立数据流——不涉及网络包。
    有关**服务器与客户端**之间的同步，请参阅下方的[客户端与服务器之间的数据绑定](#data-bindings-between-client-and-server)。

如果一个 UI 组件是数据驱动的，它在数据模型中的角色通常属于以下类别之一：

- **数据消费者**：被动接收数据并渲染显示。
- **数据生产者**：产生可能变化的数据（实际中纯生产者很少见）。
- **数据消费者 + 生产者**：既显示数据又修改数据。


### 使用 `IDataConsumer<T>` 实现**数据消费者**

**被动接收数据**的组件实现 `IDataConsumer<T>` 接口，
例如 `Label` 和 `ProgressBar`。

该接口允许你绑定一个 `IDataProvider<T>`，
负责**提供更新后的数据值**。

当你需要显示**动态文本**或**变化的进度值**时，这非常有用。


=== "Java"

    ```java
    var valueHolder = new AtomicInteger(0);
    // bind a DataSource to notify the value changes for label and progress bar
    new Label().bindDataSource(SupplierDataSource.of(() ->
        Component.literal("Binding: ").append(String.valueOf(valueHolder.get())))),
    new ProgressBar()
            .bindDataSource(SupplierDataSource.of(() -> valueHolder.get() / 100f))
            .label(label -> label.bindDataSource(SupplierDataSource.of(() ->
                Component.literal("Progress: ").append(String.valueOf(valueHolder.get())))))
    ```

=== "Kotlin"

    ```kotlin
    var value = 0

    // Direct API (outside a DSL builder)
    Label().bindDataSource(SupplierDataSource.of {
        Component.literal("Binding: $value")
    })

    // Kotlin DSL (inside a UIContainer init block)
    label { dataSource({ Component.literal("Binding: $value") }) }
    progressBar { dataSource({ value / 100f }) }
    ```

=== "KubeJS"

    ```js
    let valueHolder = {
        "value": 0
    }
    // bind a DataSource to notify the value changes for label and progress bar
    new Label().bindDataSource(SupplierDataSource.of(() => `Binding: ${valueHolder.value}`)),
    new ProgressBar()
        .bindDataSource(SupplierDataSource.of(() => valueHolder.value / 100))
        .label(label => label.bindDataSource(SupplierDataSource.of(() => `Progress: ${valueHolder.value}`)))
    ```

### 使用 `IObservable<T>` 实现**数据生产者**
产生可变数据的组件实现 `IObservable<T>` 接口。
大多数数据驱动组件都属于这一类，例如 `Toggle`、`TextField`、`Selector`。

该接口允许你绑定一个 `IObserver<T>`，
当组件的值发生变化时会收到通知。

例如，观察 `TextField` 的变化：

=== "Java"

    ```java
    var valueHolder = new AtomicInteger(0);
    // bind a Observer to observe the value changes of the text-field
    new TextField()
        .setNumbersOnlyInt(0, 100)
        .setValue(String.valueOf(valueHolder.get()))
        // bind an Observer to update the value holder
        .bindObserver(value -> valueHolder.set(Integer.parseInt(value)))
        // actually, equal to setTextResponder
        //.setTextResponder(value -> valueHolder.set(Integer.parseInt(value)))
    ```

=== "Kotlin"

    ```kotlin
    var value = 0

    // Direct API
    TextField()
        .setNumbersOnlyInt(0, 100)
        .setValue(value.toString())
        .bindObserver { value = it.toIntOrNull() ?: value }

    // Kotlin DSL (inside a UIContainer init block)
    textField {
        observer { value = it.toIntOrNull() ?: value }
        dataSource { value.toString() }
    }.setNumbersOnlyInt(0, 100)
    ```

=== "KubeJS"

    ```js
    let valueHolder = {
        "value": 0
    }
    // bind a Observer to observe the value changes of the text-field
    new TextField()
        .setNumbersOnlyInt(0, 100)
        .setValue(valueHolder.value)
        // bind an Observer to update the value holder
        .bindObserver(value => valueHolder.value = int(value))
        // actually, equal to setTextResponder
        //.setTextResponder(value => valueHolder.value = int(value))
    ```

!!! note
    `Toggle`、`Selector` 和 `TextField` 等组件同时支持
    `IDataConsumer<T>` 和 `IObservable<T>`，
    因为它们既负责显示数据，也负责修改数据。

### `TrackData<T>` — 响应式值 (Kotlin)

`TrackData<T>` 是一个 Kotlin 友好的响应式容器，**同时**实现了 `IDataProvider<T>` 和 `IObserver<T>`。你可以将它同时绑定到组件的两侧：组件既从中读取数据，也向其写回数据。

在 Kotlin 中，`TrackData` 支持使用 `by` 进行**属性委托**，因此你可以像操作普通变量一样读写其持有的值。

```kotlin
// Create a reactive string value
val trackData = TrackData("10.4")

// Delegate a typed property to a mapped view of it
var trackNumber by trackData.map(
    { it.toFloatOrNull() ?: 1f },   // String -> Float
    { it.toString() }               // Float -> String
)

// Bind a text field: the field displays trackData and writes back to it
textField {
    observer(trackData)    // field changes update trackData
    dataSource(trackData)  // trackData changes push to the field
}.asNumeric(0.3f, 100f)

// Modifying trackNumber notifies the text field automatically
button({
    text("track data + 10")
    onClick = { trackNumber += 10f }
})
```

!!! note ""
    `TrackData` 是一个**客户端**工具。与 `bindDataSource`/`bindObserver` 一样，它不包含网络同步功能。使用 [`bind`](#simple-bidirectional-binding) 来实现服务器-客户端同步。

---

## 客户端与服务器之间的数据绑定

如果你的 UI **仅在客户端运行**，`IDataConsumer<T>` 和 `IObservable<T>` 通常就足够了。
它们涵盖了观察和更新本地数据的大部分需求。

然而，许多 UI 是**基于容器的 UI**，实际数据存储在**服务器**上。
在这种情况下，你通常需要：

- 在客户端 UI 组件中**显示服务器端数据**。
- 将**客户端 UI 上的更改同步回服务器**。

这就是所谓的**双向数据绑定**。

```mermaid
sequenceDiagram
  autonumber
  Server->>Client UI: Sync initial data (if s->c allowed)
  Note right of Client UI: Initialize UI state
  Server->>Server: Detect server-side data change
  Server->>Client UI: Sync updated data (if s->c allowed)
  Note right of Client UI: Update UI display

  Client UI->>Client UI: UI interaction changes value
  Client UI->>Server: Sync changed data (if c->s allowed)
  Note left of Server: Apply server-side update

```

这听起来可能很复杂，但 LDLib2 完全抽象了这个过程。

---

### 使用 `DataBindingBuilder<T>`

使用 `DataBindingBuilder<T>`，**你不需要自己编写任何同步逻辑**。
你只需描述：

* **数据存储在哪里**
* **如何读取数据**
* **如何应用更新**

#### 简单的双向绑定

=== "Java"

    ```java
    // Server-side values
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

=== "Kotlin"

    ```kotlin
    // Server-side values stored as class fields:
    // private var bool = true
    // private var string = "hello"
    // private var item = ItemStack(Items.APPLE)

    // Most concise: bind a Kotlin property reference directly
    switch { bind(::bool) }
    textField { bind(::string) }
    itemSlot { bind(::item) }

    // Equivalent with explicit getter/setter
    switch { bind({ bool }, { bool = it }) }
    ```

=== "KubeJS"

    ```js
    // Server-side values
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

* **第一个 lambda** 定义服务器如何向客户端提供数据。
* **第二个 lambda** 定义客户端更改如何更新服务器数据。

---

### 单向绑定（服务器 → 客户端）

有时，你**不希望客户端的更改影响服务器**，
例如 `Label`，它仅用于显示。

LDLib2 允许你显式控制同步策略。

??? info "SyncStrategy 概览"
    - `NONE`
    完全不同步。
    - `CHANGED_PERIODIC`
    仅在数据变化时同步（默认：每 tick 一次）。
    - `ALWAYS`
    每 tick 强制同步，即使数据未变化（谨慎使用）。

=== "Java"

    ```java
    // Block client -> server updates
    new Label().bind(
        DataBindingBuilder.component(() -> Component.literal(data), c -> {})
            .c2sStrategy(SyncStrategy.NONE)
            .build()
    );

    // Shorthand for server -> client only
    new Label().bind(
        DataBindingBuilder.componentS2C(() -> Component.literal(data)).build()
    );
    ```

=== "Kotlin"

    ```kotlin
    // bindS2C shorthand — server → client only
    label { bindS2C({ Component.literal(data) }) }

    // Client → server only
    textField { bindC2S({ newValue -> serverData = newValue }) }

    // With explicit strategy via bindings() helper
    label {
        bind({ Component.literal(data) })
    }
    ```

=== "KubeJS"

    ```js
    // Block client -> server updates
    new Label().bind(
        DataBindingBuilder.component(() => data, c => {})
            .c2sStrategy("NONE")
            .build()
    );

    // Shorthand for server -> client only
    new Label().bind(
        DataBindingBuilder.componentS2C(() => data).build()
    );
    ```

---

### 自定义 `IBinding<T>`

`DataBindingBuilder<T>` 为常见数据类型提供了内置绑定。
对于自定义类型（例如 `int[]`），你可以创建自己的绑定。

=== "Java"

    ```java
    // Server-side value
    // int[] data = new int[]{1, 2, 3};

    new BindableValue<int[]>().bind(
        DataBindingBuilder.create(
            () -> data,
            v -> data = v
        ).build()
    );
    ```

=== "Kotlin"

    ```kotlin
    // bindings() is the Kotlin DSL equivalent of DataBindingBuilder.create()
    // It infers the sync type automatically from the reified type parameter
    // int[] data = intArrayOf(1, 2, 3)

    // Inside a UIContainer init block:
    bind({ data }, { data = it })
    ```

!!! warning inline end
    并非所有类型都默认支持。
    请参阅[类型支持](../../sync/types_support.md){ data-preview }。
    不支持的类型需要自定义类型访问器。

如果一个类型是**只读的**（参见[类型支持](../../sync/types_support.md){ data-preview }）：

* getter **必须返回一个稳定的非空实例**。
* 你必须定义类型和初始值。

使用 `INBTSerializable` 的示例：

=== "Java"

    ```java
    // Server-side value
    // INBTSerializable<CompoundTag> data = ...;

    new BindableValue<INBTSerializable>().bind(
        DataBindingBuilder.create(
            () -> data,
            v -> {
                // Instance already updated, just react here
            }
        )
        .initialValue(data).syncType(INBTSerializable.class)
        .build()
    );
    ```

=== "Kotlin"

    ```kotlin
    // INBTSerializable data = ...
    bind({ data }, data))
    ```

这确保了正确的同步并避免了只读对象的歧义。

### 客户端的 `Getter` 和 `Setter`

你可能会疑惑，为什么我们只在服务器端定义 getter 和 setter 逻辑，而不在客户端定义。

这是因为所有支持 `bind` 方法的组件都继承了 `IBindable<T>`。
**默认情况下**，LDLib2 使用组件自身的 `IBindable` 实现来自动连接客户端：

- 当服务器向客户端同步数据时，它会调用组件的 **`bindDataSource`**，因此组件的显示会自动更新。
- 当组件在客户端的值发生变化时，它会回调 **`bindObserver`**，因此更改会发送到服务器。

在大多数情况下，这种默认行为就是你所需要的——你只需描述数据在服务器上的位置，LDLib2 会处理其余部分。

!!! warning "设置了 `remoteGetter` / `remoteSetter` 时"
    如果你在构建器上提供了 `remoteGetter` 或 `remoteSetter`，LDLib2 **将不会**自动调用 `bindDataSource`/`bindObserver`。
    你需要完全负责客户端如何读取或应用数据。
    仅当你需要自定义客户端逻辑时才使用此功能，例如将同步的值转发到一个不是 `IBindable` 的单独元素。

=== "Java"

    ```java
    // Server-side value
    // Block data = ...;

    var label = new Label();
    new BindableValue<Block>().bind(
        DataBindingBuilder.blockS2C(() -> data)
            .remoteSetter(block -> label.setText(block.getDescriptionId())).build()
    );
    ```

=== "Kotlin"

    ```kotlin
    // Server-side value: Block data = ...

    // api {} gives access to the raw element inside the DSL
    var labelElement: Label? = null
    label { api { labelElement = this } }

    dsl({ BindableValue<Block>() }) {
        api {
            bind(
                bindings({ data }) { /* c2s no-op */ }
                    .c2sStrategy(SyncStrategy.NONE)
                    .remoteSetter { block -> labelElement?.setText(block.descriptionId) }
                    .build()
            )
        }
    }
    ```

=== "KubeJS"

    ```js
    // Server-side value
    // Block data = ...;

    let label = new Label();
    new BindableValue().bind(
        DataBindingBuilder.blockS2C(() => data)
            .remoteSetter(block => label.setText(block.getDescriptionId())).build()
    );
    ```

### 一体化 - `BindableUIElement<T>`
你可能已经注意到，几乎所有数据驱动组件——如 `TextArea`、`SearchComponent`、`Switch` 等——都是基于 `BindableUIElement<T>` 构建的。
`BindableUIElement<T>` 是一个包装的 UI 元素，实现了以下所有接口：
这意味着它既可以**显示数据**，也可以**产生数据变化**，同时支持**客户端-服务器同步**。

??? info inline end
    `BindableValue<T>` 实际上是一个工具组件，设置了 `display: CONTENTS;`，这意味着它在生命周期中不会影响布局。

如果你想实现自己的 UI 组件并支持客户端和服务器之间的双向数据绑定，你可以简单地继承这个类。
对于**没有**实现 `IBindable<T>` 的组件——如基础的 `UIElement`——你仍然可以通过内部附加一个 `BindableValue<T>` 来实现数据绑定。
下面的示例展示了如何将服务器端数据同步到客户端，并用它来控制元素的宽度：

=== "Java"

    ```java
    // Server-side value
    // var widthOnTheServer = 100f;

    var element = new UIElement();
    element.addChildren(
        new BindableValue<Float>().bind(DataBindingBuilder.floatValS2C(() -> widthOnTheServer)
            .remoteSetter(width -> element.getLayout().width(width))
            .build())
    );
    ```

=== "Kotlin"

    ```kotlin
    // Server-side value: var widthOnTheServer = 100f

    element({}) {
        dsl({ BindableValue<Float>() }) {
            api {
                bind(
                    bindings({ widthOnTheServer }) { /* c2s no-op */ }
                        .c2sStrategy(SyncStrategy.NONE)
                        .remoteSetter { width -> element.layout.width(width) }
                        .build()
                )
            }
        }
    }
    ```

=== "KubeJS"

    ```js
    // Server-side value
    // let widthOnTheServer = 100;

    let element = new UIElement();
    element.addChildren(
        new BindableValue().bind(DataBindingBuilder.floatValS2C(() => widthOnTheServer)
            .remoteSetter(width => element.getLayout().width(width))
            .build())
    );
    ```

### 复杂用法示例

好的，让我们来看一个更复杂的例子，将存储在服务器上的 `String` 列表绑定到 `Selector`（作为候选项）。
```java
// method 1, we sync String[]
// represent value stored on the server
// var candidates = new ArrayList<>(List.of("a", "b", "c", "d"));

var selector1 = new Selector<String>();
selector1.addChild(
    // a placeholder element value to sync candidates, it won't affect layout
    new BindableValue<String[]>().bind(DataBindingBuilder.create(
            () -> candidates.toArray(String[]::new), Consumers.nop())
            .c2sStrategy(SyncStrategy.NONE) // only s -> c
            .remoteSetter(candidates -> {
                selector1.setCandidates(Arrays.stream(candidates).toList());
            })
            .build()
    )
);

// method 2, we sync List<String>
// represent value stored on the server and client
// var candidates = new ArrayList<>(List.of("a", "b", "c", "d"));

var selector2 = new Selector<String>();
// because the List is a readonly value for ldlib2 sync system. you have to obtain the real type of List<String>
Type type = new TypeToken<List<String>>(){}.getType();
selector2.addChild(
    // a placeholder element value to sync candidates, it won't affect layout
    new BindableValue<List<String>>().bind(DataBindingBuilder.create(
            () -> candidates, Consumers.nop())
            .syncType(type)
            .initialValue(candidates)
            .c2sStrategy(SyncStrategy.NONE) // only s -> c
            .remoteSetter(selector2::setCandidates)
            .build()
    )
);

root.addChildren(selector1, selector2);
```
如果你理解了这段代码中展示的两种方法，你基本上就掌握了数据绑定。

- **方法 1** 同步 `String[]`，这很直接，按预期工作。
- **方法 2** 同步 `List<String>`。由于 `Collection<T>` 在 LDLib2 中被视为**只读类型**，你必须显式提供 `initialValue` 并指定实际类型（包括泛型）。

这确保了绑定系统能够正确识别和跟踪数据。


---

## UI RPCEvent
乍一看，数据绑定系统似乎可以处理大多数同步需求，但实际上并非总是如此。

例如，如果你想在用户点击按钮时执行服务器端逻辑，数据绑定显然不适合。

现在考虑一个更复杂的场景：将 `FluidSlot` 绑定到服务器端的 `IFluidHandler`。
这看起来可以用数据绑定实现。如果只用于服务器到客户端的显示，它工作得很好。
然而，一旦涉及交互，双向同步就变得危险了。

如果允许客户端修改值，它可以轻松发送恶意数据包来操纵服务器端的 `IFluidHandler`。

??? "正确的做法是"
    * 使用**服务器到客户端**的数据绑定仅用于显示
    * 将**客户端交互**（如点击 `FluidSlot`）发送到服务器
    * 在服务器上处理交互
    * 如果服务器状态发生变化，通过数据绑定将其同步回客户端

简而言之，我们需要一种在客户端和服务器之间发送交互数据的机制。
这种机制称为**`UI RPCEvent`**。

以按钮为例，如果你已经阅读了[UI 事件](./event.md#register-event-listeners)部分，你已经知道 UI 事件可以发送到服务器并触发逻辑。
在内部，这是使用 `RPCEvent` 实现的。

=== "Java"

    ```java
    // trigger ui event on the server
    var button = new UIElement().addServerEventListener(UIEvents.MOUSE_DOWN, e -> {
        // do something on the server
    });
    ```

=== "Kotlin"

    ```kotlin
    button {
        serverEvents {
            UIEvents.MOUSE_DOWN on { event ->
                // do something on the server
            }
        }
    }
    ```

使用 `RPCEvent` 直接实现的等效代码：

=== "Java"

    ```java
    var clickEvent = RPCEventBuilder.simple(UIEvent.class, event -> {
        // do something on the server
    });
    var emitter = element.addRPCEvent(clickEvent);

    element.addEventListener(UIEvents.MOUSE_DOWN, e -> {
       emitter.send(clickEvent, e);
    });
    ```

=== "Kotlin"

    ```kotlin
    button {
        // element.rpcEvent { ... } is the Kotlin shorthand
        val rpcEvent = element.rpcEvent { event: UIEvent ->
            // do something on the server
        }
        events {
            UIEvents.MOUSE_DOWN on { rpcEvent.send(it) }
        }
    }
    ```

你可以使用 `RPCEventBuilder` 构造一个 `RPCEvent`，并在需要时向服务器发送数据。

!!! note
    发送 RPC 事件时，**传递给 `RPCEmitter#send` 的参数必须与 `RPCEventBuilder` 中定义的参数完全匹配**，包括它们的顺序和类型，并且不要忘记 `addRPCEvent` 它们。
    否则，事件将无法正确分发。


### 带返回值的 RPCEvent
有时你可能想向服务器发送请求来查询数据，并期望服务器返回结果。
例如，要求服务器执行加法并返回结果，你可以这样定义：

```java
var queryAdd = RPCEventBuilder.simple(int.class, int.class, int.class, (a, b) -> {
    // calculate the result and return on the server
    return a + b;
});
var emitter = element.addRPCEvent(queryAdd);

element.addEventListener(UIEvents.MOUSE_DOWN, e -> {
    emitter.<Integer>send(queryAdd, result -> {
        // receive the result on the client
        assert result == 2;
    }, 1, 2);
})

```

### 向客户端发送事件
实际上，**UI RPC 事件主要设计用于客户端 → 服务器通信**，可选地将响应发送回客户端。
这符合大多数真实用例，其中**服务器拥有数据和逻辑**，客户端只发送交互请求。

因此，LDLib2 **没有**为服务器 → 客户端 RPC 事件提供专用的 UI 级 API。

然而，**如果你确实需要主动从服务器向客户端发送事件**，你可以通过使用通用的 [RPC Packet](../../sync/rpc_packet.md) 系统来实现。

下面是一个示例，展示了服务器如何向客户端发送 RPC 包，以及客户端如何定位并操作特定的 UI 元素。

```java
var element = new UIElement().setId("my_element");

// annotate your packet method anywhere you want
@RPCPacket("rpcEventToClient")
public static void rpcPacketTest(RPCSender sender, String message, boolean message2) {
    if (sender.isRemote()) {
        var player = Minecraft.getInstance().player;
        if (player != null && player.containerMenu instanceof IModularUIHolderMenu uiHolderMenu) {
            uiHolderMenu.getModularUI().select("#my_element").findFirst().ifPresent(element -> {
                // do something on the client side with your element.
            });
        }
    }
}

// send pacet to the remote/server
RPCPacketDistributor.rpcToAllPlayers("rpcEventToClient", "Hello from server!", false)
```

这种方法让你完全控制服务器发起的客户端逻辑，同时保持 UI RPC 系统简单且专注于交互驱动的工作流。

!!! tip
    当使用带有容器绑定的 **`FluidSlot`** 时，实现已经使用了
    **服务器 → 客户端（s→c）只读数据同步**结合**RPC 事件**进行交互。

    你不需要自己处理同步策略。
    `FluidSlot.bind(...)` 的实现也是学习数据同步和基于 RPC 的交互如何协同工作的好参考。
