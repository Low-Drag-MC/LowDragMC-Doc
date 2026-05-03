# 资源包集成

使用 **Photon2** 创建的 FX 存储在：

```
.minecraft/ldlib2/assets/...
```

你可能希望将这些 FX 文件打包到**资源包**或**模组**中进行分发。
为此，你需要将所有必需的文件移动到你自己目录下的 `assets/` 文件夹中。

---

## 📂 必需文件

- **FX 文件**
- **资源**（材质、渐变、颜色等）
- **其他资源**（纹理、模型、着色器等）

---

## 1️⃣ FX 文件

导出的 FX 文件**必须**放置在：

```
assets/<namespace>/fx/
```

---

## 2️⃣ 资源

!!! warning "Minecraft 资源命名规则"
    Minecraft **不允许**在文件路径中使用大写字母、空格或非英文字符。
    在移动文件之前，请确保所有名称符合 [Minecraft 资源命名](https://minecraft.wiki/w/Resource_pack#File_naming) 规则。

所有 FX 资源依赖项（材质、渐变、颜色等）必须从：

```
.minecraft/ldlib2/assets/ldlib2/resources/global/xxxx.material.nbt
```

移动到：

```
assets/ldlib2/resources/global/xxxx.material.nbt
```

---

## 3️⃣ 其他资源

材质和网格通常引用**额外的资源**，例如：

- 纹理
- 模型
- 着色器

这些也必须移动到 `assets/` 目录下对应的文件夹中。

---

## 💡 推荐的迁移方法

!!! info
    **最简单**且**最不容易出错**的方法是复制以下路径下的**所有内容**：

    ```
    .minecraft/ldlib2/assets/...
    ```

    到：

    ```
    assets/...
    ```

    这样可以确保保留所有依赖项，并且 FX 在打包后能正常工作。
