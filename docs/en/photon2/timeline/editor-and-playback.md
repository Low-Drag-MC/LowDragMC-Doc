# Timeline Editor and Playback

![The maximized Timeline panel with its track tree, ruler, clips, keys, and playhead](/assets/photon2/editor-timeline-panel.webp)

*Captured from the maximized window so track names, clip ranges, keys, and the red playhead remain readable.*

The Timeline panel combines a track tree, time ruler, clip lanes, and property editors. Select a track or property to expose the operations relevant to that item.

## Transport

<VersionBadge version="2.2.7" label="Changed" icon="tag" />

The transport bar sits at the top of the Timeline panel. Since 2.2.7 its controls are square icon buttons, and step and jump-to-end buttons were added. Hover a button to see its name.

<figure>
<img src="/assets/photon2/timeline-transport.webp" alt="Timeline transport bar with stop, step back, play/pause, step forward, and jump-to-end buttons">
<figcaption>The Timeline transport: stop, step back, play/pause, step forward, and jump to end, followed by the time field and the playback toggles.</figcaption>
</figure>

| Control | Default shortcut | Behaviour |
| --- | --- | --- |
| Stop and rewind to the start | `Shift+Space` | Reset runtime objects and evaluate from time zero. |
| Step back one tick | `,` | Pause and move the playhead one tick back. |
| Play / pause the preview | `Space` | Advance or freeze the master Timeline clock. |
| Step forward one tick | `.` | Pause and move the playhead one tick forward. |
| Jump to the end of the effect's content | | Pause and move the playhead to the end of the content. |
| Current time | | Shows the playhead time in seconds. Type a value and click away to jump there. |
| End condition toggle | | Off (default): the preview ends when every FX object has finished. On: it ends at the Timeline's end. |
| Loop toggle | | On (default): restart from the beginning when the preview ends. Off: hold at the last frame. |
| Scrub | | Drag the playhead to evaluate the effect at that time without normal forward playback. |

The shortcuts can be rebound; see [Keyboard Shortcuts](../editor-and-projects.md#keyboard-shortcuts).

Signals and audio are gated during editor scrubbing so dragging the playhead does not repeatedly fire gameplay events or overlap sounds. In-world forward playback enables both.

## Time and Zoom

The ruler is measured in ticks. Zoom changes the pixels-per-tick scale around the pointer; horizontal scrolling moves the visible time window. The red playhead is the current evaluation time.

## Selection and Editing

- Drag an empty lane region to box-select items.
- Use Ctrl/Shift according to the editor selection behaviour for multi-select.
- Drag selected clips or keys as a group.
- Edge guides snap to nearby clip/key boundaries.
- Clip lanes reject overlapping placement where the track requires one active clip.
- Copy/paste preserves relative offsets and refuses an invalid overlap instead of silently corrupting timing.

## Fast Seek

Scrubbing far forward may need to replay simulation from the start because particle state is not a pure function of one timestamp. The editor coalesces repeated seek requests and uses fast replay so pointer movement does not enqueue a full simulation for every intermediate pixel.

## Editor vs In-World

The editor uses an isolated particle manager and post-effect stack. Audio preview is forced non-positional when needed so it remains audible from the preview camera. In-world playback uses the executor's real level, entity/block anchor, signal hooks, and global post stack.

::: tip Timing check
Preview once by scrubbing for layout, then play forward from zero to verify Control restarts, random seeds, Signals, Audio, and post-effect fades.
:::
