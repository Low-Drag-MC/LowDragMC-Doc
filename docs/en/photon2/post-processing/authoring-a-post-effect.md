# Authoring a Post Effect

<VersionBadge version="2.2.0" label="Since" icon="tag" />

![A Fullscreen Shader Graph open in the maximized Photon editor](/assets/photon2/graph-fullscreen.webp)

*The graph defines the pixel operation; a Render Graph decides its inputs, pass order, output, and blend behavior.*

This tutorial creates a tint effect, previews it, and drives it from Timeline.

## 1. Create the Fullscreen Graph

1. In **Resources**, create a **Fullscreen Shader Graph** named `wiki_tint`.
2. Add a Texture/Sampler graph variable named `Scene`.
3. Add a Color parameter named `Tint` with white as its default.
4. Connect Fullscreen Position UV to a texture sample of `Scene`.
5. Multiply sampled RGB by `Tint.rgb`; preserve sampled Alpha.
6. Connect the result to Fullscreen Output and save.

Use exposed graph variables for values the Render Graph, Timeline, or Java must change. Ordinary internal constants cannot become pass ports.

## 2. Build the Render Graph

1. Create a **Render Graph** named `wiki_tint_effect`.
2. Add **Scene Color Input**, one **Pass**, and **Effect Output**.
3. Set the Pass source to the `wiki_tint` Fullscreen Graph.
4. Connect Scene Color to the Pass's `Scene` port.
5. Set `Tint` on the pass or connect a Blackboard parameter.
6. Connect Pass output to Effect Output.
7. Leave **Auto Blend** enabled and save.

The Pass ports mirror exposed variables from its source graph. Renaming `Scene` or `Tint` can orphan existing wires; reconnect them after a rename.

## 3. Preview

Open the Render Graph preview and enable it over an actual world scene. Vary Tint and Effect Weight. Check that weight 0 returns the original scene and weight 1 shows the complete effect.

If the output is black, connect Scene Color directly to Effect Output first. Then restore the pass and verify its texture port is wired.

## 4. Add It to Timeline

1. Add a **Post Process Track**.
2. Add a clip and choose `wiki_tint_effect`.
3. Set clip start/duration and its fade/weight curve.
4. Override `Tint` in the clip parameters.
5. Scrub across both clip edges to inspect fade-in and fade-out.

The clip submits a request every active frame. Ending or muting the clip stops submission.

## 5. Package the Effect

The Render Graph depends on its Fullscreen Graph and any sampled texture resources. Save all resources before FX Pack export, then test the exported pack in a clean resource environment to catch global-resource dependencies.
