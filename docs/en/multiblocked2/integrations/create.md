# Create

<VersionBadge version="21.1.1" label="MBD2" icon="tag" />

Create integration models rotation as one value containing RPM and stress. It adds recipe content, a range condition, a machine Trait, and rotation rendering support.

<figure>
<img src="/assets/multiblocked2/integrations/create.png" alt="MBD2 Machine Traits editor showing the mandatory Create rotation Trait">
<figcaption>The mandatory `!create_rotation` Trait supplied by a Create kinetic machine definition.</figcaption>
</figure>

## Active surface

| Layer | Name | Meaning |
| --- | --- | --- |
| Recipe capability | `create_rotation` | `CreateRotation` value tagged as RPM or stress |
| Condition | `create_rotation` | Min/max RPM and min/max stress |
| Trait | `!create_rotation` | Runtime Create network bridge and recipe handler |
| UI element | `create-rotation-element` | Rotation display/control in authored UI |
| Machine definition type | `create_machine` | Source-registered Java definition type |

The Trait begins with `!` because it is mandatory/internal for the Create machine definition. It does not mean negation.

## Authoring rules

RPM is speed; stress is network load/capacity semantics. They are not interchangeable even though both use the same capability. Use `inputRPM`/`outputRPM` or `inputStress`/`outputStress` according to the desired field.

```js
ServerEvents.recipes(event => {
  event.recipes.example.press()
    .id('example:rotation_pressing')
    .duration(100)
    .inputRPM(64)
    .inputStress(8)
    .rotationCondition(32, 256, 4, 128)
    .inputItems('minecraft:iron_ingot')
    .outputItems('minecraft:iron_block')
})
```

The condition checks all four bounds and consumes nothing. Capability content is handled by the rotation Trait.

## Where the Trait comes from

You do not add `!create_rotation` from the **Add Trait** menu — a **Create Kinetic Machine** project supplies it. Create one in `/mbd2_editor`, export its `.cm` product, and register it from Java under the type key `create_machine`:

```java
event.registerFromResource(ExampleMod.class, "create_machine",
        "examplemod/mbd/machines/mechanical_press.cm");
```

::: warning No KubeJS builder key
`MBDRegistryEvents.machine` accepts `single` and `multiblock` only; `event.create('kinetic', ...)` throws `Unknown machine type`. Adding rotation recipe rows to an ordinary machine does not create a shaft node either — the machine has to be a kinetic definition.
:::

## Validation

Confirm the machine joins the kinetic network, the shaft face matches orientation, current RPM/stress falls inside the condition, disconnecting the shaft stops matching, and recipe input/output values change network behaviour as intended. The editor preview cannot prove membership in a live kinetic network; test rotation direction and the zero-speed and disconnected states in game.
