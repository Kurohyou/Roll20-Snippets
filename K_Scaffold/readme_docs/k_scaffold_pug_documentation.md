# K Scaffold PUG documentation
- [input](#input)
- [text](#text)
- [checkbox](#checkbox)
- [radio](#radio)
- [number](#number)
- [range](#range)
- [hidden](#hidden)
- [textarea](#textarea)
- [option](#option)
- [select](#select)
- [img](#img)
- [datalist](#datalist)
- [button](#button)
- [action](#action)
- [navButton](#navButton)
- [customControlFieldset](#customControlFieldset)
- [fieldset](#fieldset)
- [pseudo-button](#pseudo-button)
- [button-label](#button-label)
- [roller-label](#roller-label)
- [action-label](#action-label)
- [select-label](#select-label)
- [input-label](#input-label)
- [headedTextarea](#headedTextarea)
- [script](#script)
- [kscript](#kscript)
- [adaptiveTextarea](#adaptiveTextarea)
- [compendiumAttributes](#compendiumAttributes)
- [attrTitle](#attrTitle)
- [buttonTitle](#buttonTitle)
- [replaceSpaces](#replaceSpaces)
- [replaceProblems](#replaceProblems)
## input
`mixin`

A generic mixin to create an input. The mixin will replace spaces in the attribute name with underscores and will add a title property if one isn't supplied that will inform the user what the attribute call for the attribute is.
|Argument|type|description|
|---|---|---|
|obj|`object`|An object containing all of the properties to apply to the element. Must have the properties; `name` and `type`. Can have any property that is valid for an input element. May also have a [trigger](#trigger) proeprty
|obj.name|`string`|
### Example
**PUG**
```js
+input({name:'my attribute',type:'text',class:'some-class',trigger:{affects:['other_attribute']}})'
```
**HTML**
```html
<input name="attr_my_attribute" type="text" class="some-class">'
```
## text
`mixin`

Alias for [input](#input) that makes a text input.
### Example
**PUG**
```js
+text({name:'my text',class:'some-class',trigger:{affects:['other_attribute']}})
```
**HTML**
```html
<input type="text" name="attr_my_text" class="some-class">
```
## checkbox
`mixin`

Alias for [input](#input) that makes a checkbox input.
### Example
**PUG**
```js
+checkbox({name:'my checkbox',class:'some-class',trigger:{affects:['other_attribute']}})
```
**HTML**
```html
<input type="checkbox" name="attr_my_checkbox" class="some-class">
```
## radio
`mixin`

Alias for [input](#input) that makes a radio input.
### Example
**PUG**
```js
+radio({name:'my radio',class:'some-class',trigger:{affects:['other_attribute']}})
```
**HTML**
```html
<input type="radio" name="attr_my_radio" class="some-class">
```
## number
`mixin`

Alias for [input](#input) that makes a number input.
### Example
**PUG**
```js
+number({name:'my number',class:'some-class',trigger:{affects:['other_attribute']}})
```
**HTML**
```html
<input type="number" name="attr_my_number" class="some-class">
```
## range
`mixin`

Alias for [input](#input) that makes a range input.
### Example
**PUG**
```js
+range({name:'my range',class:'some-class',trigger:{affects:['other_attribute']}})
```
**HTML**
```html
<input type="range" name="attr_my_range" class="some-class">
```
## hidden
`mixin`

Alias for [input](#input) that makes a hidden input.
### Example
**PUG**
```js
+hidden({name:'my hidden',class:'some-class',trigger:{affects:['other_attribute']}})
```
**HTML**
```html
<input type="hidden" name="attr_my_hidden" class="some-class">
```
## textarea
`mixin`

Functions like [input](#input), but creates a textarea instead.
### Example
**PUG**
```js
+textarea({name:'my hidden',class:'some-class',placeholder:'Placeholder text',trigger:{affects:['other_attribute']}})
```
**HTML**
```html
<textarea type="hidden" name="attr_my_hidden" class="some-class">Placeholder text</textarea>
```
## option
`mixin`

Creates an option attribute. Also stores the trigger for the select that the option is part of. See [select](#select) for example uses.
## select
`mixin`

Functions like [input](#input), but creates a select instead.
### Example
**PUG**
```js
+select({name:'my select',class:'some-class'})
  +option({value:'option 1','data-i18n':'some-text',trigger:{affects:['some-attribute']}})
  +option({value:'option 2','data-i18n':'other-text'})
```
**HTML**
```html
<select name="attr_my_select" class="some-class">
  <option value="option 1" data-i18n="some-text"></option>
  <option value="option 2" data-i18n="other-text"></option>
</select>
```
## img
`mixin`

Functions like [input](#input), but creates a span instead. The name property is optional.
### Example
**PUG**
```js
+span({name:'my span',class:'some-class'})
```
**HTML**
```html
<span name="attr_my_span" class="some-class"></span>
```
## datalist
`mixin`

Functions like [input](#input), but creates a datalist instead. Note that an ID should never be put inside a repeating section, although you can reference one from inside the repeating section.
### Example
**PUG**
```js
+select({name:'my select',list:'my-data'})
+datalist({id:'my-data'})
  +option({value:'option 1','data-i18n':'some-text',trigger:{affects:['some-attribute']}})
  +option({value:'option 2','data-i18n':'other-text'})
```
**HTML**
```html
<select name="attr_my_select" class="some-class"></select><datalist id="my-data">
  <option value="option 1" data-i18n="some-text"></option>
  <option value="option 2" data-i18n="other-text"></option>
</datalist>
```
## button
`mixin`

Creates a button element. Valid types are `roll` or `action`. If a type is not specified in the object argument, a roll button is created. If an action button is created, spaces in the name are replaced with dashes instead of underscores.
### Examples
**PUG**
```js
+button({name:'my button',value:'/r 3d10'})
```
**HTML**
```html
<button type="roll" name="roll_my_button" value="/r 3d10"></button>
```
**PUG**
```js
+button({name:'my button',type:'action','data-i18n':'action button'})
```
**HTML**
```html
<button type="action" name="act_my-button" data-i18n="action button"></button>
```
## action
`mixin`

Alias for [button](#button) that creates a button element with a type of `action`. Spaces in the name are replaced with dashes instead of underscores.
### Example
**PUG**
```js
+action({name:'my button','data-i18n':'action button'})
```
**HTML**
```html
<button type="action" name="act_my-button" data-i18n="action button"></button>
```
## navButton
`mixin`

Alias for [button](#button) that creates a combination roll button and action button element to get around the limitation that action buttons cannot be dragged to the macro quickbar. Requires sheetworker infrastructure to work, which should be triggered `on(sheet:opened)` and `on("change:character_name")`.
### Example
**PUG**
```js
+roller({name:'my roll'})
```
**HTML**
```html
<button type="roll" name="roll_my_roll" value="@{my_roll_action}"></button>
<button type="action" name="act_my-roll-action" hidden></button>
<input type="hidden" name="attr_my_roll_action" value="">
```
## customControlFieldset
`mixin`

Alias for [fieldset](#fieldset) that creates to custom action buttons to add/remove rows to the repeating section. Useful when you need to trigger a sheetworker when a row is added. This also prevents the occassional error of a new row disappearing immediately after the user has clicked the button to create one. Proper use of this will require css to hide the default buttons that fieldsets create automatically. Note that currently this assumes the existence of an addItem and editSection sheetworker function.
|Argument|type|description|
|---|---|---|
|name|`string`|The name of the repeating section. Will be prefixed with `repeating_` and spaces will be replaced with dashes (`-`).
|trigger|`object`|Trigger that defines how to handle the removal of a row from the fieldset. `Optional`
|addClass|`string`|Any additional classes that should be used for the repeating section. Note that these are not added to the fieldset itself as adding additional classes to the fieldset itself interferes with calling action buttons from chat, but are added to a span that precedes the fieldset. This allows styling of the repcontainer via a css declaration like `.bonus-class + fieldset + .repcontainer`.
### Example
**PUG**
```js
+customControlFieldset({name:'equipment'})
  +text({name:'name',class:'underlined'})
```
**HTML**
```html
<button type="action" name="add-equipment" class="repcontrol-button repcontrol-button--add"></button>
<button type="action" name="edit-equipment" class="repcontrol-button repcontrol-button--edit"></button>
<fieldset class="repeating_equipment">
  <input type="text" name="attr_name" title="@{repeating_equipment_$x_name}">
</fieldset>
```
## fieldset
`mixin`

A mixin that creates a fieldset for the creation of a repeating section. The mixin prefixes the name with `repeating_` and replaces problem characters (e.g. spaces are replaced with dashes). Additionally, the auto-generated title properties from the K-scaffold's mixins will include the proper repeating section information.
|Argument|type|description|
|---|---|---|
|name|`string`|The name of the repeating section. Will be prefixed with `repeating_` and spaces will be replaced with dashes (`-`).
|trigger|`object`|Trigger that defines how to handle the removal of a row from the fieldset. `Optional`
|addClass|`string`|Any additional classes that should be used for the repeating section. Note that these are not added to the fieldset itself as adding additional classes to the fieldset itself interferes with calling action buttons from chat, but are added to a span that precedes the fieldset. This allows styling of the repcontainer via a css declaration like `.bonus-class + fieldset + .repcontainer`.
### Examples
**PUG**
```js
+fieldset({name:'equipment'})
  +text({name:'name',class:'underlined'})
```
**HTML**
```html
<fieldset class="repeating_equipment"></fieldset><div class="repcontainer" data-groupname="repeating_equipment">
  <input type="text" name="attr_name" title="@{repeating_equipment_$x_name}">
</div>
```
**PUG**
```js
+fieldset({name:'equipment',trigger:{listenerFunc:'handleDeletedRow'},addClass:'class-1 class-2'})
  +text({name:'name',class:'underlined'})
```
**HTML**
```html
<span hidden class="class-1 class-2"></span>
<fieldset class="repeating_equipment"></fieldset><div class="repcontainer" data-groupname="repeating_equipment">
  <input type="text" name="attr_name" title="@{repeating_equipment_$x_name}">
</div>
```
## pseudo-button
`mixin`

A mixin for creating pseudo buttons of paired checkboxes/radios and spans such as those that had to be used to create [tabbed sheets](https://wiki.roll20.net/CSS_Wizardry#Show.2FHide_Areas) before action buttons were introduced.
|Argument|type|description|
|---|---|---|
|label|`string`|The `data-i18n` translation key to use for the displayed text.
|inputObj|`object`|An object describing the input to be paired with the span. This is the same object that you would pass to [input](#input).
### Example
**PUG**
```js
+pseudo-button('page 1',{name:'page',type:'radio',value:1,trigger:{triggeredFuncs:['changePage']}})
```
**HTML**
```html
<input type="hidden" name="attr_page" title="@{page} value="1">
<label class="pseudo-button"><span data-i8n="page 1" class="pseudo-button__span"></span>
  <input type="radio" name="attr_page" value="1"></label>
```
## button-label
`mixin`

A mixin to create a combined button and input that are within the same container. Similar to [input-label](#input-label), but does not use a label.
|Argument|type|description|
|---|---|---|
|inputObj|`object`|An object describing the input to be paired with the button. This is the same object that you would pass to [input](#input).
|buttonObj|`object`|An object describing the button to be paired with the input. This is the same object that you would pass to [button](#button).
|divObj|`object`|An object describing the container div. Similar to the first two objects, but will most likely only have a `class` property if it is passed at all.
### Example
**PUG**
```js
+button-label({name:'strength',type:'number',class:'underlined',value:10,trigger:{affects:['athletics']}},{name:'strength_roll',type:'roll',value:'/r 1d20+@{strength}'},{class:'strength'})
```
**HTML**
```html
<div class="input-label input-label--button strength">
  <button name="roll_strength_roll" type="roll" value="/r 1d20+@strength">
  <input name="attr_strength" type="number" value="10">
</div
```
## roller-label
`mixin`

Similar to the construction created by [button-label](#button-label), except that it creates a [roller](#roller) construction instead of just a straight button.
|Argument|type|description|
|---|---|---|
|inputObj|`object`|An object describing the input to be paired with the button. This is the same object that you would pass to [input](#input).
|buttonObj|`object`|An object describing the button to be paired with the input. This is the same object that you would pass to [roller](#roller).
|divObj|`object`|An object describing the container div. Similar to the first two objects, but will most likely only have a `class` property if it is passed at all.
## action-label
`mixin`

Similar to the construction created by [button-label](#button-label), except that it specifcally creates an [action button](https://wiki.roll20.net/Button#Action_Button) as per [action](#action).
|Argument|type|description|
|---|---|---|
|inputObj|`object`|An object describing the input to be paired with the button. This is the same object that you would pass to [input](#input).
|buttonObj|`object`|An object describing the button to be paired with the input. This is the same object that you would pass to [action](#action).
|divObj|`object`|An object describing the container div. Similar to the first two objects, but will most likely only have a `class` property if it is passed at all.
## select-label
`mixin`

Similar to the construction created by [input-label](#input-label), except that the input is replaced with a select.
|Argument|type|description|
|---|---|---|
|label|`string`|The `data-i18n` translation key to add to the span in the label.
|inputObj|`object`|An object describing the select to be paired with the button. This is the same object that you would pass to [select](#select).
|divObj|`object`|An object describing the container label. Similar to the inputObj, but will most likely only have a `class` property if it is passed at all.
|spanObj|`object`|An object describing the span to be paired with the input. This is the same object that you would pass to [span](#span).
|block|`block`|The mixin uses the pug block as the content of the select.
### Example
**PUG**
```js
+select-label('Whisper to GM',{name:'whisper'},{class:'div-class'},{class:'span-class'})
  +option({value:'','data-i18n':'never'})
  +option({value:'/w gm ','data-i18n':'always'})
```
**HTML**
```html
<label class="input-label div-class"><span data-i18n="Whisper to GM" class="input-label__text span-class"></span>
  <select name="attr_whisper" class="input-label__input">
    <option value="" data-i18n="never"></option>
    <option value="/w gm " data-i18n="always"></option>
  </select>
</label>
```
## input-label
`mixin`

Creates a construction that nests the input and span in a label so that they are connected. This is beneficial for screen readers as well as making it easier to interact with the input via mouse by clicking on the text associated with it.
|Argument|type|description|
|---|---|---|
|label|`string`|The `data-i18n` translation key to add to the span in the label.
|inputObj|`object`|An object describing the input to be paired with the button. This is the same object that you would pass to [input](#input).
|divObj|`object`|An object describing the container label. Similar to the inputObj, but will most likely only have a `class` property if it is passed at all.
|spanObj|`object`|An object describing the span to be paired with the input. This is the same object that you would pass to [span](#span).
|block|`block`|The mixin uses the pug block as the content of the select.
### Example
**PUG**
```js
+input-label('strength',{name:'strength',type:'number'},{class:'div-class'},{class:'span-class'})
```
**HTML**
```html
<label class="input-label div-class"><span data-i18n="Whisper to GM" class="input-label__text span-class"></span>
  <input name="attr_strength" type="number" class="input-label__input">
</label>
```
## headedTextarea
`mixin`

Creates a construction for pairing a header with a textarea. Currently is locked to creating an `h3`.  This mixin also accepts classes and IDs appended directly to it (see the second example)
|Argument|type|description|
|---|---|---|
|textObj|`object`|The object describing the textarea as per [textarea](#textarea)
|header|`string`|The `data-i18n` translation key to use for the header
### Examples
**PUG**
```js
+headedTextarea({name:'character description','data-i18n-placeholder':'The description of your character'},'description')
```
**HTML**
```html
<div class="headed-textarea">
  <h3 data-i18n="description"></h3>
  <textarea name="attr_character_description" data-i18n-placeholder:"The description of your character"></textarea>
</div>
```
**PUG**
```js
+headedTextarea({name:'character description','data-i18n-placeholder':'The description of your character'},'description').character-description
```
**HTML**
```html
<div class="headed-textarea character-description">
  <h3 data-i18n="description"></h3>
  <textarea name="attr_character_description" data-i18n-placeholder:"The description of your character"></textarea>
</div>
```
## script
`mixin`

Creates a generic [Roll20 script block](https://wiki.roll20.net/Building_Character_Sheets#JavaScript_2) for use with the sheetworker system.
## kscript
`mixin`

Similar to [script](#script), but includes the K-scaffold's javascript function library.
## adaptiveTextarea
`mixin`

Creates an html construction for creating a [content-scaled](https://wiki.roll20.net/CSS_Wizardry#Content-scaled_Inputs) textarea.
|Argument|type|description|
|---|---|---|
|textObj|`object`|The object describing the textarea as per the [textarea](#textarea) mixin. You can apply classes and IDs to the container div by appending them to the mixin call (see the second example).
### Examples
**PUG**
```js
+adaptiveTextarea({name:'character description'})
```
**HTML**
```html
<div class="adaptive adaptive--text"><span name:"attr_character_description" class="adaptive--text__span"></span>
  <textarea name="attr_character_description" class="adaptive--text__textarea"></textarea>
</div>
```
**PUG**
```js
+adaptiveTextarea({name:'character description'}).custom-class
```
**HTML**
```html
<div class="adaptive adaptive--text custom-class"><span name:"attr_character_description" class="adaptive--text__span"></span>
  <textarea name="attr_character_description" class="adaptive--text__textarea"></textarea>
</div>
```
## compendiumAttributes
`mixin`

Creates a set of compendium drop target attributes. Defaults to creating target attributes for the `Name` and `data` compendium attributes.
|Argument|type|description|
|---|---|---|
|prefix|`string`|A prefix to attach to the default attribute names.
|lookupAttributes|`array`|An array of the lookup attributes to create targets for. The target attributes are named based on the compendium attribute they are for. lookupAttributes defaults to `["Name","data"]`.
|triggerAccept|`string`|The compendium attribute that should trigger the sheetworkers to handle the compendium drop.
|trigger|`object`|The trigger object. Defaults to `{listenerFunc:"handleCompendiumDrop"}`
### Examples
**PUG**
```js
+compendiumAttributes({})
```
**HTML**
```html
<input name="attr_drop_name" accept="Name" value="" type="hidden" title="@{drop_name}"/>
<input name="attr_drop_data" accept="data" value="" type="hidden" title="@{drop_data}"/>
```
**PUG**
```js
+compendiumAttributes({prefix:'prefix'})
```
**HTML**
```html
<input name="attr_prefix_drop_name" accept="Name" value="" type="hidden" title="@{prefix_drop_name}"/>
<input name="attr_prefix_drop_data" accept="data" value="" type="hidden" title="@{prefix_drop_data}"/>
```
**PUG**
```js
+compendiumAttributes({lookupAttributes:['Name','data','Category'],prefix:'prefix})
```
**HTML**
```html
<input name="attr_prefix_drop_name" accept="Name" value="" type="hidden" title="@{prefix_drop_name}"/>
<input name="attr_prefix_drop_data" accept="data" value="" type="hidden" title="@{prefix_drop_data}"/>
<input name="attr_prefix_drop_category" accept="Category" value="" type="hidden" title="@{prefix_drop_category}"/>
```
## attrTitle
`function`

Converts an attribute name into an attribute call for that attribute. Converts `_max` attribute names to the proper attribute call syntax for `_max` attributes (see second example). If called from inside the block of a [fieldset](#fieldset) mixin, will also add the appropriate information for calling a repeating attribute.
|Argument|type|description|
|---|---|---|
|attrName|`string`|The attribute name to create an attribute call for.
### Examples
**PUG**
```js
- attrTitle('strength') => "@{strength}"
```
**PUG**
```js
- attrTitle('hp_max') => "@{hp|max}"
```
**PUG**
```js
+fieldset({name:'equipment'})
  - attrTitle('weight') => "@{repeating_equipment_$X_weight}"
```
- `returns string` - undefined
## buttonTitle
`function`

Converts an ability name into an ability call for that attribute. If called from inside the block of a [fieldset](#fieldset) mixin, will also add the appropriate information for calling a repeating attribute.
|Argument|type|description|
|---|---|---|
|abilityName|`string`|The ability name to create an attribute call for.
### Examples
**PUG**
```js
- buttonTitle('strength') => "%{strength}"
```
**PUG**
```js
+fieldset({name:'equipment'})
  - buttonTitle('use') => "%{repeating_equipment_$X_use}"
```
- `returns string` - undefined
## replaceSpaces
`function`

Replaces spaces in a string with underscores (`_`).
|Argument|type|description|
|---|---|---|
|string|`string`|The string to work on
### Example
**PUG**
```js
- replaceSpaces('attribute name') => "attribute_name"
```
- `returns string` - undefined
## replaceProblems
`function`

Escapes problem characters in a string for use as a regex.
|Argument|type|description|
|---|---|---|
|string|`string`|The string to work on
### Example
**PUG**
```js
- replaceProblems("Here's a problem => [") => "Here's a problem => ["
```
- `returns string` - undefined