# Built-in Views

`Editor` 自带一些大多数编辑器都会复用的 View。

## InspectorView

`InspectorView` 包装了 LDLib2 的 `Inspector` 组件，默认放在右侧面板。

<figure>
<img src="../assets/editor_inspector.png" alt="Inspector editing an AnimationTexture" width="45%">
<figcaption>
Inspector 正在编辑一个 &lt;code&gt;AnimationTexture&lt;/code&gt;。
</figcaption>
</figure>

当当前选中对象需要暴露可编辑属性时，使用它：

```java
editor.inspectorView.inspect(selectedObject);
```

被 inspect 的对象可以是任意 `IConfigurable` 对象。Inspector 会让该对象构建 configurators，然后将这些 configurators 显示为可编辑 UI。

完整重载允许监听 configurator、关闭时清理，并提供 history action：

```java
editor.inspectorView.inspect(
        selectedObject,
        configurator -> {},
        () -> clearSelection(),
        () -> editor.historyView.pushHistory(name, action)
);
```

Inspector 已经共享 Editor 的 `HistoryView`，因此属性修改可以参与 undo / redo。

### 只读 Inspector { #read-only-inspector }

<VersionBadge version="2.2.42" label="Changed" icon="tag" />

要只显示值而不允许编辑，把 Inspector 或它的任意祖先设为非激活：

```java
editor.inspectorView.setActive(false);
```

在非激活元素下，所有会设置值的控件都会拒绝操作：按钮、开关、输入框、选择器、滑条、颜色选择器、资源对话框、粘贴、列表重排，以及拖放到 configurator 上。读取仍然可用：折叠项可以展开，滚动条可以滚动，列表可以选择。2.2.42 之前，非激活元素下的控件仍然会接收点击、按键、拖放和焦点，并修改值。

::: warning 自定义 configurator
自定义 configurator 必须在修改值的位置检查 `isActiveInHierarchy()`。`isActive()` 只反映元素自身的标志，不包括祖先。挂在 UI 根节点上的弹窗和菜单不在面板内，要在打开它们之前检查。
:::

本页只介绍如何在编辑器中使用 Inspector。Configurable / Configurator 系统见 [Configurable](../../configurable/index.md)。

## HistoryView

`HistoryView` 是 Editor 默认的 undo / redo 栈。它本身也是一个可见 View，因此用户可以跳转到历史记录点。

记录一个修改：

```java
editor.historyView.pushHistory(
        Component.translatable("shop.rename_entry"),
        EditAction.of(
                () -> entry.setName(newName),
                () -> entry.setName(oldName)
        )
);
```

如果 `execute` 为 true，action 会立即执行。如果为 false，则只记录。

当 history item 使用相同 source 和 name 时，可以合并。这适合来自同一个 configurator 或文本输入框的连续编辑。

`clearRedo()` <VersionBadge version="2.2.42" label="自" icon="tag" /> 丢弃所有可以 redo 的条目。在快照恢复替换了这些条目所作用的对象之后调用它，因为此时 redo 它们不会改变任何仍在显示的内容。

`HistoryView` 监听：

* `CommandEvents.UNDO`
* `CommandEvents.REDO`

`Editor` 会处理当前项目的 `CommandEvents.SAVE`。`GraphEditorView` 是自定义 View 处理内部 undo / redo 栈的参考。

## 命令处理 { #command-handling }

<VersionBadge version="2.2.42" label="Changed" icon="tag" />

Edit 类快捷键（undo、redo、copy、cut、paste、duplicate、select all、find）和 Save 以命令的形式到达 View。命令名是 `CommandEvents` 中的常量。哪个 chord 发送哪个命令由 [keymap](../keymap.md) 决定。

命令有两种路由方式：

* **有焦点时。** `EXECUTE_COMMAND` 事件从焦点元素开始，沿祖先**冒泡**。因此即使焦点在 View 的某个子元素上，View 仍然能收到 copy、paste 和 undo。
* **没有焦点时。** `VALIDATE_COMMAND` 事件依次询问各元素。第一个调用 `stopPropagation()` 的元素认领该命令，随后 `EXECUTE_COMMAND` 发给它。

两个事件使用相同的条件处理，执行了命令就停止事件：

```java
addEventListener(UIEvents.VALIDATE_COMMAND, event -> {
    if (CommandEvents.COPY.equals(event.command) && hasSelection()) {
        event.stopPropagation();
    }
});
addEventListener(UIEvents.EXECUTE_COMMAND, event -> {
    if (CommandEvents.COPY.equals(event.command) && hasSelection()) {
        event.stopPropagation();
        copySelection();
    }
});
```

::: warning 处理了就要停止
自 2.2.42 起，处理了命令却没有调用 `stopPropagation()` 时，事件会继续冒泡，祖先会再执行一次。例如 `HistoryView` 监听在 Editor 上，一个自己执行 undo 却不停止事件的 View 会撤销两次。自 2.2.43 起，只有当某个 handler 停止或认领了命令时，快捷键才不会再传给游戏。
:::
