# Java集成

## 行家您可以从我们的[maven](https://maven.firstdark.dev/#/snapshots/com/lowdragmc)找到最新版本。
[![ldlib2 maven](https://img.shields.io/badge/dynamic/xml?url=https%3A%2F%2Fmaven.firstdark.dev%2Fsnapshots%2Fcom%2Flowdragmc%2Fldlib2%2Fldlib2-neoforge-1.21.1%2Fmaven-metadata.xml&query=%2F%2F元数据%2F版本控制%2Flatest&label=ldlib2-neoforge-1.21.1&cacheSeconds=300)](https://maven.firstdar.kdev/#/snapshots/com/lowdragmc/ldlib2/ldlib2-neoforge-1.21.1)
{{ version_badge("2.2.1", label="Since", icon="tag") }}``` c
repositories {
    // LDLib2
    maven { url = "https://maven.firstdark.dev/snapshots" } 
}

dependencies {
    // LDLib2
    implementation("com.lowdragmc.ldlib2:ldlib2-neoforge-${minecraft_version}:${ldlib2_version}:all")
}
```

??? “2.2.1之前”    ``` c
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

## IDEA 插件 - LDLib 开发工具![Image title](./assets//plugin.png){宽度=“60%”对齐=右}
如果您打算使用 LDLib2 进行开发，我们强烈建议您安装我们的 IDEA 插件[LDLib Dev Tool](https://plugins.jetbrains.com/plugin/28032-ldlib-dev-tool)。该插件有：
- 代码高亮- 语法检查- CDOE跳跃- 自动完成- 其他的
这极大地帮助您利用 LDLib2 的功能。特别是LDLib2的所有注解都已支持使用。
## LDLib插件您可以使用`ILDLibPlugin`和`@LDLibPlugin`创建LDLibPlugin```java
@LDLibPlugin
public class MyLDLibPlugin implements ILDLibPlugin {
    public void onLoad() {
        // do your register or setup for LDLib2 here.
    }
}
```