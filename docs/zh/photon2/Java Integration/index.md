# 基本信息

{{ version_badge("2.0.4", label="Since", icon="tag", href="/changelog/#2.0.4") }}

## 开发 Maven
```c
repositories {
    maven { url = "https://maven.firstdark.dev/snapshots" } // LDLib2, Photon2
}

dependencies {
    // LDLib2
    implementation("com.lowdragmc.ldlib2:ldlib2-neoforge-${minecraft_version}:${ldlib2_version}:all") { transitive = false }
    compileOnly("org.appliedenergistics.yoga:yoga:1.0.0")

    // Photon2
    implementation("com.lowdragmc.photon:photon-neoforge-${minecraft_version}:${photon2_version}") { transitive = false }
}
```
### 最新版本
[![ldlib2 maven](https://img.shields.io/badge/dynamic/xml
?url=https%3A%2F%2Fmaven.firstdark.dev%2Fsnapshots%2Fcom%2Flowdragmc%2Fldlib2%2Fldlib2-neoforge-1.21.1%2Fmaven-metadata.xml
&query=%2F%2Fmetadata%2Fversioning%2Flatest
&label=ldlib2-neoforge-1.21.1
&cacheSeconds=300)](https://maven.firstdar.kdev/#/snapshots/com/lowdragmc/ldlib2/ldlib2-neoforge-1.21.1)
[![photon maven](https://img.shields.io/badge/dynamic/xml?url=https%3A%2F%2Fmaven.firstdark.dev%2Fsnapshots%2Fcom%2Flowdragmc%2Fphoton%2Fphoton-neoforge-1.21.1%2Fmaven-metadata.xml&query=%2F%2Fmetadata%2Fversioning%2Flatest&label=photon-neoforge-1.21.1&cacheSeconds=300)](https://maven.firstdark.dev/#/snapshots/com/lowdragmc/photon/photon-neoforge-1.21.1)

---

## 如何加载和使用效果文件？
```java
FX fx = FXHelper.getFX(ResourceLocation.parse("photon:fire"));
// 绑定到一个方块
new BlockEffectExecutor(fx, level, pos).start();
// 绑定到一个实体
new EntityEffectExecutor(fx, level, entity, AutoRotate.NONE).start();
```

---

## 实现你自己的 `IEffectExecutor` 来管理 Photon 效果的生命周期。
有时候，你想用额外的逻辑来控制你的效果。
你可以实现 `IEffectExecutor` 并做你想做的事。

=== "IEffectExecutor"

    ```java
    public interface IEffectExecutor {

        Level getLevel();

        /**
         * 在 FX 对象持续时间内的每一 tick 更新。在这里执行低频逻辑。
         * <br>
         * 例如：清除粒子
         * @param fxObject fx 对象
         */
        default void updateFXObjectTick(IFXObject fxObject) {
        }

        /**
         * 在渲染期间每帧更新每个 FX 对象。在这里执行高频逻辑。
         * <br>
         * 例如：更新发射器位置、旋转、缩放
         * @param fxObject fx 对象
         * @param partialTicks partialTicks
         */
        default void updateFXObjectFrame(IFXObject fxObject, float partialTicks) {

        }

        default RandomSource getRandomSource() {
            return getLevel().random;
        }
    }
    ```

=== "ExampleExecutor"

    ```java
    public class ExampleExecutor extends IEffectExecutor {
        public final FX fx;
        @Getter
        public final Level level;
        // 运行时
        @Nullable
        private FXRuntime fxRuntime;

        public ExampleExecutor(FX fx, Level level) {
            this.fx = fx;
            this.level = level;
        }

        public void emit() {
            kill();
            fxRuntime = fx.createRuntime(); // (1)
            fxRuntime.emmit(this);
        }

        public void kill() {
            if (fxRuntime == null) return;
            fxRuntime.destory(true);
            fxRuntime = null;
        }
    }
    ```

    1. 如果你想修改配置数据，请使用 `fx.createRuntime(true)`。

查看 [ExampleExecutor](#__tabbed_1_2) 了解它是如何工作的。
```java
FX fx = FXHelper.getFX(ResourceLocation.parse("photon:fire"));
var executor = new ExampleExecutor(fx, level);
executor.emit();
```
