# UIResourceTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`UIResourceTexture` 是对保存在 LDLib2 编辑器资源系统中的纹理资源的引用。它在绘制时从 `TexturesResource` 注册表中懒加载解析实际的 `IGuiTexture`，适用于编辑器管理的数据驱动型纹理。

注册名称：`ui_resource_texture`

!!! note ""
    继承自 `TransformTexture` — 支持 `rotate()`、`scale()`、`transform()`。

!!! tip ""
    此纹理类型主要由游戏内编辑器使用。对于代码驱动的纹理，建议使用其他具体类型。

---

## 用法

=== "Java"

    ```java
    // Reference a texture saved under the built-in path "MY_BG"
    IGuiTexture ref = new UIResourceTexture(new BuiltinPath("MY_BG"));

    // Reference a file-based resource
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
/* Built-in resource */
background: builtin(MY_BG);

/* File-based resource */
background: file("mymod:ui/panel");
```

---

## 字段

| 名称 | 类型 | 描述 |
| ---- | ---- | ---- |
| `resourcePath` | `IResourcePath` | 用于在 `TexturesResource` 中查找纹理的路径。 |

---

## 方法

| 方法 | 返回值 | 描述 |
| ---- | ------ | ---- |
| `getRawTexture()` | `IGuiTexture` | 返回原始底层纹理（通过 `internalTexture` 解析）。 |
| `setColor(int)` | `IGuiTexture` | 复制并对解析后的内部纹理进行着色。 |
| `copy()` | `UIResourceTexture` | 返回 `this`（引用是不可变的）。 |