# Editor Workflow

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

The MBD2 editor is the primary authoring tool for machine and recipe-type product files.

<figure>
<img src="/assets/multiblocked2/editor/overview.png" alt="MBD2 editor showing project tabs, state hierarchy, scene preview, Inspector, History, and Resources views">
<figcaption>Project views occupy the center; Inspector and History are docked right, Resources below.</figcaption>
</figure>

Run `/mbd2_editor` to open it. The File menu discovers registered machine and recipe-type project providers automatically.

## Authoring sequence

1. Create a project of the required machine type.
2. Configure its definition and states.
3. Add traits, then generate or refine the machine UI.
4. For multiblocks, author predicates, the pattern, and shape information.
5. Save the project and export its product before testing recipes.

The editor can expose a recipe list and recipe UI for recipe-type projects. Use [Recipe system](../recipes/) for the runtime meaning of those fields.
