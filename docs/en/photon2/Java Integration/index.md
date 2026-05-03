#Basic Information

{{ version_badge("2.0.4", label="Since", icon="tag", href="/changelog/#2.0.4") }}

## Development Maven
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
### latest version
[![ldlib2 maven](https://img.shields.io/badge/dynamic/xml
?url=https%3A%2F%2Fmaven.firstdark.dev%2Fsnapshots%2Fcom%2Flowdragmc%2Fldlib2%2Fldlib2-neoforge-1.21.1%2Fmaven-metadata.xml
&query=%2F%2Fmetadata%2Fversioning%2Flatest
&label=ldlib2-neoforge-1.21.1
&cacheSeconds=300)](https://maven.firstdar.kdev/#/snapshots/com/lowdragmc/ldlib2/ldlib2-neoforge-1.21.1)
[![photon maven](https://img.shields.io/badge/dynamic/xml?url=https%3A%2F%2Fmaven.firstdark.dev%2Fsnapshots%2Fcom%2Flowdragmc%2Fphoton%2Fphoton-neoforge-1.21.1%2Fmaven-metadata.xml&query=%2F%2Fmetadata%2Fversioning%2Flatest&label=photon-neoforge-1.21.1&cacheSeconds=300)](https://maven.firstdark.dev/#/snapshots/com/lowdragmc/photon/photon-neoforge-1.21.1)

---

## How to load and use the effect files?
```java
FX fx = FXHelper.getFX(ResourceLocation.parse("photon:fire"));
// bind it to a block
new BlockEffectExecutor(fx, level, pos).start();
// bind it to an entity
new EntityEffectExecutor(fx, level, entity, AutoRotate.NONE).start();
```

---

## Implement your own`IEffectExecutor` to manage the lifecycle of your photon effects.
Sometimes, you wanna control the effect you have with additional logic.
You can implement the `IEffectExecutor` and do what you want. 

=== "IEffectExecutor"

    ```java
    public interface IEffectExecutor {

        Level getLevel();

        /**
         * update each FX objects during their duration, per tick. Execute low frequency logic here.
         * <br>
         * e.g., kill particle
         * @param fxObject fx object
         */
        default void updateFXObjectTick(IFXObject fxObject) {
        }

        /**
         * update each FX objects during rendering, per frame. Execute high frequency logic here.
         * <br>
         * e.g., update emitter position, rotation, scale
         * @param fxObject fx object
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
        // runtime
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

    1. if you want to modify config data. use `fx.createRuntime(true)` instead.

Check [ExampleExecutor](#__tabbed_1_2) to see how it works.
```java
FX fx = FXHelper.getFX(ResourceLocation.parse("photon:fire"));
var executor = new ExampleExecutor(fx, level);
executor.emit();
```