# UI资源纹理
{{ version_badge("2.2.1", label="Since", icon="tag") }}
`UIResourceTexture` 是对保存在 LDLib2 编辑器资源系统中的纹理资源的引用。它在绘制时从 `TexturesResource` 注册表中延迟解析实际的 `IGuiTexture`，使其适合编辑器管理、数据驱动的纹理。
注册表名称：`ui_resource_texture`
!!!笔记 ””扩展`TransformTexture` — 支持`rotate()`、`scale()`、`transform()`。
!!!提示 ””这种纹理类型主要由游戏内编辑器使用。对于代码驱动的纹理，首选其他具体类型之一。
---

＃＃ 用法
===“Java”
    ```java
    // Reference a texture saved under the built-in path "MY_BG"
    IGuiTexture ref = new UIResourceTexture(new BuiltinPath("MY_BG"));

    // Reference a file-based resource
    IGuiTexture file = new UIResourceTexture(IResourcePath.parse("file:mymod:ui/panel"));
    ```

===“科特林”
    ```kotlin
    val ref = UIResourceTexture(BuiltinPath("MY_BG"))
    ```

===“KubeJS”
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
| Name | Type | Description |
| ---- | ---- | ----------- |
| `resourcePath` | `IResourcePath` | The path used to look up the texture in `TexturesResource`. |

---

＃＃ 方法
| Method | Returns | Description |
| ------ | ------- | ----------- |
| `getRawTexture()` | `IGuiTexture` | Returns the raw underlying texture (resolving through `internalTexture`). |
| `setColor(int)` | `IGuiTexture` | Copies and tints the resolved internal texture. |
| `copy()` | `UIResourceTexture` | Returns `this` (the reference is immutable). |