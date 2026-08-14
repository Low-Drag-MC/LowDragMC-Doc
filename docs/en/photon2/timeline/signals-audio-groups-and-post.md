# Signals, Audio, Groups, and Post Process

![A complete Timeline project used to coordinate non-particle tracks](/assets/photon2/editor-timeline-overview.webp)

*Signal, Audio, Group, and Post Process tracks sit beside particle control tracks and follow the same playback cursor.*

These tracks coordinate an FX with systems outside particle simulation.

## Signal Track

A Signal contains time, name, and custom `CompoundTag` data. The Track display name is its channel. During forward playback, the player dispatches signals in the monotonic window `(lastSignalTick, currentTime]`, preventing duplicate firing at tick zero or after ordinary evaluation repeats.

Signals reach:

1. `IEffectExecutor#onTimelineSignal` for the current playback;
2. listeners registered through global `PhotonSignals`.

The editor disables dispatch during scrub/replay previews.

## Audio Track

An Audio Clip selects a Sound Event, category, attenuation, duration, and volume/pitch functions.

<VersionBadge version="2.2.1" label="Curveable volume and pitch since" icon="tag" />

- Entering a clip starts a sound instance.
- Leaving/switching clips requests the previous instance to stop.
- A clip longer than the sound loops it; a shorter clip cuts it at the clip end.
- With attenuation and a bound target, position follows the FX object.
- Editor preview may force non-positional sound so it remains audible.

## Track Groups

Groups organize child tracks and support nested presentation/mute structure. They do not create an FX object or transform; use an Empty object when simulation hierarchy is required.

## Post Process Track

A Post Process Clip references a Render Graph or Fullscreen Graph resource path, a weight envelope, and parameter overrides. Every render frame in its range:

1. sample local clip time;
2. calculate fade/weight;
3. sample parameter overrides;
4. submit a request to `IEffectExecutor#postEffectSink()`.

Stopping submission removes the effect on the next stack consumption. Overlapping requests for the same effect are blended by the PostEffectStack rules.

See [Post Processing](../post-processing/) for authoring graphs and [Post Processing Java API](../java-api/post-processing-api.md) for manual requests.
