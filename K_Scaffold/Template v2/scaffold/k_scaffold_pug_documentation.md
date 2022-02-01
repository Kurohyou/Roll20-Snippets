# K Scaffold PUG documentation
## input
`mixin`
A generic mixin to create an input. The mixin will replace spaces in the attribute name with underscores and will add a title property if one isn't supplied that will inform the user what the attribute call for the attribute is.
- `object` - obj: An object containing all of the properties to apply to the element. Must have the properties; `name` and `type`. Can have any property that is valid for an input element. May also have a [trigger](#trigger) proeprty
- `string` - obj.name: 
### Example
**PUG**
```js
+input({name:'my attribute',type:'text',class:'some-class',trigger:{affects:['other_attribute']}})'
```
**HTML**
```html
+input({name:'my attribute',type:'text',class:'some-class',trigger:{affects:['other_attribute']}})'
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
+text({name:'my text',class:'some-class',trigger:{affects:['other_attribute']}})
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
+checkbox({name:'my checkbox',class:'some-class',trigger:{affects:['other_attribute']}})
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
+radio({name:'my radio',class:'some-class',trigger:{affects:['other_attribute']}})
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
+number({name:'my number',class:'some-class',trigger:{affects:['other_attribute']}})
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
+range({name:'my range',class:'some-class',trigger:{affects:['other_attribute']}})
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
+hidden({name:'my hidden',class:'some-class',trigger:{affects:['other_attribute']}})
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
+textarea({name:'my hidden',class:'some-class',placeholder:'Placeholder text',trigger:{affects:['other_attribute']}})
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
+select({name:'my select',class:'some-class'})
+option({value:'option 1','data-i18n':'some-text',trigger:{affects:['some-attribute']}})
+option({value:'option 2','data-i18n':'other-text'})
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
+span({name:'my span',class:'some-class'})
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
+select({name:'my select',list:'my-data'})
+datalist({id:'my-data'})
+option({value:'option 1','data-i18n':'some-text',trigger:{affects:['some-attribute']}})
+option({value:'option 2','data-i18n':'other-text'})
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
+button({name:'my button',value:'/r 3d10'})
```
**PUG**
```js
+button({name:'my button',type:'action','data-i18n':'action button'})
```
**HTML**
```html
+button({name:'my button',type:'action','data-i18n':'action button'})
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
+action({name:'my button','data-i18n':'action button'})
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
+roller({name:'my roll'})
```
## customControlFieldset
`mixin`
Alias for [fieldset](#fieldset) that creates to custom action buttons to add/remove rows to the repeating section. Useful when you need to trigger a sheetworker when a row is added. This also prevents the occassional error of a new row disappearing immediately after the user has clicked the button to create one. Proper use of this will require css to hide the default buttons that fieldsets create automatically. Note that currently this assumes the existence of an addItem and editSection sheetworker function.
- `string` - name: The name of the repeating section. Will be prefixed with `repeating_` and spaces will be replaced with dashes (`-`).
- `object` - trigger: Trigger that defines how to handle the removal of a row from the fieldset. `Optional`
- `string` - addClass: Any additional classes that should be used for the repeating section. Note that these are not added to the fieldset itself as adding additional classes to the fieldset itself interferes with calling action buttons from chat, but are added to a span that precedes the fieldset. This allows styling of the repcontainer via a css declaration like `.bonus-class + fieldset + .repcontainer`.
### Example
**PUG**
```js
+customControlFieldset({name:'equipment'})
  +text({name:'name',class:'underlined'})
```
**HTML**
```html
+customControlFieldset({name:'equipment'})
  +text({name:'name',class:'underlined'})
```
## fieldset
`mixin`
A mixin that creates a fieldset for the creation of a repeating section. The mixin prefixes the name with `repeating_` and replaces problem characters (e.g. spaces are replaced with dashes).
- `string` - name: The name of the repeating section. Will be prefixed with `repeating_` and spaces will be replaced with dashes (`-`).
- `object` - trigger: Trigger that defines how to handle the removal of a row from the fieldset. `Optional`
- `string` - addClass: Any additional classes that should be used for the repeating section. Note that these are not added to the fieldset itself as adding additional classes to the fieldset itself interferes with calling action buttons from chat, but are added to a span that precedes the fieldset. This allows styling of the repcontainer via a css declaration like `.bonus-class + fieldset + .repcontainer`.
### Examples
**PUG**
```js
+fieldset({name:'equipment'})
  +text({name:'name',class:'underlined'})
```
**HTML**
```html
+fieldset({name:'equipment'})
  +text({name:'name',class:'underlined'})
```
**PUG**
```js
+fieldset({name:'equipment',{listenerFunc:'handleDeletedRow'},addClass:'class-1 class-2'})
  +text({name:'name',class:'underlined'})
```
**HTML**
```html
+fieldset({name:'equipment',{listenerFunc:'handleDeletedRow'},addClass:'class-1 class-2'})
  +text({name:'name',class:'underlined'})
```
## pseudo-button
`mixin`
A mixin for creating pseudo buttons of paired checkboxes/radios and spans such as those that had to be used to create [tabbed sheets](https://wiki.roll20.net/CSS_Wizardry#Show.2FHide_Areas) before action buttons were introduced.
- `string` - label: The `data-i18n` translation key to use for the displayed text.
- `object` - inputObj: An object describing the input to be paired with the span. This is the same object that you would pass to [input](#input).
### Example
**PUG**
```js
+pseudo-button('page 1',{name:'page',type:'radio',value:1,trigger:{triggeredFuncs:['changePage']}})
```
**HTML**
```html
+pseudo-button('page 1',{name:'page',type:'radio',value:1,trigger:{triggeredFuncs:['changePage']}})
```
## button-label
`mixin`
A mixin to create a combined button and input that are within the same container. Similar to [input-label](#input-label), but does not use a label.
- `object` - inputObj: An object describing the input to be paired with the button. This is the same object that you would pass to [input](#input).
- `object` - buttonObj: An object describing the button to be paired with the input. This is the same object that you would pass to [button](#button).
- `object` - divObj: An object describing the container div. Similar to the first two objects, but will most likely only have a `class` property if it is passed at all.
### Example
**PUG**
```js
+button-label({name:'strength',type:'number',class:'underlined',value:10,trigger:{affects:['athletics']}},{name:'strength_roll',type:'roll',value:'/r 1d20+@{strength}'},{class:'strength'})
```
**HTML**
```html
+button-label({name:'strength',type:'number',class:'underlined',value:10,trigger:{affects:['athletics']}},{name:'strength_roll',type:'roll',value:'/r 1d20+@{strength}'},{class:'strength'})
```
## roller-label
`mixin`
Similar to the construction created by [button-label](#button-label), except that it creates a [roller](#roller) construction instead of just a straight button.
- `object` - inputObj: An object describing the input to be paired with the button. This is the same object that you would pass to [input](#input).
- `object` - buttonObj: An object describing the button to be paired with the input. This is the same object that you would pass to [roller](#roller).
- `object` - divObj: An object describing the container div. Similar to the first two objects, but will most likely only have a `class` property if it is passed at all.
## action-label
`mixin`
Similar to the construction created by [button-label](#button-label), except that it specifcally creates an [action button](https://wiki.roll20.net/Button#Action_Button) as per [action](#action).
- `object` - inputObj: An object describing the input to be paired with the button. This is the same object that you would pass to [input](#input).
- `object` - buttonObj: An object describing the button to be paired with the input. This is the same object that you would pass to [action](#action).
- `object` - divObj: An object describing the container div. Similar to the first two objects, but will most likely only have a `class` property if it is passed at all.
## select-label
`mixin`
Similar to the construction created by [input-label](#input-label), except that the input is replaced with a select.
- `string` - label: The `data-i18n` translation key to add to the span in the label.
- `object` - inputObj: An object describing the select to be paired with the button. This is the same object that you would pass to [select](#select).
- `object` - divObj: An object describing the container label. Similar to the inputObj, but will most likely only have a `class` property if it is passed at all.
- `object` - spanObj: An object describing the span to be paired with the input. This is the same object that you would pass to [span](#span).
- `block` - block: The mixin uses the pug block as the content of the select.
### Example
**PUG**
```js
+select-label('Whisper to GM',{name:'whisper'},{class:'div-class'},{class:'span-class'})
  +option({value:'','data-i18n':'never'})
  +option({value:'/w gm ','data-i18n':'always'})
```
**HTML**
```html
+select-label('Whisper to GM',{name:'whisper'},{class:'div-class'},{class:'span-class'})
  +option({value:'','data-i18n':'never'})
  +option({value:'/w gm ','data-i18n':'always'})
```
## input-label
`mixin`
Creates a construction that nests the input and span in a label so that they are connected. This is beneficial for screen readers as well as making it easier to interact with the input via mouse by clicking on the text associated with it.
- `string` - label: The `data-i18n` translation key to add to the span in the label.
- `object` - inputObj: An object describing the input to be paired with the button. This is the same object that you would pass to [input](#input).
- `object` - divObj: An object describing the container label. Similar to the inputObj, but will most likely only have a `class` property if it is passed at all.
- `object` - spanObj: An object describing the span to be paired with the input. This is the same object that you would pass to [span](#span).
- `block` - block: The mixin uses the pug block as the content of the select.
### Example
**PUG**
```js
+input-label('strength',{name:'strength',type:'number'},{class:'div-class'},{class:'span-class'})
```
**HTML**
```html
+input-label('strength',{name:'strength',type:'number'},{class:'div-class'},{class:'span-class'})
```
## headedTextarea
`mixin`
Creates a construction for pairing a header with a textarea. Currently is locked to creating an `h3`.  This mixin also accepts classes and IDs appended directly to it (see the second example)
- `object` - textObj: The object describing the textarea as per [textarea](#textarea)
- `string` - header: The `data-i18n` translation key to use for the header
### Examples
**PUG**
```js
+headedTextarea({name:'character description','data-i18n-placeholder':'The description of your character'},'description')
```
**HTML**
```html
+headedTextarea({name:'character description','data-i18n-placeholder':'The description of your character'},'description')
```
**PUG**
```js
+headedTextarea({name:'character description','data-i18n-placeholder':'The description of your character'},'description').character-description
```
**HTML**
```html
+headedTextarea({name:'character description','data-i18n-placeholder':'The description of your character'},'description').character-description
```
## script
`mixin`
Similar to [script](#script), but includes the K-scaffold's javascript function library.
## adaptiveTextarea
`mixin`
Creates an html construction for creating a [content-scaled](https://wiki.roll20.net/CSS_Wizardry#Content-scaled_Inputs) textarea.
- `object` - textObj: The object describing the textarea as per the [textarea](#textarea) mixin. You can apply classes and IDs to the container div by appending them to the mixin call (see the second example).
### Examples
**PUG**
```js
+adaptiveTextarea({name:'character description'})
```
**HTML**
```html
+adaptiveTextarea({name:'character description'})
```
**PUG**
```js
+adaptiveTextarea({name:'character description'}).custom-class
```
**HTML**
```html
+adaptiveTextarea({name:'character description'}).custom-class
```
## compendiumAttributes
`mixin`
Creates a set of compendium drop target attributes. Defaults to creating target attributes for the `Name` and `data` compendium attributes.
- `string` - prefix: A prefix to attach to the default attribute names.
- `array` - lookupAttributes: An array of the lookup attributes to create targets for. The target attributes are named based on the compendium attribute they are for. lookupAttributes defaults to `["Name","data"]`.
- `string` - triggerAccept: The compendium attribute that should trigger the sheetworkers to handle the compendium drop.
- `object` - trigger: The trigger object. Defaults to `{listenerFunc:"handleCompendiumDrop"}`
### Examples
**PUG**
```js
+compendiumAttributes({})
```
**HTML**
```html
+compendiumAttributes({})
```
**PUG**
```js
+compendiumAttributes({prefix:'prefix'})
```
**HTML**
```html
+compendiumAttributes({prefix:'prefix'})
```
**PUG**
```js
+compendiumAttributes({lookupAttributes:['Name','data','Category'],prefix:'prefix})
```
**HTML**
```html
+compendiumAttributes({lookupAttributes:['Name','data','Category'],prefix:'prefix})
```
## attrTitle
`function`
Converts an attribute name into an attribute call for that attribute. Converts `_max` attribute names to the proper attribute call syntax for `_max` attributes (see second example). If called from inside the block of a [fieldset](#fieldset) mixin, will also add the appropriate information for calling a repeating attribute.
- `string` - attrName: The attribute name to create an attribute call for.
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
- `string` - abilityName: The ability name to create an attribute call for.
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
- `string` - string: The string to work on
### Example
**PUG**
```js
- replaceSpaces('attribute name') => "attribute_name"
```
- `returns string` - undefined
## replaceProblems
`function`
Escapes problem characters in a string for use as a regex.
- `string` - string: The string to work on
### Example
**PUG**
```js
- replaceProblems("Here's a problem => [") => "Here's a problem => ["
```
- `returns string` - undefined