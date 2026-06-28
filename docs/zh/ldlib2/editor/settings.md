# Settings

Editor settings 是编辑器 UI 和行为的持久化偏好。

<figure>
<img src="./assets/editor_setting.png" alt="Editor settings panel">
<figcaption>
Editor settings panel：左侧是设置分组，右侧是可编辑设置。
</figcaption>
</figure>

`Settings` 是配置单元：

```java
public interface Settings extends IConfigurable {
    ResourceLocation getId();
    String getPath();
    void onApply(Editor editor);
}
```

`EditorSettings` 管理已注册 settings 和 codec。它可以：

* 注册和注销 settings；
* 构建 settings panel；
* 从 `config/ldlib2/editor.json` 加载 JSON；
* 保存 JSON；
* 检测 dirty 状态；
* 应用已修改的 settings；
* 恢复到上次应用的状态。

覆写 `initEditorSettings()` 注册默认设置：

```java
@Override
protected void initEditorSettings() {
    super.initEditorSettings();
    editorSettings.registerSettings(new ShopSettings(), ShopSettings.CODEC);
}
```

## Built-in Settings

`AppearanceSettings` 控制编辑器 stylesheet 和 GUI scale。`ViewMenu` 的窗口大小选项使用它。

`BehaviorSettings` 安装编辑器按键处理：

* 可选 Esc 关闭；
* Alt + S 打开 settings panel；
* Ctrl + Shift + S 另存为；
* Ctrl + S 保存。

## 自定义 Settings

```java
public class ShopSettings implements Settings {
    public static final ResourceLocation ID = LDLib2.id("shop");
    public static final Codec<ShopSettings> CODEC =
            PersistedParser.createCodec(ShopSettings::new);

    @Configurable
    private boolean previewItems = true;

    @Override
    public ResourceLocation getId() {
        return ID;
    }

    @Override
    public String getPath() {
        return "Shop";
    }

    @Override
    public void onApply(Editor editor) {
        // 读取 settings 并更新 editor 行为。
    }
}
```

本页只展示 editor-side settings 流程。Configurator 细节会在单独章节介绍。
