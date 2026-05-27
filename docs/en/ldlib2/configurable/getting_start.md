# Getting Start

Configurable starts with an object that implements `IConfigurable`. The default implementation of `buildConfigurator(...)` scans the object with `ConfiguratorParser`, finds `@Configurable` fields, and creates UI rows for them.

```java
import com.lowdragmc.lowdraglib2.configurator.IConfigurable;
import com.lowdragmc.lowdraglib2.configurator.annotation.ConfigNumber;
import com.lowdragmc.lowdraglib2.configurator.annotation.Configurable;

public class ShopEntry implements IConfigurable {
    @Configurable(name = "Display Name")
    public String displayName = "Apple";

    @Configurable(name = "Price", tips = "Cost paid by the player")
    @ConfigNumber(range = {0, 9999}, wheel = 1)
    public int price = 10;

    @Configurable(name = "Enabled")
    public boolean enabled = true;
}
```

Show it in an editor inspector:

```java
ShopEntry entry = new ShopEntry();
editor.inspectorView.inspect(entry);
```

Or use the standalone `Inspector` element:

```java
Inspector inspector = new Inspector();
inspector.inspect(entry);
```

The object does not need to know about the editor. The inspector asks it to build configurators, then displays the returned UI inside a scrollable panel.

## Manual Configurators

Use annotations for ordinary field editing. Override `buildConfigurator(...)` when the UI needs custom layout, generated rows, or controls that do not map cleanly to one field.

```java
public class RuntimeInfo implements IConfigurable {
    @Override
    public void buildConfigurator(ConfiguratorGroup father) {
        father.addConfigurator(new StringConfigurator(
                "Status",
                () -> "Running",
                value -> {},
                "Running",
                false
        ));
    }
}
```

You can also mix both styles:

```java
@Override
public void buildConfigurator(ConfiguratorGroup father) {
    IConfigurable.super.buildConfigurator(father);
    father.addConfigurator(new HeaderConfigurator("Runtime", 5));
}
```

Use manual configurators carefully. Once you bypass field parsing, you are responsible for calling setters, updating the model, and notifying changes.
