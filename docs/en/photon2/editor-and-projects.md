# Editor and Projects

Photon uses the LDLib2 editor framework. The FX project adds a real-time scene, an FX object hierarchy, and a Timeline to the standard resource and Inspector workflow.

## Workspace

| Area | Purpose |
| --- | --- |
| FX Hierarchy | Create, name, parent, reorder, and select FX objects. Copy, paste, and duplicate them together with their Timeline tracks. Place [FX instances](./fx-instances.md). |
| Scene | Preview the runtime, inspect shapes, move objects, and control playback. Toolbar toggles show helpers such as bloom, dynamic lights, and the collision view. |
| Inspector | Edit the selected object's transform, emitter config, modules, material, and renderer. |
| Resources | Create and reuse materials, graphs, curves, gradients, colors, and meshes. |
| Timeline | Sequence objects, animate transforms/config values, play audio, and submit post effects. |
| History | Inspect and undo editor commands. |

<figure>
<img src="/assets/photon2/editor-timeline-overview.webp" alt="Maximized Photon editor showing Scene, Timeline, Resources, Inspector, and Hierarchy">
<figcaption>The maximized editor keeps the Timeline beside the Scene, Resources, Inspector, and Hierarchy; selecting a target connects all five views.</figcaption>
</figure>

### Copy, Paste, and Duplicate

<VersionBadge version="2.2.8" label="Since" icon="tag" />

Right-click in the FX Hierarchy and choose **Copy**, **Duplicate**, or **Paste**, or press `Ctrl+C`, `Ctrl+D`, or `Ctrl+V`. A paste goes under the parent the selected objects share, or under `root`.

A copy carries every Timeline track that targets the copied objects, retargeted to the copies:

- Animation, Activator, Speed, and Audio tracks;
- the copied objects' own clips on Control tracks;
- track groups, trimmed to the copied tracks.

An animated object therefore keeps animating instead of freezing on the frame shown when you copied it.

Since 2.2.8, removing a parent also removes its children for good. Before, they came back after the project was reopened.

### Scene Toggles

The Scene toolbar has icon toggles for helper views. Two are new:

| Toggle | Since | Shows |
| --- | --- | --- |
| **Show dynamic lights** | 2.2.8 | [Dynamic lights](./dynamic-lights/index.md) in the preview. |
| Collision view | 2.2.9 | The selected collider's gizmo, or the selected emitter's last particle contacts with their normals. See [Particle Collision](./particle-system/collision.md). |

## Keyboard Shortcuts

<VersionBadge version="2.2.7" label="Since" icon="tag" />

The FX editor adds these shortcuts to LDLib2's built-in ones. You can rebind any of them in **Settings → Keymap**; see [Keymap](../ldlib2/editor/keymap.md).

| Action | Default |
| --- | --- |
| **Gizmo: None** / **Move** / **Rotate** / **Scale** | `Q` / `W` / `E` / `R` |
| **Gizmo: Toggle Local / Global** | `X` |
| **Cycle Draw Mode (Shaded / Wireframe / Both)** | `Z` |
| **Toggle Bloom** | `B` |
| **Play / Pause** | `Space` |
| **Stop and Rewind** | `Shift+Space` |
| **Step Back One Tick** / **Step Forward One Tick** | `,` / `.` |
| **Reload Effect** | `Ctrl+R` |

LDLib2's built-in edit shortcuts work in the FX Hierarchy and the Scene: `Ctrl+C` / `Ctrl+V` / `Ctrl+D` copy, paste, and duplicate FX objects, and `Ctrl+Z` / `Ctrl+Y` undo and redo. `Ctrl+S` saves the project.

Single-key shortcuts do nothing while you type in a field. The gizmo keys are also ignored while the fly camera is active (right mouse button held), because the fly controls use the same keys.

## File Menu

<VersionBadge version="2.2.9" label="Changed" icon="tag" />

| Item | Does | Needs an open project |
| --- | --- | --- |
| **Export → Export FX (Definition Only)** | Writes the effect as a `.fx` runtime definition. | Yes |
| **Export → Export to FXPack...** | Adds the effect and its dependencies to an `.fxpack`. | Yes |
| **Convert .fx to Project...** | Turns an `.fx` back into an editable project. | No |
| **Manage FXPack...** | Lists a pack's effects, converts them into projects, or removes them. | No |

Since 2.2.9, **Convert .fx to Project...** (new) and **Manage FXPack...** belong to the editor's own File menu rather than the project's, so both work without an open project. See [Distribution and FX Packs](./distribution.md) for exporting, converting, and managing packs.

<figure>
<img src="/assets/photon2/editor-file-menu.webp" alt="Photon editor File menu with Export, Convert .fx to Project, and Manage FXPack">
<figcaption>The editor's File menu: Export, Convert .fx to Project..., and Manage FXPack....</figcaption>
</figure>

## File Types

| File | Role |
| --- | --- |
| `.fxproj` | Editable project file, including project metadata and the authored FX definition. |
| `.fx` | Compressed runtime definition. It references resources by path. |
| `.fxpack` | Resource-pack zip containing one or more effects and their collected dependencies. |
| `*.material.nbt` | Reusable material resource. |
| `*.shader_graph.nbt` | Particle/material Shader Graph. |
| `*.shader_function.nbt` | Reusable shader function graph. |
| `*.fullscreen_graph.nbt` | Fullscreen shader pass. |
| `*.render_graph.nbt` | Multi-pass post-effect graph. |
| `*.mesh.nbt` | Reusable mesh source. |

<VersionBadge version="2.2.9" label="Since" icon="tag" />

The Asset Browser shows `.fx` files with their own FX icon, distinct from `.fxproj`. Opening an `.fx` (double-click) converts it into a project and opens that project; it asks where to save the project first. Right-click an `.fx` to place it as an [FX instance](./fx-instances.md).

Raw model files (`.obj`, `.json`, `.glb`, `.gltf`) can be dropped into the Mesh resource panel. See [glTF models](./particle-system/gltf-models.md).

## Project Resources

An `FXProject` installs Material, Shader Graph, Shader Function, Fullscreen Graph, Render Graph, Color, Curve, Gradient, and Mesh resource panels. A resource can be dragged into a compatible Inspector field or graph input.

File-backed resources under `<gameDir>/ldlib2/assets/` can be shared by several projects. Built-in resources are read-only. Saving a graph resource recompiles dependent materials or passes.

## Authoring and Runtime Files

Do not treat `.fxproj` and `.fx` as interchangeable:

1. Edit and save the project as `.fxproj`.
2. Export `.fx` for local runtime use when all referenced resources already exist.
3. Export `.fxpack` when the effect must travel with its dependencies.

To edit an exported effect again, convert it back with **File → Convert .fx to Project...**. To reuse it inside a bigger effect, place it as an [FX instance](./fx-instances.md) instead of copying its objects.

The editor stamps exported FX data with a project format version. Photon applies registered data fixes while loading older versioned files.

## Practical Rules

- Give runtime-controlled objects stable, unique names; Java code can find them with `FXRuntime#findObject`.
- Keep reusable graphs, materials, gradients, and meshes in named resource folders instead of duplicating inline data.
- After changing a resource file outside the editor, reload resources before judging the preview.
- Use lowercase resource paths without spaces for anything that will ship in a resource pack.
