# Running Tests

This page covers how to run UI tests without getting in your way: in the background, without any window, at a fixed resolution, and split across several clients. Every command here needs the Gradle scripts from [Set up in your mod](./index.md#set-up-in-your-mod).

| Mode | Command | Window |
| --- | --- | --- |
| Normal | `gradlew runClient -PldTest=all` | Shown, takes focus once at launch. |
| Headless | `gradlew runClient -PldTest=all -PldTestHeadless` | Never shown. No monitor needed. |
| Parallel | `gradlew runParTest -PldTest=all -PldTestJobs=2` | One client per job. Combine with `-PldTestHeadless`. |

## Background runs

A normal run does not need the window focused and never moves your mouse, so you can keep working on the same machine.

- Input goes straight into the screen, and hover follows a synthetic cursor. The physical cursor stays where you left it.
- Screenshots read the game's main framebuffer, so they are not affected by focus or other windows on top.
- **The window takes focus once, at launch.** FML's early loading window creates it before any mod code runs, so the harness cannot prevent this. After that, nothing raises or focuses it again. Use a [headless run](#headless-runs) to avoid even that.
- **Clicks and key presses from the OS are dropped while a run is active**, so a stray click on the game window cannot land in the middle of a test. To stop a run, close the window, wait for the watchdog, or stop Gradle.

`-PldTestInputMode=REAL` is the exception: it moves the real cursor and waits for the OS to deliver the event, so it focuses the window and needs the foreground.

## Headless runs

<VersionBadge version="2.2.39" label="Since" icon="tag" />

`-PldTestHeadless` never shows a window, and the machine does not need a monitor. A run started over SSH, on a machine with no display attached, produces the same report and screenshots.

```text
gradlew runClient  -PldTest=all   -PldTestHeadless
gradlew runParTest -PldTest=all   -PldTestJobs=2 -PldTestHeadless
gradlew runMpTest  -PldMpTest=all -PldTestHeadless
```

- The window is hidden instead of maximized. Its size comes from `-PldTestWindow`, or `1920x1080` when that is omitted.
- Screenshots are read from the main render target, not the screen, so they come out the same.
- `runParTest` and `runMpTest` forward the flag to every client and server they start.
- `-PldTestInputMode=REAL` is rejected when Gradle configures the build, because real input needs a focusable window.
- Without the flag, nothing changes: the window is shown and maximized as before.

### Early loading window

<VersionBadge version="2.2.40" label="Since" icon="tag" />

FML's early loading window needs a primary monitor. When there is none, it does not fail; it waits forever behind a dialog nobody can close. For a headless run, `ldlib2-uitest.gradle` checks whether the machine has a display:

- **Display found:** the early window stays on, so the client gets the same OpenGL context a player's game gets.
- **No display**, or an SSH session: the script writes `earlyWindowControl = false` into the run directory's `config/fml.toml` and puts the original value back after the run, even if the client crashed.

The check can be wrong. A disconnected remote desktop, for example, can report a screen while no monitor is actually available, and the run hangs. Turn the early window off yourself in one of three ways:

| Override | Reaches |
| --- | --- |
| `-PldTestEarlyWindow=false` | This build only. It is **not** passed to the child builds that `runParTest` and `runMpTest` start. |
| Environment variable `LDLIB2_TEST_EARLY_WINDOW=false` | This build and every child build, because child builds inherit the environment. |
| File `build/ldlib2-uitest-no-monitor` | Every build of the project. `runParTest` creates it automatically after a shard dies from a missing monitor, so the next run works. Delete it when a display is back; `gradlew clean` also removes it. |

::: warning Without the early window, the client runs on OpenGL 3.2 core

The early window is what requests a modern OpenGL context. Without it, Minecraft creates its own 3.2 core context, which has no OpenGL 3.3 entry points such as instanced rendering. A mod that calls them can make the client process exit without an exception or crash report. Only turn the early window off on machines that really have no display.

:::

### Resolution

Two sizes matter, and they are easy to confuse:

| Size | Example | Set by |
| --- | --- | --- |
| Framebuffer: the pixel size of every screenshot | `3840x2160` | `-PldTestWindow=WxH` |
| Logical viewport: the coordinate space the UI is laid out in | `1920x1080` | Framebuffer ÷ GUI scale |

- **For sharper screenshots of the same layout, raise both.** `-PldTestWindow=3840x2160` alone gives the UI a 1920x1080 viewport at GUI scale 2, which is a different layout, not a sharper one. Use `-PldTestWindow=3840x2160 -PldTestGuiScale=4`.
- **Never let the GUI scale go to auto.** Auto picks the largest scale the window allows, which is 8 on a 4K frame, and a full-screen UI collapses into a 480x270 viewport. `-PldTestGuiScale` defaults to `2` for this reason.
- **Pin `-PldTestWindow` whenever screenshots are compared between machines.** Without it the size is 1920x1080 in a headless run, but the monitor's work area otherwise.
- A hidden window is not limited by the desktop size, so 4K screenshots work on a machine with no monitor.

## Parallel runs

<VersionBadge version="2.2.38" label="Since" icon="tag" />

`runParTest` splits the selected scenarios across several client processes, runs them at the same time, and merges their reports. It needs `ldlib2-uitest-par.gradle`.

```text
gradlew runParTest -PldTest=all -PldTestJobs=2
gradlew runParTest -PldTest=group:mymod -PldTestJobs=2 -PldTestHeadless
```

- `-PldTestJobs` is required; the task fails without it. Start with `2`.
- Each job is a complete Minecraft client, run as task `runUiTestShard<N>` in its own `runs/uiTestShard<N>/` directory, with its own world, log, and options.
- Scenarios are balanced by how long each took last time, recorded in `build/ldlib2-uitest-weights.json`. The first run, with no measurements yet, distributes them round-robin.
- The merged report is `build/ldlib2-uitest-par/report.json`, with each shard's own output under `build/ldlib2-uitest-par/shard<N>/`. `verifyParTest` fails the build if anything failed.
- `-PldTest`, `-PldTestExclude`, `-PldTestWindow`, `-PldTestGuiScale`, `-PldTestInputMode`, `-PldTestWatchdogSec`, and `-PldTestHeadless` are passed on to every shard. The shard watchdog defaults to `180` seconds instead of `90`, because the clients share one machine.

::: warning Use LDLib2 2.2.39 or newer for parallel runs

In 2.2.38, shards did not receive `-PldTest`, `-PldTestWindow` or `-PldTestGuiScale`. They ran every scenario and laid them out at a different size than a serial run, so scenarios failed on coordinates.

:::

::: warning Limits of parallel runs

- More jobs than the machine can keep up with starve each client of frames, and timing-sensitive scenarios fail for no real reason. Raise `-PldTestJobs` only while runs stay stable.
- `-PldTestKeepOpen` is not passed to shards. Iterate on a scenario with a serial `runClient`.
- On Windows, each shard is started through `cmd.exe`, so a `regex:` selection containing spaces or `&` is broken apart. Run such selections serially.

:::
