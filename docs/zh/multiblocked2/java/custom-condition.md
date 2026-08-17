# 自定义 RecipeCondition

<VersionBadge version="21.0.11" label="MBD2" icon="tag" />

<figure><img src="/assets/multiblocked2/recipes/recipe-type.png" alt="已注册 Java condition 被添加到配方的 Recipe Type 项目"><figcaption>condition 注册后，可用于目标 Recipe Type 下编辑的配方。</figcaption></figure>

`RecipeCondition` 判断一个配方是否可以在某个 `RecipeLogic` 上运行。它应读取世界或机器状态，不应消耗资源或修改世界。

## 完整示例

```java
@Getter
@Setter
@NoArgsConstructor
@LDLRegister(name = "moon_phase", registry = "mbd2:recipe_condition")
public final class MoonPhaseCondition extends RecipeCondition {
    @Configurable(name = "recipe.condition.examplemod.moon_phase")
    @ConfigNumber(range = {0, 7}, type = ConfigNumber.Type.INTEGER)
    private int phase;

    public MoonPhaseCondition(int phase) {
        this.phase = Math.clamp(phase, 0, 7);
    }

    @Override
    public Component getTooltips() {
        return Component.translatable(
            "recipe.condition.examplemod.moon_phase.tooltip", phase);
    }

    @Override
    public IGuiTexture getIcon() {
        return new ItemStackTexture(Items.CLOCK);
    }

    @Override
    public boolean test(MBDRecipe recipe, RecipeLogic logic) {
        return logic.getMachine().getLevel().getMoonPhase() == phase;
    }
}
```

无参构造器是必需的，因为条件 registry 会为 `PersistedParser` 创建新实例。`@Configurable` 字段会成为编辑器控件，并由 `RecipeCondition.CODEC` 通过已注册条件类型编码。

## 添加到配方

```java
builder.addCondition(new MoonPhaseCondition(0));

// reverse 由 MBDRecipe 应用，不要写入 test()。
builder.addCondition(new MoonPhaseCondition(4).setReverse(true));
```

对于 KubeJS，可以在自己的集成中暴露便捷方法，或者在该类已允许脚本访问时将实例传给现有 `addCondition(condition)`。

## 组合与 reverse 语义

- `test(...)` 只返回正向条件。MBD2 会将结果与 `isReverse()` 比较。
- `RecipeCondition#isOr()` 默认返回 `true`。相同注册类型的条件作为候选分组：至少一个通过即可。
- 不同注册类型之间使用 AND。
- 当同类条件的每个实例都必须独立通过时，重写 `isOr()` 返回 `false`。

例如，两个 `biome` 条件表示“生物群系 A 或 B”；一个生物群系条件加一个高度条件表示“生物群系匹配且高度匹配”。

## 失败与 Side 规则

配方匹配和工作期间条件检查都会调用 `test`。保持它确定且廉价。不要加载区块、生成实体、修改 NBT 或消耗 capability。修改行为应放到 Trait handler 或机器事件。
