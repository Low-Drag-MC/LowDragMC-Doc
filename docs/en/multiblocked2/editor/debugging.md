# Debugging Machines and Recipes

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

Use MBD gadgets to separate structure failures from recipe failures. Fix registration and machine wiring before debugging script callbacks.

<figure>
<img src="/assets/multiblocked2/editor/multiblock-pattern.png" alt="MBD2 Multiblock Pattern editor with its controller-layer repetition diagnostic visible">
<figcaption>Editor diagnostics, such as the controller-layer repetition rule shown here, should be resolved before testing the structure in-world.</figcaption>
</figure>

## Multiblock debugger

Use it on the intended controller. It can distinguish “not a controller,” a successfully formed structure, and predicate mismatch information. Work from the first mismatch: later positions may be wrong only because orientation or repetition was already misread.

Check controller facing, layer axis, controller placeholder, repetition range, exact versus partial states, and catalyst alternatives.

## Recipe debugger

Use it on a machine with recipe logic. Compare raw matching with the modified recipe when recipe modifiers or KubeJS events are enabled. A failure normally belongs to one of four layers:

| Layer | Typical cause |
| --- | --- |
| Recipe type | Wrong ID, recipe not loaded, XEI-hidden content mistaken for absent content |
| Condition | World/machine prerequisite currently fails |
| Routing | No matching trait, wrong recipe IO, `slotName` mismatch, distinct handler behavior |
| Storage | Filter, capacity, amount, rate, or output space prevents simulation |

## Debug probe blueprint

Bind `built-in(mbd2:debug_probe)` to the machine and right-click it holding the configured item (a stick by default): it reports machine state, tier and recipe status in chat, and consumes the click so the UI stays shut. Adding a block to one of its Info nodes extends the report. See [built-in blueprints](../blueprints/built-in.md#debug-probe).

## Useful development checks

- Log registry keys for machine definitions, recipe types, capabilities and conditions once after construction.
- Inspect `machine.getAdditionalTraits()` and each handler's capability, IO, slot names and distinct flag.
- Compare handler state before and after simulation; any change during simulation is a bug.
- Test one recipe content at a time, then add per-tick content, chance and conditions.
- Verify both server behaviour and client UI/XEI rendering.
- Check `logs/latest.log` after editing a blueprint — a graph that throws reports **once**, then goes silent.
- Remember that a [runtime value](./runtime-values.md) override outlives the definition change that should have fixed it. `Clear All Runtime Values`, or break and replace the machine, when a setting refuses to take effect.
