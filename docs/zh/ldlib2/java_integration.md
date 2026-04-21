# Java 集成
{{ version_badge("2.0.0", label="Since", icon="tag") }}

## Maven
你可以在 [Maven](https://maven.firstdark.dev/#/snapshots/com/lowdragmc) 中找到最新版本。


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

## IDEA 插件 - LDLib Dev Tool
![Image title](./assets//plugin.png){ width="60%" align=right}

如果你打算使用 LDLib2 进行开发，我们强烈建议你安装我们的 IDEA 插件 [LDLib Dev Tool](https://plugins.jetbrains.com/plugin/28032-ldlib-dev-tool)。
该插件提供了：

- 代码高亮
- 语法检查
- cdoe jumping
- 自动补全
- 其他功能

这些功能将极大地帮助你使用 LDLib2 的各项特性。特别地，所有 LDLib2 的注解均已支持使用。

## LDLibPlugin
你可以通过使用 `ILDLibPlugin` 和 `@LDLibPlugin` 来创建一个 LDLibPlugin。
```java
@LDLibPlugin
public class MyLDLibPlugin implements ILDLibPlugin {
    public void onLoad() {
        // 在此处进行 LDLib2 的注册或设置。
    }
}
```
