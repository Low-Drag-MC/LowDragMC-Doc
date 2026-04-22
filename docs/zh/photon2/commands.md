# 命令

{{ version_badge("2.0.0", label="自", icon="tag", href="/changelog/#2.0.0") }}

Photon2 不管理 VFX 何时、何地以及如何使用。虽然 Photon 提供了一些内置命令，但这些主要用于测试目的。

## ✨ 基础命令

| 命令                             | 描述                                          |
| -------------------------------- | --------------------------------------------- |
| `/photon particle_editor`        | 打开可视化粒子编辑器                          |
| `/photon_client clear_particles` | 移除所有 Photon 粒子                          |
| `/photon_client clear_fx_cache`  | 清除 FX 缓存（修改 .fx 文件后运行）           |

---

## 📦 FX 绑定与发射

Photon2 允许你**将效果绑定到方块或实体**，或在指定位置发射它们，并具有完整的参数控制。

### 命令格式

```shell
/photon fx <fxFile> <type> ... [offset] [rotation] [scale] [delay] [force death] [allow multi] ...
```

* `<fxFile>`：FX 文件的资源位置（例如 `mod_id:filename` 对应 `assets/mod_id/fx/filename.fx`）
* `<type>`：`block` 或 `entity`
* 详见下方参数表

| 参数        | 必需 | 默认值  | 描述                                                                     |
| ----------- | ---- | ------- | ------------------------------------------------------------------------ |
| fxFile      | 是   | -       | FX 文件资源名称，例如 `photon:fire`                                      |
| type        | 是   | -       | `block` 或 `entity`                                                      |
| offset      | 否   | 0 0 0   | 位置偏移 (x y z)                                                         |
| rotation    | 否   | 0 0 0   | 旋转 (欧拉角: x y z)                                                     |
| scale       | 否   | 1 1 1   | 缩放 (x y z)                                                             |
| delay       | 否   | 0       | 发射延迟 (ticks)                                                         |
| force death | 否   | false   | 如果目标变为无效，立即移除所有粒子                                       |
| allow multi | 否   | false   | 允许相同名称的多个效果绑定到同一对象                                     |

---

### 🟦 绑定 FX 到方块

**格式：**

```shell
/photon fx <fxFile> block <position(x y z)> [offset] [rotation] [scale] [delay] [force death] [allow multi] [check state]
```

* `position`：必需，方块坐标 (x y z)
* `check state`：如果为 `false`（默认），方块改变时效果被移除。如果为 `true`，方块状态改变时也会被移除。

**示例：**

```shell
/photon fx photon:fire block ~ ~ ~ 0 0 0 0 0 0 1 1 1 0 false false false
```

---

### 🟩 绑定 FX 到实体

**格式：**

```shell
/photon fx <fxFile> entity <entities(selector)> [offset] [rotation] [scale] [delay] [force death] [allow multi] [auto rotation]
```

* `entities`：必需，实体选择器
* `auto rotation`：

  * `none`（默认）：无旋转
  * `forward`：前进方向
  * `look`：头部朝向方向
  * `xrot`：身体旋转方向

**示例：**

```shell
/photon fx photon:fire entity @e[type=minecraft:minecart, distance=..1] 0 0.5 0 0 0 0 1 1 1 0 false false look
```

---

## ❌ 移除 FX 命令

| 命令格式                                                           | 示例                                    |
| ------------------------------------------------------------------ | --------------------------------------- |
| `/photon fx remove block <position(x y z)> [force] [location]`     | `/photon fx remove block ~ ~ ~ true`    |
| `/photon fx remove entity <entities(selector)> [force] [location]` | `/photon fx remove entity @e[type=pig]` |

* `force`：对象变为无效时立即移除所有粒子（`true`），或等待自然消失（`false`）
* `location`：指定 FX 资源位置（可选）

---

## 📋 参数说明与技巧

* 位置、旋转和缩放始终为三个数字 (x y z)
* FX 文件路径通常为 `assets/<mod_id>/fx/your_fx_name.fx`
* 修改任何 .fx 文件后，务必运行 `/photon_client clear_fx_cache` 以刷新缓存！

---

## 🌈 高级用法示例

!!! example "将效果绑定到你的脚下"
    ```shell
    /photon fx photon:smoke block ~ ~-1 ~
    ```

!!! example "将爆炸 FX 绑定到附近的所有 pig"
    ```shell
    /photon fx photon:explosion entity @e[type=minecraft:pig, distance=..10]
    ```
