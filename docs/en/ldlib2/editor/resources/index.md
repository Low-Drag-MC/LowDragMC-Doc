# Resource System

The resource system is for reusable editor assets: UI templates, textures, colors, graphs, shop presets, or any data type that should appear in the resource panel.

The main pieces are:

* `Resources`: the list of resource types exposed by a project.
* `Resource&lt;T&gt;`: the definition of one resource type.
* `ResourceInstance&lt;T&gt;`: runtime state for that resource type.
* `IResourceProvider&lt;T&gt;`: a source of resources.
* `IResourcePath`: a typed path to one resource.
* `ResourceView`: the built-in editor view that displays resources.

Expose resource types from a project:

```java
@Override
public Resources getResources() {
    return Resources.of(ShopEntryResource.INSTANCE);
}
```

## Resource

`Resource&lt;T&gt;` defines one resource type. It provides:

* icon,
* name,
* file extension,
* default display mode,
* default UI width,
* built-in resources,
* NBT serialization and deserialization.

Override `buildBuiltin(...)` to add built-in resources. Override `createResourceProviderContainer(...)` when the resource needs custom resource-panel behavior.

## Define a Custom Resource

Create one `Resource&lt;T&gt;` subclass for each asset type you want to expose.

```java
public class ShopEntryResource extends Resource<ShopEntry> {
    public static final ShopEntryResource INSTANCE = new ShopEntryResource();

    public ShopEntryResource() {
        setDefaultDisplayMode(DisplayMode.LIST);
        setDefaultUIWidth(30);
    }

    @Override
    public IGuiTexture getIcon() {
        return Icons.ITEM;
    }

    @Override
    public String getName() {
        return "shop_entry";
    }

    @Override
    public void buildBuiltin(BuiltinResourceProvider<ShopEntry> provider) {
        provider.addResource("empty", new ShopEntry());
    }

    @Nullable
    @Override
    public Tag serializeResource(ShopEntry value, HolderLookup.Provider provider) {
        return ShopEntry.CODEC.encodeStart(provider.createSerializationContext(NbtOps.INSTANCE), value)
                .result()
                .orElse(null);
    }

    @Nullable
    @Override
    public ShopEntry deserializeResource(Tag nbt, HolderLookup.Provider provider) {
        return ShopEntry.CODEC.parse(provider.createSerializationContext(NbtOps.INSTANCE), nbt)
                .result()
                .orElse(null);
    }
}
```

`getName()` is important. It is used for the resource tab, file extension, metadata file, and resource path identity.

By default, the file extension is:

```text
.<resource name>.nbt
```

For `shop_entry`, file resources use `.shop_entry.nbt`.

## Expose Resources from a Project

Add your resource type to the project:

```java
private final Resources resources = Resources.of(
        ShopEntryResource.INSTANCE,
        TexturesResource.INSTANCE,
        ColorsResource.INSTANCE
);

@Override
public Resources getResources() {
    return resources;
}
```

When the project is loaded, the editor calls `resourceView.loadResources(project.getResources())`.

## Use a Resource

Get a resource through its instance and path:

```java
var path = IResourcePath.parse("file(./ldlib2/assets/example.shop_entry.nbt)");
var entry = ShopEntryResource.INSTANCE.getResourceInstance().getResource(path);
```

For user-authored resources, store `IResourcePath` in your project data instead of copying the resource value. This lets the editor reload file-backed resources and keeps projects small.

## ResourceInstance

`ResourceInstance&lt;T&gt;` is the runtime holder for a resource type. It owns:

* built-in providers,
* custom providers,
* cached lookups,
* display mode,
* grid item size,
* selector dialogs.

It also persists resource panel metadata such as custom providers and display settings.
