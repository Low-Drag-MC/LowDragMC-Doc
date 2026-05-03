# UIResourceTexture

{{ version_badge("2.2.1", label="Since", icon="tag") }}

`UIResourceTexture` is a reference to a texture asset saved in the LDLib2 editor resource system. It resolves the actual `IGuiTexture` lazily from the `TexturesResource` registry at draw time, making it suitable for editor-managed, data-driven textures.

Registry name: `ui_resource_texture`

!!! note ""
    Extends `TransformTexture` — supports `rotate()`, `scale()`, `transform()`.

!!! tip ""
    This texture type is primarily used by the in-game editor. For code-driven textures, prefer one of the other concrete types.

---

## Usage

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

## Fields

| Name | Type | Description |
| ---- | ---- | ----------- |
| `resourcePath` | `IResourcePath` | The path used to look up the texture in `TexturesResource`. |

---

## Methods

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `getRawTexture()` | `IGuiTexture` | Returns the raw underlying texture (resolving through `internalTexture`). |
| `setColor(int)` | `IGuiTexture` | Copies and tints the resolved internal texture. |
| `copy()` | `UIResourceTexture` | Returns `this` (the reference is immutable). |