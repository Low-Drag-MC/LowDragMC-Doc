# 屏幕与菜单

---

屏幕与菜单为你的模组提供了专用的客户端界面（Screen）和服务器端菜单（Menu）。

- **LDLibScreen**：代表一个客户端屏幕。你可以在这里构建 UI、处理输入以及渲染视觉效果。通常情况下，它由一个对应的 Menu 驱动，用来同步服务器端数据（如物品栏、进度等）。
- **LDLibContainerMenu**：代表一个服务器端容器菜单。它负责管理服务器端状态（例如物品栏槽位、数据），并自动与客户端屏幕同步。使用 Fabric 时，对应接口为 `ILDLibScreen`。

## 创建 LDLibScreen

`LDLibScreen` 是对原版 Minecraft `Screen` 的封装，并增加了对 LDLib 自定义 UI 的支持。

```java title="Screen 注册"
public static final MenuType<MyContainerMenu> MY_MENU_TYPE = ...;

public MyScreen(MyContainerMenu menu, Inventory inventory, Component title) {
    // 构造函数。通常由菜单的屏幕工厂调用。
    super(menu, inventory, title);
}
```

你可以重写以下方法来自定义屏幕：

| 方法 | 描述 |
|------|------|
| `init()` | 初始化屏幕。你可以在这里添加小部件。 |
| `render(...)` | 渲染屏幕内容。 |
| `tick()` | 每帧调用，用于更新逻辑。 |
| `onScreenSizeInit(...)` | 当屏幕尺寸发生变化时调用。 |

## 创建 LDLibContainerMenu

`LDLibContainerMenu`（或 Fabric 上的 `ILDLibScreen`）是服务器端的菜单实现。它保存了需要同步给客户端的状态（如物品栏、进度等）。

```java title="Menu 注册"
public class MyContainerMenu extends LDLibContainerMenu {

    public MyContainerMenu(@Nonnull MenuType<?> menuType, int id, @Nonnull Inventory inventory) {
        super(menuType, id, inventory);
        // 添加物品栏槽位、数据追踪器等。
    }

    @Override
    public void initRegisterSlots(@Nonnull IItemTransfer inventory) {
        // 注册这个菜单持有的物品栏槽位。
    }

    // 添加你自己的自定义数据同步逻辑...
}
```

### 数据同步

`LDLibContainerMenu` 会自动处理基本的数据同步。对于自定义数据，你可以：

1. **DataSlot**：用于同步整数值（如熔炉的烧制进度）。
2. **自定义数据包**：为复杂数据结构发送自定义网络包。
3. **物品栏**：通过 `IItemTransfer` 接口同步物品栏内容。

## 注册你的屏幕和菜单

### Forge

```java
public static final MenuType<MyContainerMenu> MY_MENU = ...;

// 在客户端事件 bus 上注册
@SubscribeEvent
public static void registerScreens(RegisterEvent event) {
    event.register(ForgeRegistries.Keys.MENU_TYPES, helper -> {
        helper.register("my_menu", MY_MENU);
    });
}

// 在客户端设置中绑定屏幕
MenuScreens.register(MY_MENU, MyScreen::new);
```

### Fabric

```java
public static final MenuType<MyContainerMenu> MY_MENU = ...;

// 在模组初始化中注册
public void onInitialize() {
    Registry.register(BuiltInRegistries.MENU, new ResourceLocation("mymod", "my_menu"), MY_MENU);
    // 屏幕通过 Fabric API 的事件注册
    HandledScreens.register(MY_MENU, MyScreen::new);
}
```

## 屏幕与菜单通信

客户端屏幕和服务器端菜单之间的通信通过原版 Minecraft 的容器系统处理：

1. **服务器 → 客户端**：菜单自动同步物品栏槽位和 DataSlot。
2. **客户端 → 服务器**：玩家与 UI 交互时（如点击槽位），事件会发送给服务器端菜单处理。
3. **自定义包**：你可以通过 LDLib 的网络工具发送自定义包，以实现更复杂的同步需求。
