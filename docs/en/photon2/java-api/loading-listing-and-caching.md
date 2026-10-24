# Loading, Listing, and Caching FX

![Project resources resolved by Photon providers](/assets/photon2/resource-material.webp)

*FX lookup and editor resource providers ultimately resolve namespaced files from the active resource stack.*

`FXHelper` resolves `.fx` files through Minecraft's client resource manager.

## ID to Resource Path

```text
FX id:         mymod:combat/hit
resource:      assets/mymod/fx/combat/hit.fx
```

Do not include `fx/` or `.fx` in the `ResourceLocation` passed to the API.

```java
ResourceLocation id = ResourceLocation.fromNamespaceAndPath("mymod", "combat/hit");
FX fx = FXHelper.getFX(id); // cached; null when loading/deserialization fails
```

`getFX(id, false)` bypasses the definition cache for that call. It is intended for diagnostics or special reload flows, not per-tick playback.

Call `getFX` on the render thread. The first call for an id reads the file and builds the definition on the spot, which can compile shaders. The rest of what the first play needs (shader variants, textures, the effects its sub-emitters spawn) loads during that play. To move all of this out of gameplay, [preload](./preloading.md) the effect.

## FX Instances

<VersionBadge version="2.2.9" label="Since" icon="tag" />

An `.fx` that contains [FX instances](../fx-instances.md) is baked when it is read: `getFX` loads each source by id and places its objects into the definition. A runtime then holds ordinary objects, and `findObject` finds placed objects by their names.

- The sources must be loadable by id at runtime. A plain `.fx` export references them; an `.fxpack` export packs them.
- A missing source places nothing. The instance object stays in the effect, empty, and the log names the missing id.
- Sources are cached with the effects that place them and are forgotten together with them.

## Listing

<VersionBadge version="2.2.4" label="Cached resource listing" icon="tag" />

```java
List<ResourceLocation> effects = FXHelper.listAllFX();
```

The immutable returned list includes effects from mod jars, ordinary resource packs, the editor's injected resource directory, and mounted `.fxpack` files. It is sorted by namespace then path and cached because enumerating every pack is expensive.

## Cache Invalidation

```java
int definitionsRemoved = FXHelper.clearCache();
```

Resource reload automatically clears both the definition cache and listing cache. `clearCache()` does not destroy already-created runtimes; those own their copied runtime object data and continue until finished or destroyed.

<VersionBadge version="2.2.9" label="Since" icon="tag" />

```java
FXHelper.invalidate(List.of(id));
```

`invalidate(ids)` forgets only the given effects, plus every effect that places one of them as an FX instance, and drops the listing cache. Every other loaded effect stays cached. The next `getFX` reads the forgotten effects again. Both methods increase `FXHelper.generation()`; see [Reloads and the Cache](./preloading.md#reloads-and-the-cache) for what this means for preloaded effects.

Load failure returns `null` and writes the resource id/path plus exception to the Photon logger. Treat `null` as a normal missing/broken-resource outcome—especially when an optional resource pack is absent.

## FX Pack Mounting

Mounted FX Packs are lowest-priority hidden client resource packs. Their `assets/<namespace>/fx/...` entries behave exactly like jar or resource-pack entries for `getFX()` and `listAllFX()`. Mods, resource packs and the editor's resource directory all have a higher priority, so whichever of them provides the same id wins.

Photon mounts:

- `.fxpack` files placed directly in `<gameDir>/photon/fxpacks/`. Files in subfolders are not loaded.
- `.fxpack` files and unzipped pack folders under `fxpacks/` at the root of a mod jar.

A new pack file is found on the next resource reload (F3+T), like any resource pack.

<VersionBadge version="2.2.9" label="Changed" icon="tag" />

Since 2.2.9 the editor rewrites a pack that is already mounted in place. Effects exported into it, or removed from it, take effect right away, without a reload: Photon forgets only the changed effects, so the next `getFX` reads the new version, and kept effects are [preloaded](./preloading.md) again in the background. Runtimes that are already playing keep the definition they were created from. See [Distribution and FX Packs](../distribution.md) for the editor side.

## Safe Holder Pattern

Cache the `ResourceLocation` or loaded `FX` definition when useful, but do not cache one `FXRuntime` forever without checking `isValid()`. Definitions survive world changes; emitted runtime particles do not.
