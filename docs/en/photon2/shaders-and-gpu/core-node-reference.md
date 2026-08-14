# Core Shader Node Reference

![Core math, texture, and artistic nodes connected in a production graph](/assets/photon2/graph-particle-shader.webp)

*Node categories are building blocks; a practical graph usually combines texture sampling, channel math, masks, and output nodes.*

Photon Shader Graph includes KilaGraph's general shader nodes. This page groups them by intent; node tooltips and the node description panel show exact ports and accepted types.

## Numeric and Logic

| Group | Typical nodes | Use |
| --- | --- | --- |
| Basic math | Add, Subtract, Multiply, Divide, Min, Max | Combine masks and values |
| Advanced math | Power, Exp, Log, Sqrt, Reciprocal | Falloff and response curves |
| Range | Clamp, Saturate, Remap, Smoothstep, Step | Normalize and shape transitions |
| Trigonometry | Sin, Cos, Tan, Atan2 | Waves, rotation, polar coordinates |
| Logic | Compare, Select, And, Or, Not | Branch-like masks without Java logic |

Use `Saturate` after arithmetic that feeds Alpha. Use `Smoothstep(edge0, edge1, x)` for a stable soft boundary; swapping the edges reverses the ramp.

## Vector, Matrix, and Channels

- **Compose/Split/Swizzle** builds and extracts vector channels.
- **Dot** measures alignment; **Cross** produces a perpendicular vector.
- **Length/Distance/Normalize** handle direction and radial masks.
- **Matrix Multiply/Transform** changes coordinate spaces. Confirm whether a port expects a point or direction; translation must not affect directions.

## UV and Procedural

UV nodes cover tiling/offset, rotate, polar/twirl, flipbook, and screen-space mapping. Procedural nodes generate noise, checker, ellipse, rectangle, gradients, and Voronoi-like masks. Procedural noise is recalculated per vertex/pixel; a texture is usually cheaper when the pattern does not need to change mathematically.

## Texture and Artistic

Texture Sample reads a texture/sprite with UV and sampler state. Color-space conversion, blend, contrast, hue/saturation, and posterization nodes shape the sampled result. Keep masks in scalar channels instead of carrying `vec4` values through every operation.

## Normal, Fog, and Lighting

Normal nodes unpack and transform normal maps. Lighting nodes consume world normal, light, and view direction; fog nodes mix with Minecraft fog. Photon **Particle Data.litColor** already includes baked block/sky lighting, while raw **color** does not—do not multiply both paths unless that double-lighting is intentional.

## Small Patterns

```text
Dissolve: noise - threshold -> Smoothstep -> Alpha
Rim: 1 - Saturate(Dot(normal, viewDirection)) -> Power -> Emission
Flipbook: ParticleData.uv + frame/tiles -> Sample Texture
Soft particle: texture alpha × Depth Fade -> Alpha
```

For Photon-specific particle, scene, and full-screen inputs, continue with [Photon Node Reference](./photon-node-reference.md).
