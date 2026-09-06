# Built-in Blueprints

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

MBD2 ships twelve blueprints. Each does one job most packs want, and each is also a worked example: open one, read the notes on its canvas, and copy it into your own library to change it.

Reference one from a machine as `built-in(mbd2:<name>)`. They are held in memory, so they resolve on a dedicated server with no content directory, and the editor opens them **read-only** — use **Copy** to fork one.

<figure>
<img src="/assets/multiblocked2/blueprints/copy-dialog.png" alt="Blueprint library resource panel listing the twelve built-ins, with the Copy Resource To dialog open on redstone_control">
<figcaption>The blueprint library, forking `redstone_control` into a writable library with **Copy**.</figcaption>
</figure>

## Stack them, do not merge them

A machine's blueprint list is an ordered pipeline, so redstone control plus an overclock plus a bonus output is **three bindings**, not one graph with switches. Anything that would need a "mode" parameter to be worth shipping is two blueprints.

## The twelve

| Blueprint | Hooks | Parameters |
| --- | --- | --- |
| [`redstone_control`](#redstone-control) | Machine Tick | `requiresSignal` `false`, `threshold` `1` |
| [`comparator_progress`](#comparator-progress) | Machine Tick | `invert` `false` |
| [`environment_gate`](#environment-gate) | Before Recipe Working | `needsRain` `false` |
| [`overclock`](#overclock) | Recipe Modify (Before) | `speedPerTier` `2`, `costPerTier` `4`, `maxOverclocks` `4` |
| [`upgrade_slots`](#upgrade-slots) | Recipe Modify (Before) | `traitName` `item_slot`, `slot` `0`, `upgradeItem` sugar, `speedPerUpgrade` `0.5`, `maxUpgrades` `4` |
| [`part_count_bonus`](#part-count-bonus) | Recipe Modify (Before) | `speedPerPart` `0.05`, `maxSpeedup` `3` |
| [`upkeep`](#upkeep) | On Recipe Working | `traitName` `fluid_tank`, `amountPerTick` `10`, `reason` `Out of coolant` |
| [`chance_output`](#chance-output) | On Recipe Finish | `bonusItem` gold nugget, `chance` `0.1`, `traitName` `item_slot` |
| [`output_swap`](#output-swap) | Recipe Modify (Before) | `product` raw iron |
| [`heat_buildup`](#heat-buildup) | Machine Tick + Recipe Modify | `heatPerTick` `1`, `coolPerTick` `2`, `maxHeat` `1000`, `bonusAtMaxHeat` `2` |
| [`auto_io_panel`](#auto-io-panel) | Build UI | `trait` `""`, `name` `""` |
| [`debug_probe`](#debug-probe) | Use Item On | `probeItem` stick |

---

## Redstone control

Reads the strongest signal reaching the machine every tick and sets recipe logic's working-enabled flag from it. `requiresSignal` off means "runs until powered"; on means "only runs while powered".

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-redstone-control.png" alt="redstone_control graph: read, decide, act groups">
<figcaption>The shortest complete blueprint: an event, a read, a decision, a write.</figcaption>
</figure>

Reads *any* side, like a redstone lamp. Swap **Redstone Power** for **Get Redstone Signal** and give it a side to make it directional.

## Comparator progress

Maps recipe progress (0..1) onto 0-15 and writes it to the machine's analog signal, so a comparator against the machine reads it. `invert` flips it.

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-comparator-progress.png" alt="comparator_progress graph: Progress Percent through Remap and To Int into Set Analog Signal">
<figcaption>A `Remap → To Int → Set Analog Signal` chain. Replace `Progress Percent` to report a tank or a slot instead.</figcaption>
</figure>

The remap is not a plain `progress * 15`: that would spend a whole comparator level on "hasn't started".

## Environment gate

Refuses to start a recipe unless the weather matches `needsRain`. A recipe already running is left alone to finish.

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-environment-gate.png" alt="environment_gate graph: machine Level feeding a vanilla Level Info weather read into Cancel Event">
<figcaption>The bridge from a machine to the world: the machine's own `Level` property into a vanilla `mc.*` node.</figcaption>
</figure>

It hooks **Before Recipe Working** — the event that can still say no. Gating *whether* something happens belongs here; gating *while* it happens belongs on **On Recipe Working**, as `upkeep` does.

## Overclock

Takes the machine's tier as a number of overclocks, divides the duration by `speedPerTier` that many times and multiplies the inputs by `costPerTier` that many times. At the defaults, tier 2 runs 4× faster for 16× the inputs. Tier 0 changes nothing.

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-overclock.png" alt="overclock graph: machine tier into a pow, a Scale Recipe modifier and a separate Set Recipe Duration">
<figcaption>Scaling the inputs and setting the duration are separate nodes — `Scale Recipe` cannot move them in opposite directions.</figcaption>
</figure>

Off tier, not off stored energy: a recipe's cost should not depend on when it happened to start.

## Upgrade slots

Looks in one slot of a named item trait, and if it holds `upgradeItem` divides the duration by `1 + count * speedPerUpgrade`. The Mekanism/Thermal shape.

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-upgrade-slots.png" alt="upgrade_slots graph: a simulated slot extraction, an item test and a duration divide">
<figcaption>`Extract Item From Slot` with `simulate` on is how you read a slot without emptying it.</figcaption>
</figure>

Give the machine a small item trait for these and keep it **off** the recipe IO, or the upgrades become recipe inputs.

## Part count bonus

Counts the parts of a formed structure and divides the duration by `1 + count * speedPerPart`, capped at `maxSpeedup`. On a machine that is not a formed multiblock the count is zero and nothing changes.

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-part-count-bonus.png" alt="part_count_bonus graph: Multiblock Parts into a list length and a duration divide">
<figcaption>Every part counts the same. The parts list is already on a pin, so a `For Each` with a `Definition Id` test is the natural next edit.</figcaption>
</figure>

## Upkeep

Drains `amountPerTick` mB from a named fluid trait every working tick and stalls the machine when the tank runs dry, showing `reason` in the UI.

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-upkeep.png" alt="upkeep graph: a fluid drain each working tick with a Set Waiting on failure">
<figcaption>Stalling keeps the progress already made; the machine carries on once the tank is refilled.</figcaption>
</figure>

To charge energy instead, swap the two trait/drain nodes for **Trait Energy Storage** and **Extract Energy**.

## Chance output

Rolls `chance` once per completed recipe and, on success, inserts `bonusItem` into a named item trait.

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-chance-output.png" alt="chance_output graph: On Recipe Finish into a random roll and an item insert">
<figcaption>Hooks **On Recipe Finish**, not After Recipe Working — the outputs have to exist first.</figcaption>
</figure>

A full slot drops the bonus, the same as it would a normal output.

## Output swap

Replaces every item output of the recipe with `product`. Fluid outputs are left alone, and the recipe still has to match its normal **inputs**.

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-output-swap.png" alt="output_swap graph: Clear Recipe Contents on the OUT side then Add Recipe Content">
<figcaption>Remove the `Clear` node and it *adds* the product instead of replacing. Clear and add on the `IN` side to change what the machine consumes.</figcaption>
</figure>

This is the demonstration that a blueprint can change **what** a recipe trades, not only how much of it.

## Heat buildup

The machine warms while it works and cools while idle; the hotter it is, the faster it runs, up to `bonusAtMaxHeat` at `maxHeat`.

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-heat-buildup.png" alt="heat_buildup graph: a per-tick heat accumulator in custom data feeding a duration factor">
<figcaption>Heat lives in the machine's custom data under `heat`, so it survives a chunk unload and can be bound into the machine UI.</figcaption>
</figure>

The same mechanism covers anything a machine has to remember: a maintenance counter, a cooldown, a charge-up. It writes its custom data only on ticks where the heat actually moved.

## Auto IO panel

Adds a tab strip beside the machine's screen; folding a tab out shows the machine's six faces, and clicking a face cycles auto IO there — none, in, out, both. The setting is a [runtime value](../editor/runtime-values.md), so it belongs to that one placed machine and survives a save.

<figure>
<img src="/assets/multiblocked2/blueprints/auto-io-collapsed.png" alt="A machine UI with two small auto IO tab handles stacked on its left edge">
<figcaption>Folded away: one handle per bound blueprint, stacked down the strip beside the machine panel.</figcaption>
</figure>

<figure>
<img src="/assets/multiblocked2/blueprints/auto-io-expanded.png" alt="A machine UI with the auto IO tab folded out, showing a cross of six faces with a per-face tooltip">
<figcaption>Folded out, with the top face hovered. Colours come from `lss/mbd2_auto_io.lss`, not from the graph.</figcaption>
</figure>

| Parameter | Meaning |
| --- | --- |
| `trait` | The trait to configure, named as it appears in the trait list |
| `name` | Tab caption; empty uses the trait's own name |

Nothing is added if that trait does not do auto IO. Bind the blueprint more than once with different `trait` names and the tabs **stack** down the strip — they append to one shared container rather than each building their own, and an open panel pushes the tabs below it down instead of overlapping them.

The strip is positioned outside the machine panel, so appending a tab never moves the machine's own contents.

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-auto-io-panel.png" alt="auto_io_panel graph: UI template loading, element selection, class assignment and click listeners">
<figcaption>Every node here is a general one. There is no "auto IO panel" node doing the work behind a single pin.</figcaption>
</figure>

Two things it demonstrates for any UI blueprint: the look is a stylesheet the pack can replace, and the client learns each face's state through the machine's `@DescSynced` custom data — because runtime values are server-side and never sent.

`lss/mbd2_auto_io.lss` is loaded as a **merged** stylesheet, so a pack restyles the panel by shipping its own file at that path with only the rules it disagrees with. Later packs win. The sheet is attached to the tab strip rather than the screen, so nothing in it can leak into the machine's own UI.

## Debug probe

Right-click the machine holding `probeItem` and it reports machine state, tier and recipe status in chat. The click is consumed, so the UI stays shut while you hold the probe.

<figure>
<img src="/assets/multiblocked2/blueprints/builtin-debug-probe.png" alt="debug_probe graph: Use Item On, an item test, string concatenation and a chat message">
<figcaption>Add a block to one of the Info nodes and append it to the message — every read in the node list works the same way.</figcaption>
</figure>

This is the fastest way to see whether a machine is in the state you think it is, and it needs no scripts or commands.
