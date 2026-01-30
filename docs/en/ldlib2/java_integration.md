# Java Integration
{{ version_badge("2.0.0", label="Since", icon="tag") }}

## maven
You can find the latest version from our [maven](https://maven.firstdark.dev/#/snapshots/com/lowdragmc).


[![ldlib2 maven](https://img.shields.io/badge/dynamic/xml
?url=https%3A%2F%2Fmaven.firstdark.dev%2Fsnapshots%2Fcom%2Flowdragmc%2Fldlib2%2Fldlib2-neoforge-1.21.1%2Fmaven-metadata.xml
&query=%2F%2Fmetadata%2Fversioning%2Flatest
&label=ldlib2-neoforge-1.21.1
&cacheSeconds=300)](https://maven.firstdar.kdev/#/snapshots/com/lowdragmc/ldlib2/ldlib2-neoforge-1.21.1)

``` c
repositories {
    // LDLib2
    maven { url = "https://maven.firstdark.dev/snapshots" } 
}

dependencies {
    // LDLib2
    implementation("com.lowdragmc.ldlib2:ldlib2-neoforge-${minecraft_version}:${ldlib2_version}:all") { transitive = false }
    compileOnly("org.appliedenergistics.yoga:yoga:1.0.0")   
}
```

## IDEA Plugin - LDLib Dev Tool
![Image title](./assets//plugin.png){ width="60%" align=right}

If you are going to develop with LDLib2, we strongly recommend you to install our IDEA Plugin [LDLib Dev Tool](https://plugins.jetbrains.com/plugin/28032-ldlib-dev-tool). 
The plugin has:

- code highlight
- syntax check
- cdoe jumping
- auto complete
- others

which greatly assist you in utilizing features of LDLib2. Especially, all the annotations of LDLib2 have been supported for use.

## LDLibPlugin
You can create a LDLibPlugin by using `ILDLibPlugin` and `@LDLibPlugin`
```java
@LDLibPlugin
public class MyLDLibPlugin implements ILDLibPlugin {
    public void onLoad() {
        // do your register or setup for LDLib2 here.
    }
}
```