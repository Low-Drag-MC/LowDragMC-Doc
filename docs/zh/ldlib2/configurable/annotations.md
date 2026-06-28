# 注解

注解描述字段在生成的属性 UI 中如何显示。`ConfiguratorParser` 会在运行时读取这些注解，并在 `ConfiguratorGroup` 下创建 configurators。

## @Configurable

`@Configurable` 标记一个字段或类型可被编辑。

```java
@Configurable(
        name = "Speed",
        tips = "Blocks per second",
        collapse = false,
        forceUpdate = true
)
public float speed = 1.0f;
```

常用参数：

* `name`：UI 中显示的标签。为空时使用字段名或类名。
* `showName`：设为 `false` 时隐藏标签。
* `tips`：tooltip 文本。
* `collapse`：group 或 list-like configurator 的初始折叠状态。
* `canCollapse`：用户是否可以折叠该 group。
* `forceUpdate`：传给创建出的 configurator。需要实时从目标对象刷新时使用。
* `subConfigurable`：把字段值当作嵌套对象，并构建它的字段。
* `subFlattenConfigurable`：把嵌套对象的字段直接放进父 group。
* `subFlattenPersisted`：序列化时把嵌套对象的数据展开到父对象。
* `persisted`：是否参与 `PersistedParser` 序列化，默认是 `true`。

```java
@Configurable(name = "Transform", subConfigurable = true)
public TransformData transform = new TransformData();
```

因为 `persisted` 默认是 `true`，`@Configurable` 字段也会像 persisted 字段一样参与序列化：

```java
public class ShopEntry implements IPersistedSerializable {
    @Configurable(name = "Price")
    public int price = 10; // 会被 PersistedParser 序列化

    @Configurable(name = "Preview Only", persisted = false)
    public boolean previewOnly = false; // 只用于 editor UI
}
```

字段既需要编辑又需要保存时使用 `@Configurable`。只需要保存、不需要 editor UI 时使用 `@Persisted`。序列化行为见 [PersistedParser](../sync/PersistedParser.md)。

## 默认值

`@DefaultValue` 被多种 accessor 支持，不只用于数字。当 configurator 需要 fallback 值，或者数组/列表创建新元素时，它可以提供默认 number、string 或 boolean。

```java
@Configurable
@DefaultValue(stringValue = "minecraft:stone")
private ResourceLocation texture = ResourceLocation.withDefaultNamespace("stone");

@Configurable
@DefaultValue(booleanValue = true)
private boolean enabled = true;
```

Accessor 会读取自己支持的部分。数字 accessor 使用 `numberValue`，字符串类 accessor 使用 `stringValue`，boolean accessor 使用 `booleanValue`。

## 数字

`@ConfigNumber` 用于设置数值范围和鼠标滚轮步进。

```java
@Configurable(name = "Scale")
@ConfigNumber(range = {0.1, 8.0}, wheel = 0.1)
@DefaultValue(numberValue = 1.0)
public float scale = 1.0f;
```

## 颜色

`@ConfigColor` 让一个整数使用颜色选择器。

```java
@Configurable(name = "Tint")
@ConfigColor
public int color = 0xffffffff;
```

`@ConfigHDR` 用于目标类型支持 HDR color configurator 的情况。

## 选择器

Enum 字段会自动变成 selector。`@ConfigSelector` 可以限制候选项、限制可见数量，或者根据当前选择创建额外配置行。

```java
@Configurable(name = "Mode")
@ConfigSelector(candidate = {"basic", "advanced"}, max = 4)
public Mode mode = Mode.BASIC;
```

条件子配置可以指定一个方法名：

```java
@Configurable(name = "Mode")
@ConfigSelector(subConfiguratorBuilder = "buildModeOptions")
public Mode mode = Mode.BASIC;

private void buildModeOptions(Mode mode, ConfiguratorGroup group) {
    if (mode == Mode.ADVANCED) {
        group.addConfigurator(new BooleanConfigurator("Debug", () -> debug, v -> debug = v, false, true));
    }
}
```

## 列表和数组

数组和集合会显示为 `ArrayConfiguratorGroup`。`@ConfigList` 控制添加、删除、重排、默认元素创建，以及自定义元素 UI。

