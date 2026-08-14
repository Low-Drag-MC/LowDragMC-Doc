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

Load failure returns `null` and writes the resource id/path plus exception to the Photon logger. Treat `null` as a normal missing/broken-resource outcome—especially when an optional resource pack is absent.

## FX Pack Mounting

Mounted FX Packs are lowest-priority hidden client resource packs. Their `assets/<namespace>/fx/...` entries behave exactly like jar or resource-pack entries for `getFX()` and `listAllFX()`. A higher-priority ordinary pack may override the same id. Adding/removing a pack requires the relevant mount/reload flow before the resource manager and caches see the new contents.

## Safe Holder Pattern

Cache the `ResourceLocation` or loaded `FX` definition when useful, but do not cache one `FXRuntime` forever without checking `isValid()`. Definitions survive world changes; emitted runtime particles do not.
