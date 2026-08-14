# StructuredTagEditor

<VersionBadge version="2.2.9" label="Since" icon="tag" />

`StructuredTagEditor` edits an NBT `Tag` as a tree. It supports primitive tags, lists, compounds and NBT arrays, so users do not need to type raw SNBT for every change.

<figure>
<img src="/assets/ldlib2/structured-tag-editor.png" alt="StructuredTagEditor with an expanded CompoundTag">
<figcaption>
An expanded <code>CompoundTag</code>. Each row exposes the key, NBT type, and an editor or summary for its value.
</figcaption>
</figure>

```java
var editor = new StructuredTagEditor()
        .setCompoundTagOnly()
        .setValue(tag, false)
        .setTagResponder(updated -> save(updated));
```

The editor copies assigned tags. Treat the callback value as the edited result and copy it before retaining it.

| API | Description |
| --- | --- |
| `setValue(Tag, boolean)` | Replaces the edited value. |
| `setTagResponder(Consumer<Tag>)` | Receives each accepted change. |
| `setTagValidator(Predicate<Tag>)` | Rejects values that do not meet an application rule. |
| `setCompoundTagOnly()` | Limits the root to `CompoundTag`. |
| `setListOnly()` | Limits the root to `ListTag`. |
| `setAny()` | Allows every tag kind. |

## TagField integration

`TagField` now opens this editor from its edit button. Existing `setCompoundTagOnly()`, `setListOnly()` and validators are forwarded to the dialog, so no extra setup is needed for the standard field.
