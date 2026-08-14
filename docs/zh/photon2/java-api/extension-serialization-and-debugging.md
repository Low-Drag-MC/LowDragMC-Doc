# 扩展、序列化与调试

![真实 Photon 编辑器中加载的 Shader 与 Graph 资源](/assets/photon2/graph-particle-shader.webp)

*扩展失败时，先检查注册和序列化 Type ID，再检查资源解析、Graph 编译与当前 Render Path。*

Photon 的 Authored Model 由 Registry 驱动。这些是客户端注册，不是服务器 Gameplay Registry。

## 扩展入口

| 扩展 | Registry/类型 |
| --- | --- |
| FX Object | `PhotonRegistries.FX_OBJECTS` / Static `FXObjectType` |
| Material | `PhotonRegistries.MATERIALS` / `IMaterial` Supplier |
| Number Function | `NUMBER_FUNCTIONS` / `NumberFunction` Supplier |
| Shape | `SHAPES` / `IShape` Supplier |
| Model Source | `MODEL_SOURCES` / `IModelSource` Supplier |
| Timeline Track | `TIMELINE_TRACKS` / Static `TrackType` |
| Animated Property | `ANIMATED_PROPERTIES` / Static `AnimatedPropertyType` |

Built-in 使用 `@LDLRegisterClient`，需要时使用 Static Type Singleton。自定义 FX Object 必须提供 `FXObjectType`、Codec/Copy 行为、Editor Icon/Configuration、Runtime 行为和序列化兼容性。自定义 Timeline Track 还需要 `TrackEditor`；只注册数据不会自动得到可用 UI。

## 文件版本

当前 `.fxproj`/`.fx` 数据使用 `FXProject.VERSION = 5`。有版本的 Project Data 通过 `PhotonFXProjectDataFixer` 迁移；加载导出 `.fx` 时会将 Root 包装成 Project 形状、应用 Fix，再解包。无版本历史 `.fx` 使用各 Deserializer 的 Legacy Fallback，因为无法得知真实来源版本。

不要手工改 NBT Field。用当前编辑器打开、保存旧项目，再重新导出 `.fx`/`.fxpack`。曾经短暂存在的“在 `.fx` 中嵌入资源”格式已不支持，资源应放入 FX Pack。

## 调试清单

1. **FX Missing：**核对 `assets/<ns>/fx/<path>.fx`、Namespace Case 和 Pack Mount，再看 `FXHelper` Warning。
2. **Shader Black/Broken：**查看 Core Shader/Graph Compile Log，Reload Resource，清理 Client FX Cache。
3. **切换世界后 Runtime 停止：**`isValid()` 变 false 是预期行为，为新 `ClientLevel` 创建 Runtime。
4. **Graph Data 恒为 0：**启用 GPU Instancing，并核对 Emitter/Channel 支持表。
5. **Iris 行为不同：**使用支持的 Iris 版本，分别测试无 Pack/启用 Pack，检查 Photon Compatibility Config。
6. **HDR/Bloom 行为不同：**确认 Material Value 大于 1、使用 HDR Target，Post Effect Priority 位于期望的 Bloom 前/后。

## 性能

- 大量相同 Tile/Model/Trail Primitive 使用 GPU Instancing，并保持相同 Material/Layout 以合批。
- Parallel Particle Update 适合计算量大、无碰撞的发射器，但 Worker 更新的 Module 不应访问线程不安全的外部状态。
- RuntimeValue 只在 Client Thread 更新，并尽量只在 Owner/Value 变化时写入。
- 合并 Post Effect Request，宽 Filter 降采样，不需要独立参数时不要使用 Independent Execution。
- Cache 只在 Resource Lifecycle Event 清理，不要每帧清理。
