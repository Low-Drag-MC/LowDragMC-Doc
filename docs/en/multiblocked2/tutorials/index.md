# End-to-End Registration Tutorials

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

These tutorials connect registration phase, authored definition, recipe creation, restart/reload behavior, and runtime verification. Follow one path from beginning to end before combining APIs.

<figure>
<img src="/assets/multiblocked2/editor/overview.png" alt="MBD2 machine project used as the authored definition shared by the Java and hybrid tutorials">
<figcaption>Every tutorial ultimately produces a registered definition that opens and behaves like this editor-authored machine.</figcaption>
</figure>

```mermaid
flowchart LR
    E["MBD2 editor"] --> P[".rt / .sm / .mb products"]
    P --> J["Java MBDRegistryEvent"]
    J --> RT["Recipe-type registry"]
    J --> M["Machine-definition registry"]
    K1["KubeJS startup_scripts"] --> RT
    K1 --> M
    RT --> S["Generated KubeJS recipe schema"]
    K2["KubeJS server_scripts"] --> R["MBDRecipe"]
    J --> R
    M --> L["RecipeLogic + Traits"]
    R --> L
```

## Pick a tutorial

| Goal | Tutorial |
| --- | --- |
| Ship definitions and built-in recipes inside a Java mod | [Java: machine, recipe type, and recipe](./java-end-to-end.md) |
| Learn the exact KubeJS startup/server split | [KubeJS: registry and recipe scripts](./kubejs-end-to-end.md) |
| Build a complete editor machine but keep pack recipes scriptable | [Editor + Java + KubeJS hybrid](./hybrid-editor-kubejs.md) |

::: warning KubeJS-only boundary
KubeJS can create bare `single` / `multiblock` definitions, but `21.1.1` exposes no supported machine-authoring API for states, renderers, Traits, UI, recipe logic or multiblock patterns. A KubeJS-created shell proves registration; an operational machine comes from the editor or Java.
:::

::: tip Machine behaviour without any of this
If what you want is behaviour rather than a new machine — redstone control, an overclock, a bonus output — bind a [built-in blueprint](../blueprints/built-in.md) instead. No script, no mod, no restart.
:::
