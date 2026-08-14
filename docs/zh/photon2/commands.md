# 命令

Photon 命令适合预览导出文件和进行简单绑定。如果效果生命周期由 Mod 管理，应使用 [Java API](./java-api/)。

![通过资源 ID 在世界中启动的 Photon 效果](/assets/photon2/fx-shield-gpu.webp)

*命令与 Java Executor 解析相同的导出 FX 资源；图中是实际的 `photon:shield_gpu`。*

## 打开编辑器

```mcfunction
/photon_editor
```

编辑器只能在单人世界中打开。

## 将 FX 绑定到方块

```text
/photon fx <id> block <x y z> [offset] [rotation] [scale] [delay] [forcedDeath] [allowMulti] [checkState]
```

最小示例：

```mcfunction
/photon fx photon:fire block ~ ~-1 ~
```

完整示例：

```mcfunction
/photon fx photon:fire block ~ ~-1 ~ 0 1 0 0 0 0 1 1 1 10 false false true
```

`checkState` 会在精确的 `BlockState` 变化时移除效果。不开启时，更换成其他方块仍会移除效果，但只改变方块属性不会。

## 将 FX 绑定到实体

```text
/photon fx <id> entity <selector> [offset] [rotation] [scale] [delay] [forcedDeath] [allowMulti] [autoRotate]
```

```mcfunction
/photon fx photon:fire entity @e[type=minecraft:minecart,distance=..8] 0 0.5 0 0 0 0 1 1 1 0 false false look
```

`autoRotate` 支持：

| 模式 | 行为 |
| --- | --- |
| `none` | 只使用设置的 rotation。 |
| `forward` | 根据实体 forward vector 旋转。 |
| `look` | 跟随实体 look vector。 |
| `xrot` | 跟随实体可视身体 Y 旋转。 |

## 通用参数

| 参数 | 默认值 | 含义 |
| --- | --- | --- |
| offset | `0 0 0` | 添加到锚点的局部位移。 |
| rotation | `0 0 0` | 角度制 Euler rotation。 |
| scale | `1 1 1` | Root scale。 |
| delay | `0` | 启动延迟，单位为 tick。 |
| forcedDeath | `false` | 锚点消失时立即删除残留粒子。 |
| allowMulti | `false` | 允许同一锚点上存在另一个相同 FX。 |

## 移除绑定效果

```mcfunction
/photon fx remove block ~ ~-1 ~ true
/photon fx remove entity @e[type=minecraft:pig,distance=..10] false photon:fire
```

可选资源 id 可以把移除范围限制到一个 FX。`force=true` 会立即删除可见残留。

## 客户端维护

| 命令 | 用途 |
| --- | --- |
| `/photon_client clear_particles` | 清除 Photon 粒子和 Executor 缓存，并使缓存的 Runtime 失效。 |
| `/photon_client clear_client_fx_cache` | 清除 FX 定义缓存和 FX 列表缓存。 |
| `/photon_client convert` | 转换 `ldlib2/assets/photon/fx_old` 中的 Photon 1 文件。 |

## 测试后处理

<VersionBadge version="2.2.0" label="自" icon="tag" />

```mcfunction
/photonfx list
/photonfx test invert
/photonfx test invert 0.5
/photonfx clear
```

测试命令会每帧提交所选效果，直到运行 `clear`。可选 weight 范围是 `0..1`。

## Iris 诊断

<VersionBadge version="2.2.2" label="自" icon="tag" />

```mcfunction
/photon_iris status
/photon_iris dump
/photon_iris overlay on
/photon_iris mode auto
```

`dump` 会复制兼容性报告。Composite mode override 只用于诊断；正常游戏保持 `auto`。
