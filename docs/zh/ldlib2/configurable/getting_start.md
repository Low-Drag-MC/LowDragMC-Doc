# 快速开始

Configurable 从一个实现 `IConfigurable` 的对象开始。默认的 `buildConfigurator(...)` 会调用 `ConfiguratorParser`，扫描对象中的 `@Configurable` 字段，并为这些字段创建 UI 行。

```java
public class ShopEntry implements IConfigurable {
    @Configurable(name = "Display Name")
    public String displayName = "Apple";

    @Configurable(name = "Price", tips = "Cost paid by the player")
    @ConfigNumber(range = {0, 9999}, wheel = 1)
    public int price = 10;

    @Configurable(name = "Enabled")
    public boolean enabled = true;
}
```

在 editor inspector 中显示：

```java
ShopEntry entry = new ShopEntry();
editor.inspectorView.inspect(entry);
```

也可以直接使用独立的 `Inspector` 元素：

```java
Inspector inspector = new Inspector();
inspector.inspect(entry);
```

对象本身不需要知道 editor 的存在。Inspector 会要求对象构建 configurators，然后把这些 UI 放进可滚动面板。

## 手动 Configurator

普通字段编辑优先使用注解。当 UI 需要自定义布局、动态生成行，或者一个控件不适合映射到单个字段时，再重写 `buildConfigurator(...)`。

```java
public class RuntimeInfo implements IConfigurable {
    @Override
    public void buildConfigurator(ConfiguratorGroup father) {
        father.addConfigurator(new StringConfigurator(
                "Status",
                () -> "Running",
                value -> {},
                "Running",
                false
        ));
    }
}
```

也可以混合使用两种方式：

```java
@Override
public void buildConfigurator(ConfiguratorGroup father) {
    IConfigurable.super.buildConfigurator(father);
    father.addConfigurator(new HeaderConfigurator("Runtime", 5));
}
```

手动 configurator 要谨慎使用。一旦绕开字段解析，就需要自己负责 setter、数据更新和变更通知。
