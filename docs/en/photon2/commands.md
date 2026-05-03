# Commands

{{ version_badge("2.0.0", label="Since", icon="tag", href="/changelog/#2.0.0") }}

Photon2 does not manage when, where, or how VFX are used. While Photon provides some built-in commands, these are primarily for testing purposes.

## ✨ Basic Commands

| Command                          | Description                                   |
| -------------------------------- | --------------------------------------------- |
| `/photon particle_editor`        | Open the visual particle editor               |
| `/photon_client clear_particles` | Remove all Photon particles                   |
| `/photon_client clear_fx_cache`  | Clear FX cache (run after changing .fx files) |

---

## 📦 FX Binding & Emitting

Photon2 lets you **bind effects to blocks or entities**, or emit them at specific positions with full parameter control.

### Command Format

```shell
/photon fx <fxFile> <type> ... [offset] [rotation] [scale] [delay] [force death] [allow multi] ...
```

* `<fxFile>`: Resource location of the FX file (e.g., `mod_id:filename` for `assets/mod_id/fx/filename.fx`)
* `<type>`: `block` or `entity`
* See parameter table below for details

| Parameter   | Required | Default | Description                                                              |
| ----------- | -------- | ------- | ------------------------------------------------------------------------ |
| fxFile      | Yes      | -       | FX file resource name, e.g. `photon:fire`                                |
| type        | Yes      | -       | `block` or `entity`                                                      |
| offset      | No       | 0 0 0   | Position offset (x y z)                                                  |
| rotation    | No       | 0 0 0   | Rotation (Euler angles: x y z)                                           |
| scale       | No       | 1 1 1   | Scale (x y z)                                                            |
| delay       | No       | 0       | Emit delay (ticks)                                                       |
| force death | No       | false   | Immediately remove all particles if the target becomes invalid           |
| allow multi | No       | false   | Allow multiple effects with the same name to be bound to the same object |

---

### 🟦 Bind FX to a Block

**Format:**

```shell
/photon fx <fxFile> block <position(x y z)> [offset] [rotation] [scale] [delay] [force death] [allow multi] [check state]
```

* `position`: Required, block coordinates (x y z)
* `check state`: If `false` (default), effect is removed if the block changes. If `true`, also removed if the blockstate changes.

**Example:**

```shell
/photon fx photon:fire block ~ ~ ~ 0 0 0 0 0 0 1 1 1 0 false false false
```

---

### 🟩 Bind FX to Entities

**Format:**

```shell
/photon fx <fxFile> entity <entities(selector)> [offset] [rotation] [scale] [delay] [force death] [allow multi] [auto rotation]
```

* `entities`: Required, entity selector
* `auto rotation`:

  * `none` (default): No rotation
  * `forward`: Forward direction
  * `look`: Head look direction
  * `xrot`: Body rotation direction

**Example:**

```shell
/photon fx photon:fire entity @e[type=minecraft:minecart, distance=..1] 0 0.5 0 0 0 0 1 1 1 0 false false look
```

---

## ❌ Remove FX Commands

| Command Format                                                     | Example                                 |
| ------------------------------------------------------------------ | --------------------------------------- |
| `/photon fx remove block <position(x y z)> [force] [location]`     | `/photon fx remove block ~ ~ ~ true`    |
| `/photon fx remove entity <entities(selector)> [force] [location]` | `/photon fx remove entity @e[type=pig]` |

* `force`: Remove all particles immediately if the object becomes invalid (`true`), or wait for natural death (`false`)
* `location`: Specify FX resource location (optional)

---

## 📋 Parameter Notes & Tips

* Position, rotation, and scale are always three numbers (x y z)
* FX file path is usually `assets/<mod_id>/fx/your_fx_name.fx`
* After changing any .fx file, always run `/photon_client clear_fx_cache` to refresh!

---

## 🌈 Advanced Usage Examples

!!! example "Bind an effect to your feet"
`shell
    /photon fx photon:smoke block ~ ~-1 ~
    `

!!! example "Bind explosion FX to all pigs nearby"
`shell
    /photon fx photon:explosion entity @e[type=minecraft:pig, distance=..10]
    `