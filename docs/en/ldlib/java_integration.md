# Java Integration

You can find the latest version from our [maven](https://maven.firstdark.dev/#/snapshots/com/lowdragmc).

``` c
repositories{
    maven {
        name "firstdarkdev"
        url "https://maven.firstdark.dev/snapshots"
    }
}
```

=== "Forge"

    ``` c
    dependencies {
        implementation fg.deobf("com.lowdragmc.ldlib:ldlib-forge-{minecraft_version}:{latest_version}") { transitive = false }
    }
    ```

=== "Fabric"

    ``` c
    dependencies {
        modImplementation("com.lowdragmc.ldlib:ldlib-fabric-{minecraft_version}:{latest_version}") { transitive = false }
    }
    ```

=== "Architectury-Common"

    ``` c
    dependencies {
        modCompileOnly("com.lowdragmc.ldlib:ldlib-common-{minecraft_version}:{latest_version}")
    }
    ```