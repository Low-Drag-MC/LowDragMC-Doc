# Resource System

资源系统用于管理可复用编辑器资产：UI 模板、纹理、颜色、图、商店预设，或者任何需要显示在资源面板中的数据类型。

主要部分：

* `Resources`：项目暴露的资源类型列表。
* `Resource&lt;T&gt;`：某一种资源类型的定义。
* `ResourceInstance&lt;T&gt;`：该资源类型的运行时状态。
* `IResourceProvider&lt;T&gt;`：资源来源。
* `IResourcePath`：指向某个资源的 typed path。
* `ResourceView`：显示资源的内置 View。

从项目暴露资源类型：

```java
@Override
public Resources getResources() {
    return Resources.of(ShopEntryResource.INSTANCE);
}
```

## Resource

`Resource&lt;T&gt;` 定义一种资源类型。它提供：

* 图标；
* 名称；
* 文件扩展名；
* 默认显示模式；
* 默认 UI 宽度；
* built-in 资源；
* NBT 序列化和反序列化。

覆写 `buildBuiltin(...)` 添加内置资源。覆写 `createResourceProviderContainer(...)` 自定义资源面板行为。

## 自定义 Resource

为每一种资产类型创建一个 `Resource&lt;T&gt;` 子类。

```java
public class ShopEntryResource extends Resource<ShopEntry> {
    public static final ShopEntryResource INSTANCE = new ShopEntryResource();

    public ShopEntryResource() {
        setDefaultDisplayMode(DisplayMode.LIST);
        setDefaultUIWidth(30);
    }

    @Override
    public IGuiTexture getIcon() {
        return Icons.ITEM;
    }

    @Override
    public String getName() {
        return "shop_entry";
    }

    @Override
    public void buildBuiltin(BuiltinResourceProvider<ShopEntry> provider) {
        provider.addResource("empty", new ShopEntry());
    }

    @Nullable
    @Override
    public Tag serializeResource(ShopEntry value, HolderLookup.Provider provider) {
        return ShopEntry.CODEC.encodeStart(provider.createSerializationContext(NbtOps.INSTANCE), value)
                .result()
                .orElse(null);
    }

    @Nullable
    @Override
    public ShopEntry deserializeResource(Tag nbt, HolderLookup.Provider provider) {
        return ShopEntry.CODEC.parse(provider.createSerializationContext(NbtOps.INSTANCE), nbt)
                .result()
                .orElse(null);
    }
}
```

`getName()` 很重要。它会用于资源 tab、文件扩展名、元数据文件和资源路径身份。

默认文件扩展名为：

```text
.<resource name>.nbt
```

例如 `shop_entry` 会使用 `.shop_entry.nbt`。

## 在 Project 中暴露资源

```java
private final Resources resources = Resources.of(
        ShopEntryResource.INSTANCE,
        TexturesResource.INSTANCE,
        ColorsResource.INSTANCE
);

@Override
public Resources getResources() {
    return resources;
}
```

项目加载时，Editor 会调用 `resourceView.loadResources(project.getResources())`。

## 使用 Resource

通过 resource instance 和 path 获取资源：

```java
var path = IResourcePath.parse("file(./ldlib2/assets/example.shop_entry.nbt)");
var entry = ShopEntryResource.INSTANCE.getResourceInstance().getResource(path);
```

对于用户创建的资源，建议在项目数据中保存 `IResourcePath`，而不是复制资源值。这样文件资源可以重新加载，项目也会更轻。

## ResourceInstance

`ResourceInstance&lt;T&gt;` 是资源类型的运行时持有者。它管理：

* built-in providers；
* custom providers；
* 缓存；
* 显示模式；
* grid item 大小；
* selector dialogs。

它也会持久化资源面板元数据，例如 custom providers 和显示设置。
