# Inspector And History

`Inspector` displays any `IConfigurable` object. The editor `InspectorView` is a thin `View` wrapper around the same component.

```java
editor.inspectorView.inspect(selectedObject);
```

The inspected object builds a root `ConfiguratorGroup`. The inspector adds it to a scroll view and listens for `Configurator.CHANGE_EVENT` from all child configurators.

## Listening To Changes

Use the overload when the surrounding editor needs to react to property changes.

```java
editor.inspectorView.inspect(
        selectedObject,
        configurator -> markDirty(),
        () -> clearPreview(),
        () -> refreshView()
);
```

Arguments:

* `listener`: called when a configurator changes.
* `onClose`: called when the inspected object is cleared or replaced.
* `historyAction`: called after undo or redo restores the inspected configurable.

When the inspected object changes, `Inspector` preserves matching group collapse states by group path. Stable group labels make this restoration feel consistent.

## History Recording

`Inspector` delegates undo/redo recording to:

```java
IConfigurable.createHistoryRecorder()
```

The default implementation returns a snapshot recorder when the object implements `INBTSerializable`. That recorder uses `SerializableRecordAction`, so each configurator change can be recorded into the editor's `IHistoryStack`.

```java
public class ShopEntry implements IConfigurable, INBTSerializable<CompoundTag> {
    // annotated fields
}
```

Return `null` to disable automatic inspector history:

```java
@Override
public IConfigurableHistory createHistoryRecorder() {
    return null;
}
```

Return a custom recorder when your object needs a specialized history strategy.

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

Use automatic history for serializable data models. Use manual history for objects that edit external state, temporary editor state, or data that cannot be snapshotted with NBT.

The editor-side Inspector usage is covered in [Built-in Views](../editor/views/builtin-views.md#inspectorview).
