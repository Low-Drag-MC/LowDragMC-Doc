# Material System

![Material resources loaded by the current Photon project](/assets/photon2/resource-material.webp)

*The browser mixes built-in and project providers; selecting a material exposes its shader, textures, and settings in the Inspector.*

Materials contain shader inputs, and some also bring their own render state. Assign one under an emitter's **Renderer > Material**; the emitter geometry and material must be compatible.

![Material options in Photon](/assets/photon2/material.png)

## Material Types

| Material | Best for | Main inputs |
| --- | --- | --- |
| Texture | A full texture or arbitrary resource | texture, discard threshold, HDR color/mode, pixel art, Soft Particles, Lit by Dynamic Lights |
| Sprite | A Minecraft sprite/atlas region | sprite id, interpolation and pixel-art filtering, Soft Particles, Lit by Dynamic Lights |
| Kila | Common VFX looks without a graph | switchable modules, presets, particle-data drivers, its own render state |
| Shader Graph | New custom particle shading | graph resource, exposed parameters, optional Own Render State |
| Custom Shader | Existing Core Shader files | shader id, uniforms, texture/curve/gradient samplers |
| UI Resource | Reusing an LDLib UI texture resource | UI resource path and color |
| Block Atlas | Minecraft block/item atlas rendering | atlas sprite and Block Atlas UV rules |

Texture, Sprite and Block Atlas materials hold no blend, depth or cull settings: those belong to the renderer's material slot (see [Render State](#render-state)). [Kila Material](./kila-material.md) has its own page. For **Lit by Dynamic Lights**, see [Lit Particles and Shaders](../dynamic-lights/lit-particles-and-shaders.md#lit-by-dynamic-lights).

### Soft Particles

<VersionBadge version="2.2.7" label="Since" icon="tag" />

Texture and Sprite materials have a **Soft Particles** toggle group, off by default. It fades the particle where it nears the scene behind it, hiding the hard line where a quad cuts through blocks.

| Option | Default | Description |
| --- | --- | --- |
| Fade Distance | 1 | Distance in blocks over which the particle fades, 0.001–64. |
| Fade Power | 1 | Shape of the fade, 0.01–16. |
| Fade Target | `BOTH` | `BOTH` fades colour and alpha: right for Additive and Soft additive blends. `ALPHA_ONLY` fades alpha only: right for a classic alpha blend. The UI shows the raw enum names. |

Soft particles use the pipeline's scene-depth copy, which is taken only when an enabled material asks for it. The fade is applied after fog and does not show in the material thumbnail. Shader Graph and Custom Shader materials have no toggle: use the **Depth Fade** node or the `SamplerSceneDepth` sampler.

## Render State

Blend, culling and depth are set on the renderer's material slot.

- **Blend** controls how source color/alpha combines with the framebuffer. Additive works well for fire and energy; alpha blend works for smoke and decals.
- **Depth test** hides fragments behind world geometry. **Depth write** decides whether the effect hides later geometry. Transparent effects normally test depth but do not write it.
- **Cull** removes back or front faces. Disable it for two-sided sheets; keep it for closed meshes.
- **Color/HDR multiplier** tints the shader result. HDR color can exceed 1 and therefore feed bloom when HDR is enabled.
- **Pixel art** uses sampling appropriate for sharp texels. Do not enable it for smooth noise or gradients.

<VersionBadge version="2.2.3" label="HDR material inputs" icon="tag" />

### Render State from the Material

<VersionBadge version="2.2.8" label="Since" icon="tag" />

Some materials bring their own blend, culling and depth: a [Kila Material](./kila-material.md) (unless its **Use Slot State** is on), and a Shader Graph Material with **Own Render State** on. For these, the slot shows a **Render State** row:

| Value | Effect |
| --- | --- |
| From Material | Default. The slot uses the material's state. Its own blend, cull and depth rows are hidden and replaced by "Render state from the material: …". |
| Custom | The slot's own rows apply. |

Materials that bring no state, such as Texture, Sprite and Custom Shader, always use the slot's rows; the Render State row is hidden for them.

The slot's **Blend** dropdown picks a blend by name: Alpha, Additive, Soft additive, Multiply or Opaque. **Custom** means the factors match no preset. **Blend Mode** below it still holds the raw factors.

A material's render state can also turn on **Back First**: a double-sided mesh is drawn twice, back faces first and then front faces, so a closed transparent shield or orb sorts itself.

## Geometry Compatibility

Texture, Sprite, Kila, Shader Graph, and Custom Shader materials work on ordinary tile particles. Model rendering also requires a model-compatible vertex path. Trail, Beam, and AraTrail provide length/point UV and normals instead of billboard UV semantics. A graph that uses only **Particle Data** is portable; one that reads a kind-specific **Additional Data** channel must be checked against the [channel matrix](./additional-gpu-data.md). Kila Material draws on every geometry; see [Geometry](./kila-material.md#geometry).

<VersionBadge version="2.2.8" label="Since" icon="tag" />

| Material reads | Particle Emitter | Trail, Beam, AraTrail |
| --- | --- | --- |
| Particle Data only | with or without GPU instancing | with or without GPU instancing |
| Additional Data, Custom Data, or a Kila particle-data driver | with or without GPU instancing | GPU instancing only |

When an emitter cannot provide what one of its materials reads, its inspector shows a **Material needs data** row at the top. **Fix** turns GPU instancing on, or adds the Custom Data stream a Kila driver reads.

::: warning
A material can compile while a selected data channel is unsupported by its emitter. Unsupported Additional Data deliberately reads zero, so the symptom is usually a static or invisible effect—not a shader compile error.
:::

## Project and Global Resources

Project materials travel with the `.fxproj` and are collected when exporting an FX Pack. Global resources are reusable while authoring but must be present under the exported namespace at runtime. Prefer project resources for effects intended for distribution, and use stable lower-case resource paths.
