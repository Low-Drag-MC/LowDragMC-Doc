# 后处理 Java API

<VersionBadge version="2.2.0" label="开始支持" icon="tag" />

![通过 Runtime Stack 提交的 RGB Shift 后处理](/assets/photon2/post-rgb-shift.webp)

*Java Request 与 Timeline Clip 使用相同 Render Graph；希望效果持续的每一帧都必须继续提交。*

效果需要显示的每个 Render Frame 都要提交一次：

```java
IResourcePath effect = PhotonPostFX.parsePath("built-in:wiki_tint_effect");

PhotonPostFX.submit(effect, Map.of(
        "Tint", new Vector4f(1.0f, 0.35f, 0.2f, 1.0f),
        "Strength", 0.8f
), 0.65f);
```

`parsePath` 接受完整 `type(path)` 格式或 Built-in Resource Name。`listEffectPaths()` 返回可请求的 Render Graph 与裸 Fullscreen Graph Path，与 `/photonfx list` 一致。

## 逐帧请求模型

`submit(effect, params, weight)` 只排队当前 Frame。Weight Clamp 到 `0..1`；Effect 为 null 或 Weight 非正时忽略。停止 Submit 后，下一帧效果消失。

应从属于该 Owner 的客户端 Render Frame 路径 Submit，而不是 Server Tick。Gameplay State 在 Tick 计算时，保存其状态并在每帧提交插值后、Render-safe 的值。

## 参数

参数 Key 是暴露的 Display Name。Value 可以是 `Float`、`Vector2f`、`Vector3f`、`Vector4f`、Integer Color、Boolean，以及 Graph Schema 声明的其他类型。未知或类型错误的值会按参数规则回退/解析失败，应以 Graph Blackboard 为准。

## 多请求

同一 Effect 的请求通常合并。Weight 按 `1 - Π(1 - wᵢ)` 组合；可 Lerp 参数按 Weight 升序混合，不可 Lerp 值取最高 Weight 请求。只有各请求必须独立执行时才添加保留参数 `Independent=true`。

Mask-filtered Request 也能包含 Timeline 使用的保留 Mask Filter 参数。比起写死内部 Key，优先通过 Timeline UI 或项目共享 Helper 设置。

## 独立 Stack

Executor 可从 `postEffectSink()` 返回专用 `PostEffectStack`，服务单独渲染的 Scene，并在该 Context 直接 `stack.submit(...)`。`PhotonPostFX.submit(...)` 始终进入全局 World Stack。

即使本帧没有 Photon Particle，Post Effect 也会运行：Standalone Pipeline 会在 Main Target 上消费待处理 Global Request。Iris/Shader Pack 下执行会移到兼容的 Late Render Hook，并遵循 Photon Client Config。
