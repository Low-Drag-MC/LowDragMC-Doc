# UI Editor

!!! warning inline end
    This command can only be used under the `single player` world.

LDLib2 provides a visual editor to support UI creatiom. Use command to open the UI Editor.

```shell
/ldlib2_ui_editor
```

<figure markdown="span">
  ![Editor apperance](./assets/editor_01.png){ width="80%" }
</figure>

The UI Editor supports two ways of creating UIs through visualization:

* `UI XML`
* `UI Template`

---

## UI XML

Click **`File → New → UI XML File`** to create a new UI XML file.  
You can also click **`Open`** to load an existing XML file.

<figure markdown="span">
  ![Editor appearance](./assets/editor_new_xml.png){ width="80%" }
</figure>

<figure markdown="span">
  ![Editor appearance](./assets/editor_xml.png){ width="80%" }
</figure>

Once opened, you can edit the XML and see a **real-time preview** of your UI directly in the editor. For more xml details, check [UI Xml](./xml.md){ data-preview }

!!! tip
    You can also edit the XML file using an external IDE (such as VS Code or IntelliJ IDEA).  
    The preview will automatically update when you save your changes.

---

## UI Template

A **UI Template** is similar to **UI XML** and is used to define UI content  
(including **styles** and the **component tree**).

The key differences are:

- UI Templates can be **edited visually** using the **UI Editor**.
- A saved UI Template can be reused as a **template component** in other **UI XML** files or **UI Templates**.

Unlike UI XML files, **UI Templates are managed by LDLib2’s resource system**.  
To create one, use the **Resource Panel**:

<figure markdown="span">
  ![Editor appearance](./assets/editor_template.png){ width="100%" }
</figure>

**Steps:**

1. Select the **UI** resource category.
2. Choose or create a **resource provider**.
3. Right-click and create a **UI Template**, then double-click it to enter edit mode.

### Edit your Template

After opening a UI Template, you will see the following editor interface:

<figure markdown="span">
  ![Editor appearance](./assets/editor_view.png){ width="100%" }
</figure>

1. **Style Configurator**  
   Edit built-in styles, add or remove external stylesheets, and inspect applied styles.

2. **UI Tree**  
   Displays the full UI hierarchy.  
   You can create or remove components via the context menu, select multiple elements, or drag to reorder the hierarchy.

3. **Element Configurator**  
   Shows configurable properties of the currently selected element.

4. **Preview**  
   Provides a real-time preview of your UI.

Using the UI Editor, you can configure **layout**, **styles**, and other settings visually.  
If you understand the concepts introduced in the *Preliminary* section, the editor should be intuitive to use.  
For components with special configuration options, refer to their individual documentation pages.

### Load UI Template
There are two methods to load and use your template for your UI.

1. you could also move it to your assets and loaed it by a `ResourceLoaction`.
2. if the resrouce is under the ldlib2 folder, you can right click the resource to obtain the resource path and load it.

<figure markdown="span">
  ![Editor appearance](./assets/template_path.png){ width="100%" }
</figure>

=== "Java"

    ```java
    @Override
    public ModularUI createUI(Player player) {
        var ui = Optional.ofNullable(UIResource.INSTANCE.getResourceInstance()
                // resource location based
                .getResource(new FilePath(ResourceLoaction.parse("ldlib2:resources/examples/example_layout.ui.nbt"))))
                // file based
                //.getResource(new FilePath(new File(LDLib2.getAssetsDir(), "ldlib2/resources/examples/example_layout.ui.nbt"))) // LDLib2.getAssetsDir() = ".minecraft/ldlib2/assets"
                .map(UITemplate::createUI)
                .orElseGet(UI::empty);
        return ModularUI.of(ui, player);
    }
    ```

=== "KubeJS"

    ```js
    function createUIFromUIResource(path) {
        return UIResource.INSTANCE.getResourceInstance().getResource(path).createUI();
    }

    function createUI(player) {
        // file based
        let ui = createUIFromUIResource("file(./ldlib2/assets/ldlib2/resources/global/modern_styles.ui.nbt)")
        // resource location based
        // let ui = createUIFromUIResource("file(ldlib2:resources/global/modern_styles.ui.nbt)")
        return ModularUI.of(ui, player)
    }
    ```

---

## UI Simulation

Click the **green Play button** at the top of the editor to enter **simulation mode**.  
This allows you to interact with the UI and verify its behavior.

<figure markdown="span">
  ![Editor appearance](./assets/editor_simulation.png){ width="100%" }
</figure>