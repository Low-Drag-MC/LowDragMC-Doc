# Distribution and FX Packs

<VersionBadge version="2.2.0" label="FX Packs since" icon="package" />

Photon can export a lightweight `.fx` definition or a self-contained `.fxpack`. Choose based on where the referenced resources will come from.

![Photon resource browser showing project and built-in materials](/assets/photon2/resource-material.webp)

*FX Pack dependency collection starts from the resources referenced by the project, including materials, graphs, meshes, and textures.*

## Formats

| Format | Contains | Use it when |
| --- | --- | --- |
| `.fx` | FX object tree and Timeline; resources remain references | The target mod/resource pack already ships every dependency. |
| `.fxpack` | One or more `.fx` files plus collected materials, graphs, meshes, textures, and shaders | Sharing an effect between installations or shipping a standalone effect pack. |

## Runtime Resource Layout

```text
assets/<namespace>/fx/<path>.fx
assets/<namespace>/textures/...
assets/<namespace>/models/...
assets/<namespace>/shaders/...
assets/ldlib2/resources/<provider>/<resource>.<type>.nbt
```

`FXHelper.getFX(ResourceLocation.parse("example:fire"))` resolves `assets/example/fx/fire.fx`.

## Export an FX Pack

Choose **File → Export → FX Pack**, select or create a `.fxpack`, and enter the effect name. The pack filename becomes its namespace and the entered name becomes its path.

Exporting another effect into the same pack is additive. Shared resources are content-addressed and stored once. **Manage FX Pack** lists effects and removes one while garbage-collecting resources no longer referenced by the remaining effects.

## Mounting

Place packs in:

```text
<gameDir>/photon/fxpacks/
```

They are exposed as client resource packs on the next resource reload. Effects inside then appear in `FXHelper.listAllFX()` and can be played like any other resource effect.

::: warning Windows file locks
A mounted pack may be held open by the resource manager. Reload away from it or restart the client before overwriting/removing the same file. The editor reports this as a locked FX Pack.
:::

## Missing Dependency Checklist

When an exported effect is invisible or magenta:

1. Confirm the `.fx` id and namespace.
2. Check the log for failed material, graph, mesh, texture, or shader paths.
3. Ensure Minecraft resource paths are lowercase and contain no spaces.
4. Reload resources and clear the FX definition cache.
5. Prefer `.fxpack` when manually collecting the dependency graph is error-prone.

## Shipping in a Mod

Copy the pack's `assets/` content into `src/main/resources/assets/`, or ship the `.fxpack` as an optional user-installed pack. Do not ship `.fxproj`; it is an authoring file, not a runtime resource.
