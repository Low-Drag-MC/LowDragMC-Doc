# Traits and Machine UI

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

A trait is a configurable machine component. Keep three IO systems separate: recipe-handler IO, sided block-capability IO, and automatic world IO.

<figure>
<img src="/assets/multiblocked2/editor/machine-ui.png" alt="MBD2 Machine UI editor showing hierarchy, canvas, inventory slots, style sheet, simulation, and add-element controls">
<figcaption>The Machine UI canvas; use its add button to generate widgets from configured Traits.</figcaption>
</figure>

## Configure a trait

| Setting | Purpose |
| --- | --- |
| Trait name | Stable lookup name for KubeJS and generated `ui:<name>` IDs |
| Recipe handler IO | Whether recipe logic may consume from or produce into the trait |
| Distinct | Whether capability content must be handled without combining across handlers |
| Slot names | Optional routing names referenced by recipe `slotName` |
| Capability IO | Which world-facing sides allow insertion/extraction, relative to machine front |
| GUI IO | Which actions the machine UI permits |
| Auto IO | Periodic transfer to/from adjacent block capabilities |
| Filter/capacity/rate | Trait-specific storage constraints |

## Core traits

| Trait type | Runtime storage | Recipe handlers | World capability |
| --- | --- | --- | --- |
| `item_slot` | Item stack transfer | `item`, `item_durability` | Sided item handler |
| `fluid_tank` | Fluid storage list | `fluid` | Sided fluid handler |
| `forge_energy_storage` | Copiable energy storage | `forge_energy` | `Capabilities.EnergyStorage.BLOCK` |
| `entity_handler` | Entity interaction configuration | `entity` | Behavior-oriented; not normal inventory storage |

Optional traits appear only with their dependency. See [Integrations](../integrations/).

## Generate and bind UI

Trait definitions implementing `IUIProviderTrait` create templates using IDs based on `ui:<trait-name>`. `SLOT` layouts flow into input/output columns; `BAR` layouts flow below them. The UI generator can also add recipe progress, fuel progress, recipe-viewer lookup, and player inventory.

Generate after trait names and counts are stable. If you rename a trait, verify all generated widget IDs, recipe `slotName`/`uiName`, and scripts.

At runtime, `initTraitUI` binds the actual trait to matching widgets. Storage remains server-authoritative; controls should send actions or use data bindings rather than directly trusting client-side values.

## Cross-part UI

Capability proxying is implemented for runtime capabilities. Cross-part/controller widget ID rewriting remains incomplete in current multiblock UI code, so do not document custom IDs such as historical `part:<trait>@ui:<id>` as stable 1.21.1 behavior.
