# Resources

The `UI Project` contains three built-in resources: `textures`, `colors` and `lang entries`.
Resources are owned by projects and cannot be shared between projects.

If you want the current project's resources to be available in other projects, you can `export` the resources first and then open other projects to `import` it.

![image](https://user-images.githubusercontent.com/18493855/207118889-eb6a0d13-5991-4f92-b397-e32cb17e2d9a.png)


## Textrures
![image](https://user-images.githubusercontent.com/18493855/207118279-5bd121bc-7996-41c1-9971-31d977c9b9e5.png)

1. Stored textures.
2. Add new textures, glad we support many types of textures so far :).
3. It's worth noting that `empty` is a built-in texture and you can't delete it.

### Use it
When you open the configuration of a widget, you find that some where can accept the texture (e.g. background of Basic Info), and you can drag the texture in.

![image](https://user-images.githubusercontent.com/18493855/207120061-c1bed1fb-0aa4-4f23-aa8f-ff8768444e9a.png)

1. Drag texture.
2. Rendering a green frame if it can accept this texture.

**NOTE: When you drag it to a widget, it replaces its background image by default.**

![image](https://user-images.githubusercontent.com/18493855/207120775-5f3dd588-782a-4258-9436-a78d1f9b8e4f.png)

### Edit Texture
Right-click to open the menu and edit the selected texture.

![image](https://user-images.githubusercontent.com/18493855/207121897-592cecfb-45e4-489e-9614-e6397f8d51ed.png)
1. Open its configurator.
2. Modify the texture type. In general you'd better not modify it, because switching type will not modify references of previous one.
3. Some textures provide a preview of the settings, and you can open the file selector by clicking on it.
4. You can scale, translate, and rotate the texture by setting its Transform.

**NOTE: You can use `GroupTexture` with transform to create a more complex texture.**

![image](https://user-images.githubusercontent.com/18493855/207123282-4fa17b0f-f82c-4ffb-b483-8d224cafc670.png)
1. Combine multi textures.
2. Add a new layer.

**NOTE: You can create an animation texture by setting the starting and ending of frames, and the interval time.**

![image](https://user-images.githubusercontent.com/18493855/207124029-113ef4fd-e599-4a0c-b28c-467bd7141e1c.png)


## Colors

### Use it
When you open a configuration, you find that some where can accept the number (e.g. color of the label widget), and you can drag the color in.

![image](https://user-images.githubusercontent.com/18493855/207125094-5c023c4d-8582-46fc-86cc-3b17171f4d3f.png)

1. Drag color.
2. Rendering a green frame if it can accept this color.

**NOTE: When you drag it to a widget, it replaces its background to a Color Texture by default.**

![image](https://user-images.githubusercontent.com/18493855/207125654-4403fddd-7108-4873-84e8-bab76e5e95bc.png)

### Edit Color
Right-click to open the menu and edit the selected color.

![image](https://user-images.githubusercontent.com/18493855/207126473-73db777c-ebb9-4920-a102-90d40360fea2.png)

1. Pickup color (HSB mode), you can right click the pallete to swith mode.
2. Preview.
3. Modify by argb.

## Entries

Enties stores key-value, which can be regard as a lang file.

When you open a configuration, you find that some where can accept the number (e.g. color of the label widget), and you can drag the color in.
You can fill in your localization data, and then export to the lang file directly (W.I.P)

### Use it

![image](https://user-images.githubusercontent.com/18493855/207215664-ff2cfc9b-519d-4907-8683-2922f3ad4032.png)

1. Drag entries.
2. Rendering a green frame if it can accept a string.

**NOTE: When you drag it to a widget, it replaces its hover tooltips by default.**

![image](https://user-images.githubusercontent.com/18493855/207215796-5e61a6e1-bc90-47c4-9282-48c1474b48b6.png)

### Edit Entries
Right-click to open the menu and edit its vaule.

![image](https://user-images.githubusercontent.com/18493855/207215986-83e17a3f-fe3a-4fe5-9f71-fb3f0bbdf0b4.png)

1. Typing your text here.

You can right-click to open the menu and rename its key.