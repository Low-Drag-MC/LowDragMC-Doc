# Blueprint Node Reference

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

MBD2 contributes 235 nodes under `mbd2/…`. They sit alongside KilaGraph's generic set — math, logic, string, list, map, flow control, and the `mc.*` vanilla nodes — in the same palette.

<figure>
<img src="/assets/multiblocked2/blueprints/node-library.png" alt="Blueprint node library panel listing node groups and their entries">
<figcaption>The node library, opened from the canvas. Groups are the `mbd2/…` paths below.</figcaption>
</figure>

Every node carries a description in the editor, so this page is a map of the palette rather than a per-node listing.

<figure>
<img src="/assets/multiblocked2/blueprints/node-description.png" alt="A blueprint node's description panel showing its summary and per-port documentation">
<figcaption>Selecting a node shows what it does and what each port means. Read that first; this page only tells you where to look.</figcaption>
</figure>

## Info nodes and info blocks

Several groups use a two-level shape. An **info node** — *Machine Info*, *Recipe Logic Info*, *Recipe Info* — takes a `target` and hosts **info blocks** added with its `Add Block` button; each block reads one property onto its own output pin.

That is why `mbd2/machine` holds 38 entries: most are blocks of *Machine Info*, not standalone nodes. Leave `target` unwired and the node reads the blueprint's own machine, its recipe logic, or the event's recipe.

## Groups

### `mbd2/event`

**33 nodes.** One entry node per machine event, plus the three that write back into an event: **Cancel Event**, **Set Event Recipe**, **Set Machine Drops**, **Set Interaction Result**, **Set Item Interaction Result**.

Entry nodes: On Load, Machine Removed, Machine Placed, Machine Tick, Client Tick, Neighbor Changed, Machine Drops, Open UI, Build UI, Use Without Item, Use Item On, Use Catalyst, State Changed, Structure Formed, Structure Invalid, Custom Data Updated, Animation Keyframe, Recipe Status Changed, Recipe Modify (Before), Recipe Modify (After), Before Recipe Working, On Recipe Working, On Recipe Waiting, After Recipe Working, On Consume Inputs, On Recipe Finish, Fuel Recipe Modify, Fuel Burning Finish.

::: warning
**Fuel Burning Finish** is never dispatched in `21.1.1`. **Use Item On** has no KubeJS equivalent — this is the only way to script it.
:::

### `mbd2/machine` and `mbd2/machine/action`

**38 and 27 nodes.** Reads and writes for the machine itself: state, tier, name, definition, position, front facing, level, block state, block entity, custom data, offset timer, `Is Client`, `Every N Ticks`, and the trait lookups. The action group holds the writes — **Set Machine State**, **Set Machine Tier**, **Set Custom Data**, **Merge Custom Data**, **Set Front Facing**, **Drop Item**, **Mark Dirty**, **Notify Block Update**, **Schedule Render Update**, **Play State Sound**, **Trigger Animation** — plus the whole [runtime value](../editor/runtime-values.md) surface:

| Reads | Writes |
| --- | --- |
| Get Runtime Bool / Int / Decimal / Text / IO / Box | Set Runtime Value (Boolean / Number / Decimal / Text / IO / Box) |
| Is Runtime Value Overridden, Runtime Value Names | Clear Runtime Value, Clear All Runtime Values |
| Auto IO Info, Auto World IO Info, Get Auto IO Side, Get Capability IO Side | Set Auto IO Enabled / Side / Interval, Set Auto World IO Enabled / Side / Interval / Speed / Range, Set Capability IO Side |

Use **Merge Custom Data** rather than read-modify-write: the tag is change-tracked by content, so merging in place is both correct and cheaper.

### `mbd2/machine/redstone`

**8 nodes.** `Get Redstone Signal`, `Get Direct Signal`, `Get Analog Signal` and their `Set` counterparts, plus `Can Connect Redstone` and `Update Signal`. These are the machine's **own output** signal and its per-side reads.

To ask "what is the strongest signal reaching this block from any side", use KilaGraph's vanilla **Redstone Power** node (`mc.redstone`) with the machine's `Level` and `Position` — that is what `redstone_control` does.

### `mbd2/machine/fx`

**4 nodes.** **Play Machine FX** / **Stop Machine FX** fire a named entry from the machine's [FX library](../editor/machine-fx.md). **Emit Photon FX** / **Kill Photon FX** take an effect id directly. All four are client-side.