```java
@Configurable(name = "Rewards")
@ConfigList(addDefaultMethod = "newReward", canReorder = true)
public List<Reward> rewards = new ArrayList<>();

private Reward newReward() {
    return new Reward();
}
```

不加 `@ConfigList` 时，LDLib2 仍会构建 list UI。它会找到元素类型，再找到元素 accessor，并为每个元素创建一个子 configurator。比如 `List&lt;Boolean&gt;` 使用 `BooleanAccessor`；`List&lt;Reward&gt;` 则需要 Reward 有支持的 accessor、手动 accessor，或者自定义 item configurator。

`@ConfigList` 参数：

* `canAdd`：是否显示添加按钮。
* `canRemove`：是否允许删除行。
* `canReorder`：是否允许重排。
* `addDefaultMethod`：owner 对象上用于创建新元素的方法。
* `configuratorMethod`：owner 对象上用于创建每个元素 UI 的方法。

`configuratorMethod` 的签名必须是：

```java
private Configurator methodName(Supplier<T> getter, Consumer<T> setter)
```

`addDefaultMethod` 的签名必须是：

```java
private T methodName()
```

嵌套 configurable values 的常见写法：

```java
@Configurable
@ConfigList(
        configuratorMethod = "buildEntryConfigurator",
        addDefaultMethod = "newEntry"
)
private final List<Entry> entries = new ArrayList<>();

private Configurator buildEntryConfigurator(Supplier<Entry> getter, Consumer<Entry> setter) {
    Entry entry = getter.get();
    return entry == null ? new Configurator() : entry.createDirectConfigurator();
}

private Entry newEntry() {
    return new Entry();
}
```

生成出的 list configurator 负责添加、删除和重排 UI。你的 item configurator 只需要编辑单个元素。

## 搜索字段

`@ConfigSearch` 会用 `SearchComponentConfigurator` 替代普通基于类型的 UI。指定的方法必须返回 `SearchComponentConfigurator.ISearchConfigurator`。

```java
@Configurable(name = "Block")
@ConfigSearch(searchConfiguratorMethod = "createBlockSearch")
public Block block = Blocks.STONE;
```

适合从大型动态集合中选择值：方块、物品、配方、自定义注册表项、节点、资源，或者任何不适合固定 selector 的数据。

```java
private SearchComponentConfigurator.ISearchConfigurator<Block> createBlockSearch() {
    return new SearchComponentConfigurator.ISearchConfigurator<>() {
        @Override
        public Block defaultValue() {
            return Blocks.STONE;
        }

        @Override
        public void search(String word, IResultHandler<Block> handler) {
            String lower = word.toLowerCase();
            for (ResourceLocation key : BuiltInRegistries.BLOCK.keySet()) {
                if (key.toString().toLowerCase().contains(lower)) {
                    handler.acceptResult(BuiltInRegistries.BLOCK.get(key));
                }
            }
        }

        @Override
        public String resultText(Block value) {
            return BuiltInRegistries.BLOCK.getKey(value).toString();
        }
    };
}
```

重要方法：

* `defaultValue()`：configurator 使用的 fallback 值。
* `search(String, IResultHandler&lt;T&gt;)`：把匹配结果推入 handler。
* `resultText(T)`：选中值或结果行显示的文本。
* `candidateUIProvider()`：可选的自定义结果行 UI，通常是图标加文本。

搜索会随着用户输入触发。保持实现轻量；如果实现中检查了 `Thread.currentThread().isInterrupted()`，应尽快返回。

## Setter

默认情况下，解析出的字段会被直接写入。字段需要校验、副作用或刷新缓存时，使用 `@ConfigSetter`。

```java
@Configurable
private int size = 16;

@ConfigSetter(field = "size")
private void setSize(int size) {
    this.size = Math.max(1, size);
    rebuildPreview();
}
```

## Header 和 ResourceLocation

`@ConfigHeader` 会在被标注字段前插入 section 标题。

```java
@ConfigHeader("Display")
@Configurable
public String title = "";
```

`@ConfigRL` 用于特殊化 `ResourceLocation` 字段。内置模式包括 font ID，以及 item、block、entity type、fluid 的 tag key。

```java
@Configurable(name = "Font")
@ConfigRL(ConfigRL.Type.FONT)
public ResourceLocation font = ResourceLocation.withDefaultNamespace("default");
```
