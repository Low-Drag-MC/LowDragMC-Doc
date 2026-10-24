# Extension, Serialization, and Debugging

![Shader and graph resources loaded in the real Photon editor](/assets/photon2/graph-particle-shader.webp)

*When an extension fails, verify registration and serialized type IDs first, then resource resolution, graph compilation, and the active render path.*

Photon's authored model is registry-driven. Extensions are client registrations, not server gameplay registries.

## Extension Points

| Extension | Registry/type |
| --- | --- |
| FX Object | `PhotonRegistries.FX_OBJECTS` / static `FXObjectType` |
| Material | `PhotonRegistries.MATERIALS` / `IMaterial` supplier |
| Number Function | `NUMBER_FUNCTIONS` / `NumberFunction` supplier |
| Shape | `SHAPES` / `IShape` supplier |
| Model Source | `MODEL_SOURCES` / `IModelSource` supplier |
| Timeline Track | `TIMELINE_TRACKS` / static `TrackType` |
| Animated Property | `ANIMATED_PROPERTIES` / static `AnimatedPropertyType` |

Built-ins use `@LDLRegisterClient` and static type singletons where required. A custom FX Object must provide its `FXObjectType`, codec/copy behavior, editor icon/configuration, runtime behavior, and serialization compatibility. A custom Timeline Track also needs a `TrackEditor`; registering only data does not create usable UI.

<VersionBadge version="2.2.9" label="Since" icon="tag" />

Custom FX objects and materials should also report what their first frame loads, through `IFXObject.preload(PreloadContext)` and `IMaterial.preload(MaterialContext, PreloadContext)`. Without these hooks, [preloading](./preloading.md#custom-fx-objects-and-materials) skips them silently, and their first play still hitches.

## File Versions

Current `.fxproj`/`.fx` data uses `FXProject.VERSION = 5`. Versioned project data is migrated through `PhotonFXProjectDataFixer`; exported `.fx` loading wraps the root in project shape, applies fixes, then unwraps it. Unversioned historical `.fx` files use deserializers' legacy fallbacks because their true origin version is unknown.

Do not rewrite NBT fields by hand. Open and re-save old projects in the current editor, then re-export `.fx`/`.fxpack`. The short-lived format that embedded resources directly in `.fx` is unsupported; resources belong in an FX Pack.

## Debug Checklist

1. **FX missing:** verify `assets/<ns>/fx/<path>.fx`, namespace case, pack mount, then inspect `FXHelper` warning.
2. **Shader black/broken:** inspect Core Shader/Graph compile log, reload resources, clear client FX cache.
3. **Runtime stopped after world change:** `isValid()` is expected to become false; create a new runtime for the new `ClientLevel`.
4. **Graph data stays zero:** enable GPU instancing and check the emitter/channel support matrix.
5. **Iris differs:** test with the supported Iris version and both no-pack/active-pack paths; check the Photon compatibility config.
6. **HDR/Bloom differs:** confirm material values exceed 1, HDR target is used, and post-effect priority is before/after Bloom as intended.
7. **First play hitches:** [preload](./preloading.md) the effect; check that custom objects and materials implement the preload hooks.

## Performance

- Use GPU instancing for many equal tile/model/trail primitives; preserve common materials/layouts for batching.
- **Parallel Update** helps computation-heavy emitters, but avoid unsafe external state in worker-updated modules. Since 2.2.9 emitters with collision update in parallel too, while the client config option **Particle Collision → Parallel collision** is on (the default).
- Keep RuntimeValue updates on the client thread and write only when ownership/value changes.
- Merge post-effect requests, downsample wide filters, and avoid Independent executions unless parameters truly must stay separate.
- Clear caches on resource lifecycle events, not every frame.
