# Providers and Paths

`IResourceProvider&lt;T&gt;` 是资源来源。它可以添加、移除、重命名、编辑、复制、列出和重新加载资源。

常用 provider hook：

* `createSubPath(name)`：在 provider 内创建路径。
* `getResource(path)`：读取资源。
* `addResource(path, value)`：添加或替换资源。
* `removeResource(path)`：移除资源。
* `checkAndUpdateResourceProvider()`：重新加载外部变化。
* `createProviderToggle()`：创建 provider selector UI。
* `onMenu(menu)`：追加 provider 专属右键菜单。

## Resource Paths

`IResourcePath` 保存 provider type 和 path。当前字符串格式为：

```text
type(path)
```

示例：

```text
built-in(built-in:missing)
file(./ldlib2/assets/ldlib2/resources/global/example.ui.nbt)
pack(ldlib2:resources/global/example.ui.nbt)
```

## Built-in Provider

`BuiltinResourceProvider` 保存由代码注册的资源。它在 UI 中通常是只读的：不能添加、编辑、重命名、移除或复制。

适合默认资产和示例。

## File Provider

`FileResourceProvider` 将资源保存为文件夹中的 NBT 文件。它支持 custom provider、文件变化检查、添加、移除、重命名、复制和打开文件夹 UI。

适合用户需要创建或编辑磁盘资产的情况。

用户可以在资源面板中添加支持 custom instance 的 file provider。

## Pack Loading

`PackFileResourceProvider` 加载可以表示为客户端资源位置的文件路径。例如：

```text
pack(ldlib2:resources/global/example.ui.nbt)
```

## 自定义 Provider Type

大多数编辑器只需要 built-in 和 file provider。当资源来自数据库、生成注册表、远程来源，或其他模组自定义资产系统时，可以创建自定义 `ResourceProviderType`。

Provider type 创建完整路径和 custom provider：

```java
public class ShopRegistryProviderType extends ResourceProviderType {
    @Override
    public String getTypeName() {
        return "shop_registry";
    }

    @Override
    public IGuiTexture getIcon() {
        return Icons.RESOURCE;
    }

    @Override
    public IResourcePath createFullPath(String path) {
        return new ShopRegistryPath(path);
    }

    @Override
    public boolean supportCustom() {
        return true;
    }

    @Override
    public <T> ResourceProvider<T> fromNbt(ResourceInstance<T> resourceInstance, CompoundTag tag) {
        return ShopRegistryProvider.fromNbt(resourceInstance, tag);
    }

    @Override
    public <T> void onCreateCustom(ResourceContainer<T> container) {
        container.resourceInstance.addCustomProvider(new ShopRegistryProvider<>(container.resourceInstance));
    }
}
```

将 provider type 注册到当前环境使用的 LDLib2 resource provider type registry。

你的 provider 应实现 `IResourceProvider&lt;T&gt;` 或继承 `ResourceProvider&lt;T&gt;`。根据来源覆写 `canEdit`、`canRemove`、`canRename`、`supportAdd` 等权限方法。

如果资源来源可能在编辑器外变化，使用 `checkAndUpdateResourceProvider()`。
