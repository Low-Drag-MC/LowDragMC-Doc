# Resource Pack Integration

FX created with **Photon2** are stored in:

```
.minecraft/ldlib2/assets/...
```

You may want to bundle these FX files into a **resource pack** or **mod** for distribution.  
To do this, you must move all required files into your own `assets/` directory.

---

## 📂 Required Files

- **FX Files**
- **Resources** (materials, gradients, colors, etc.)
- **Other Resources** (textures, models, shaders, etc.)

---

## 1️⃣ FX Files

Exported FX files **must** be placed under:

```
assets/<namespace>/fx/
```

---

## 2️⃣ Resources

!!! warning "Minecraft resource naming rules"
    Minecraft does **not** allow uppercase letters, spaces, or non-English characters in file paths.  
    Before moving files, ensure all names follow the [Minecraft Resource Naming](https://minecraft.wiki/w/Resource_pack#File_naming) rules.

All FX resource dependencies (materials, gradients, colors, etc.) must be moved from:

```
.minecraft/ldlib2/assets/ldlib2/resources/global/xxxx.material.nbt
```

to:

```
assets/ldlib2/resources/global/xxxx.material.nbt
```

---

## 3️⃣ Other Resources

Materials and meshes often reference **additional assets** such as:

- Textures
- Models
- Shaders

These must also be moved to their corresponding folders under your `assets/` directory.

---

## 💡 Recommended Migration Method

!!! info
    The **easiest** and most **error-proof** method is to copy **everything** under:

    ```
    .minecraft/ldlib2/assets/...
    ```

    into:

    ```
    assets/...
    ```

    This ensures all dependencies are preserved and your FX works correctly after packaging.
