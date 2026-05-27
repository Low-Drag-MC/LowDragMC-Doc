# Inspector 与 History

`Inspector` 可以展示任何 `IConfigurable` 对象。Editor 中的 `InspectorView` 只是对同一个组件的 `View` 包装。

```java
editor.inspectorView.inspect(selectedObject);
```

被 inspect 的对象会构建一个根 `ConfiguratorGroup`。Inspector 会把它加入滚动视图，并监听所有 child configurator 发出的 `Configurator.CHANGE_EVENT`。

## 监听变更

当外部 editor 需要响应属性变更时，使用完整重载：

```java
editor.inspectorView.inspect(
        selectedObject,
        configurator -> markDirty(),
        () -> clearPreview(),
        () -> refreshView()
);
```

参数含义：

* `listener`：configurator 变化时调用。
* `onClose`：当前 inspected object 被清空或替换时调用。
* `historyAction`：undo/redo 恢复该 configurable 后调用。

当 inspected object 改变时，`Inspector` 会按 group path 保留匹配 group 的折叠状态。稳定的 group label 会让状态恢复更自然。

## History 记录

`Inspector` 把 undo/redo 记录委托给：

```java
IConfigurable.createHistoryRecorder()
```

默认实现会在对象实现 `INBTSerializable` 时返回基于快照的 recorder。该 recorder 使用 `SerializableRecordAction`，所以每次 configurator 变化都可以记录进 editor 的 `IHistoryStack`。

```java
public class ShopEntry implements IConfigurable, INBTSerializable<CompoundTag> {
    // annotated fields
}
```

返回 `null` 可以关闭 inspector 自动 history：

```java
@Override
public IConfigurableHistory createHistoryRecorder() {
    return null;
}
```

当对象需要特殊 history 策略时，返回自定义 recorder。

```java
@Override
public IConfigurableHistory createHistoryRecorder() {
    return (stack, name, source) -> {
        var before = captureStateBeforeEdit();
        var after = captureCurrentState();
        Runnable[] onExecute = new Runnable[1];
        Runnable[] onUndo = new Runnable[1];

        stack.pushHistory(name, EditAction.of(
                () -> {
                    restore(after);
                    if (onExecute[0] != null) onExecute[0].run();
                },
                () -> {
                    restore(before);
                    if (onUndo[0] != null) onUndo[0].run();
                }
        ), source, false);

        return new IConfigurableHistory.Handle() {
            @Override
            public IConfigurableHistory.Handle setOnExecute(@Nullable Runnable action) {
                onExecute[0] = action;
                return this;
            }

            @Override
            public IConfigurableHistory.Handle setOnUndo(@Nullable Runnable action) {
                onUndo[0] = action;
                return this;
            }
        };
    };
}
```

可序列化数据模型优先使用自动 history。对象修改外部状态、临时 editor 状态，或者不能用 NBT 快照时，再使用手动 history。

Editor 侧 Inspector 用法见 [Built-in Views](../editor/views/builtin-views.md#inspectorview){ data-preview }。
