# UIResourceTexture

{{ version_badge("2.2.1", label="自", icon="tag") }}

`UIResourceTexture` 是对保存在 LDLib2 编辑器资源系统中的纹理资源的引用。它会在绘制时从 `TexturesResource` 注册表中延迟解析实际的 `IGuiTexture`，因此适用于编辑器管理的数据驱动纹理。

注册表名称：`ui_resource_texture`

!!! note ""
    继承自 `TransformTexture` —— 支持 `rotate()`、`scale()`、`transform()`。

!!! tip ""
    这种纹理类型主要由游戏内编辑器使用。对于代码驱动的纹理，建议使用其他具体类型。

---

## 用法

=== "Java"

    ```java
    // 引用保存在内置路径 "MY_BG" 下的纹理
    IGuiTexture ref = new UIResourceTexture(new BuiltinPath("MY_BG"));

    // 引用基于文件的资源
    IGuiTexture file = new UIResourceTexture(IResourcePath.parse("file:mymod:ui/panel"));
    ```

=== "Kotlin"

    ```kotlin
    val ref = UIResourceTexture(BuiltinPath("MY_BG"))
    ```

=== "KubeJS"

    ```js
    let ref = new UIResourceTexture(new BuiltinPath("MY_BG"));
    ```

---

## LSS

```css
/* 内置资源 */
background: builtin(MY_BG);

/* 基于文件的资源 */
background: file("mymod:ui/panel");
```

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| `resourcePath` | `IResourcePath` | 用于在 `TexturesResource` 中查找纹理的路径。 |

---

## 方法

| 方法 | 返回 | 描述 |
| ------ | ------- | ----------- |
| `getRawTexture()` | `IGuiTexture` | 返回原始底层纹理（通过 `internalTexture` 解析）。 |
| `setColor(int)` | `IGuiTexture` | 复制并着色解析后的内部纹理。 |
| `copy()` | `UIResourceTexture` | 返回 `this`（该引用是不可变的）。 |