### `mbd2/multiblock`

**9 nodes.** `Is Formed`, `Is Formed And Valid`, `Multiblock Parts`, `Part Positions`, `Part Machine`, `Controller Machine`, `Part Controllers`, `Structure Error`, `Check Pattern`. On a single-block machine these answer empty rather than failing, so a blueprint using them is harmless when bound to one.

### `mbd2/recipe` and `mbd2/recipe/logic`

**40 and 26 nodes.** `mbd2/recipe` reads and **rewrites** a recipe: duration, priority, data, id, XEI visibility, per-tick flag, plus a full content CRUD — `Recipe Content Count`, `Recipe Content At`, `Add Recipe Content`, `Set Recipe Content`, `Remove Recipe Content`, `Clear Recipe Contents`, `Content Of`, `Content With`, `Content Value`, `Content Index Of Slot`, and an NBT path (`Content To Nbt` / `Content From Nbt`) for capabilities with no typed constructor node. `Scale Recipe` and the `Content Modifier` nodes apply amount/duration/parallel factors.

`mbd2/recipe/logic` is the scheduler: `Status`, `Progress`, `Progress Percent`, `Max Progress`, `Is Working` / `Waiting` / `Idle` / `Suspended` / `Active`, `Waiting Reason`, fuel state, `Running Recipe`, `Origin Recipe Id`, `Continuous Running Time` — and the writes `Set Progress`, `Set Recipe Duration`, `Set Recipe Status`, `Set Working Enabled`, `Set Waiting`, `Interrupt Recipe`, `Mark Recipe Dirty`, `Reset Recipe Logic`.

::: info Rewriting a recipe
Only inside `Recipe Modify (Before/After)`, and only on a copy — use `Copy Recipe` / `Deep Copy Recipe`, edit it, and hand it to **Set Event Recipe**. Editing the registry recipe changes it for every machine.
:::

Typed constructors for capability content live in per-mod subgroups: `mbd2/recipe/create` (Rotation), `mbd2/recipe/mekanism` (Chemical), `mbd2/recipe/pneumaticcraft` (Pressure/Air). Item, fluid and entity ingredient nodes are in `mbd2/recipe` itself.

### `mbd2/trait` and its subgroups

**32 nodes across six groups.** `mbd2/trait` resolves a trait to a typed handler: **Trait Item Handler**, **Trait Fluid Handler**, **Trait Energy Storage**, **Trait Definition**. The rest operate on one:

| Group | Nodes |
| --- | --- |
| `mbd2/trait/item` | Slot Count, Slot Limit, Is Item Valid, Insert Item, Insert Item Into Slot, Extract Item From Slot, Set Slot |
| `mbd2/trait/energy` | Energy Info, Receive Energy, Extract Energy |
| `mbd2/trait/mekanism` | Trait Chemical Handler, Trait Heat Handler, Chemical Tank Count/Contents, Insert/Extract Chemical, Add Heat, Heat Info |
| `mbd2/trait/pneumaticcraft` | Trait Air Handler, Trait Heat Exchanger, Air Info, Add Air, Heat Exchanger Info, Add Exchanger Heat |
| `mbd2/trait/ae2` | Trait ME Storage, ME Insert, ME Extract, ME Item Count |

**Extract Item From Slot** with `simulate` on is how you read a slot — there is no separate peek node, and forgetting the flag eats the player's items.

### `mbd2/io`

**4 nodes.** `IO Info`, `IO Of Name`, `IO Choose`, `Next IO` — for graphs that pass an `IO` value around, such as an auto-IO side cycler.

### Optional integrations

| Group | Requires | Nodes |
| --- | --- | --- |
| `mbd2/naturesaura` | Nature's Aura | Aura In Area, Drain Aura, Store Aura |
| `mbd2/ars_nouveau` | Ars Nouveau | Source In Area, Take Source, Give Source |

These appear only when the mod is loaded, exactly like their traits and capabilities.

### `mbd2/ui`

**1 node.** **Set Item** puts an `ItemStack` into a UI item slot. Everything else a UI blueprint needs — load a template, select by id, add a child, attach a stylesheet, add a class, listen for an event — is a generic LDLib2 UI node. See the [Auto IO panel](./built-in.md#auto-io-panel).
