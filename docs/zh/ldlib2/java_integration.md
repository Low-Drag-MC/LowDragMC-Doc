# Java 集成
{{ version_badge("2.0.0", label="Since", icon="tag") }}

## Maven
您可以从我们的 [Maven 仓库](https://maven.firstdark.dev/#/snapshots/com/lowdragmc) 找到最新版本。

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

## IDEA 插件 - LDLib 开发工具
![Image title](./assets//plugin.png){ width="60%" align=right}

如果您打算使用 LDLib2 进行开发，我们强烈建议您安装我们的 IDEA 插件 [LDLib Dev Tool](https://plugins.jetbrains.com/plugin/28032-ldlib-dev-tool)。
该插件具有：

- 代码高亮
- 语法检查
- 代码跳转
- 自动补全
- 其他功能

这些功能能极大地帮助您利用 LDLib2 的特性。特别是，LDLib2 的所有注解都已得到支持和使用。

## LDLibPlugin
您可以使用 `ILDLibPlugin` 和 `@LDLibPlugin` 来创建一个 LDLibPlugin。
```java
@LDLibPlugin
public class MyLDLibPlugin implements ILDLibPlugin {
    public void onLoad() {
        // 在这里为 LDLib2 进行您的注册或设置。
    }
}
```