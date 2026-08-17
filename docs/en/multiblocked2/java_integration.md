# Java Integration (Moved)

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

<figure><img src="/assets/multiblocked2/integrations/integration-map.png" alt="Editor registry populated by built-in and Java integration Trait types"><figcaption>The current Java extension section explains how code registrations become these editor-visible entries.</figcaption></figure>

This URL is kept for links written for the 1.20.1 wiki. The 1.21.1 Java API is now a complete section:

- [Architecture and extension-point map](./java/)
- [Gradle dependency setup](./java/dependency-setup.md)
- [Registration and lifecycle](./java/registration-and-lifecycle.md)
- [Machine and recipe-type registration](./java/custom-machine.md)
- [Custom RecipeCapability](./java/custom-recipe-capability.md)
- [Custom Trait and recipe handler](./java/custom-trait.md)
- [Custom RecipeCondition](./java/custom-condition.md)
- [Testing extensions](./java/testing.md)

::: warning 1.20.1 examples
Do not reuse the old Forge event-bus setup, `create_machine` resource type, or commented Botania/GTCEu/Embers paths. The linked pages are verified against MBD2 21.0.11 on NeoForge/Minecraft 1.21.1.
:::
