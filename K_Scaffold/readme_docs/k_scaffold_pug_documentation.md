# K Scaffold PUG documentation
- [action](#action)
- [action-label](#action-label)
- [adaptiveTextarea](#adaptiveTextarea)
- [attrTitle](#attrTitle)
- [button](#button)
- [button-label](#button-label)
- [buttonTitle](#buttonTitle)
- [capitalize](#capitalize)
- [checkbox](#checkbox)
- [collapse](#collapse)
- [compendiumAttributes](#compendiumAttributes)
- [customControlFieldset](#customControlFieldset)
- [datalist](#datalist)
- [fieldset](#fieldset)
- [fillLeft](#fillLeft)
- [headedTextarea](#headedTextarea)
- [hidden](#hidden)
- [img](#img)
- [input](#input)
- [input-label](#input-label)
- [kscript](#kscript)
- [navButton](#navButton)
- [number](#number)
- [option](#option)
- [pseudo-button](#pseudo-button)
- [radio](#radio)
- [range](#range)
- [replaceProblems](#replaceProblems)
- [replaceSpaces](#replaceSpaces)
- [roller-label](#roller-label)
- [script](#script)
- [select](#select)
- [select-label](#select-label)
- [text](#text)
- [textarea](#textarea)
- [trigger](#trigger)
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

```
## action-label
`mixin`

Similar to the construction created by [button-label](#button-label), except that it specifcally creates an [action button](https://wiki.roll20.net/Button#Action_Button) as per [action](#action).
|Argument|type|description|
|---|---|---|
|inputObj|`object`|An object describing the input to be paired with the button. This is the same object that you would pass to [input](#input).|
|buttonObj|`object`|An object describing the button to be paired with the input. This is the same object that you would pass to [action](#action).|
|divObj|`object`|An object describing the container div. Similar to the first two objects, but will most likely only have a `class` property if it is passed at all.|


## adaptiveTextarea
`mixin`

Creates an html construction for creating a [content-scaled](https://wiki.roll20.net/CSS_Wizardry#Content-scaled_Inputs) textarea.
|Argument|type|description|
|---|---|---|
|textObj|`object`|The object describing the textarea as per the [textarea](#textarea) mixin. You can apply classes and IDs to the container div by appending them to the mixin call (see the second example).|


### Examples
**PUG**
```js
+adaptiveTextarea({name:'character description'})
```
**HTML**
```html

  

```
**PUG**
```js
+adaptiveTextarea({name:'character description'}).custom-class
```
**HTML**
```html

  

```
## attrTitle
`function`

Converts an attribute name into an attribute call for that attribute. Converts `_max` attribute names to the proper attribute call syntax for `_max` attributes (see second example). If called from inside the block of a [fieldset](#fieldset) mixin, will also add the appropriate information for calling a repeating attribute.
|Argument|type|description|
|---|---|---|
|attrName|`string`|The attribute name to create an attribute call for.|


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
returns `string` 
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

```
**PUG**
```js
+button({name:'my button',type:'action','data-i18n':'action button'})
```
**HTML**
```html

```
## button-label
`mixin`

A mixin to create a combined button and input that are within the same container. Similar to [input-label](#input-label), but does not use a label.
|Argument|type|description|
|---|---|---|
|inputObj|`object`|An object describing the input to be paired with the button. This is the same object that you would pass to [input](#input).|
|buttonObj|`object`|An object describing the button to be paired with the input. This is the same object that you would pass to [button](#button).|
|divObj|`object`|An object describing the container div. Similar to the first two objects, but will most likely only have a `class` property if it is passed at all.|


### Example
**PUG**
```js
+button-label({inputObj:{name:'strength',type:'number',class:'underlined',value:10,trigger:{affects:['athletics']}},buttonObj:{name:'strength_roll',type:'roll',value:'/r 1d20+@{strength}'},divObj:{class:'strength'}})
```
**HTML**
```html

  
  
 "%{strength}"
```
**PUG**
```js
+fieldset({name:'equipment'})
  - buttonTitle('use') => "%{repeating_equipment_$X_use}"
```
returns `string` 
## capitalize
`function`

Capitalizes the first let of words in a string.
|Argument|type|description|
|---|---|---|
|string|`string`|The string to apply capitalization to.|


returns `string` 
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

```
## collapse
`mixin`

Alias for [checkbox](#checkbox) that creates a checkbox for use in collapsing/expanding a section. Sets the checkbox to unchecked with a checked value of `1` and a class of `collapse`. Additional classes/ids can be applied by applying them inline to the mixin call.
|Argument|type|description|
|---|---|---|
|name|`string`|The name to assign to the collapse button. Defaults to `collapse`|


## compendiumAttributes
`mixin`

Creates a set of compendium drop target attributes. Defaults to creating target attributes for the `Name` and `data` compendium attributes.
|Argument|type|description|
|---|---|---|
|prefix|`string`|A prefix to attach to the default attribute names.|
|lookupAttributes|`array`|An array of the lookup attributes to create targets for. The target attributes are named based on the compendium attribute they are for. lookupAttributes defaults to `["Name","data"]`.|
|triggerAccept|`string`|The compendium attribute that should trigger the sheetworkers to handle the compendium drop.|
|trigger|`object`|The trigger object. Defaults to `{listenerFunc:"handleCompendiumDrop"}`|


### Examples
**PUG**
```js
+compendiumAttributes({})
```
**HTML**
```html


```
**PUG**
```js
+compendiumAttributes({prefix:'prefix'})
```
**HTML**
```html


```
**PUG**
```js
+compendiumAttributes({lookupAttributes:['Name','data','Category'],prefix:'prefix})
```
**HTML**
```html



```
## customControlFieldset
`mixin`

Alias for [fieldset](#fieldset) that creates to custom action buttons to add/remove rows to the repeating section. Useful when you need to trigger a sheetworker when a row is added. This also prevents the occassional error of a new row disappearing immediately after the user has clicked the button to create one. Proper use of this will require css to hide the default buttons that fieldsets create automatically. Note that currently this assumes the existence of an addItem and editSection sheetworker function.
|Argument|type|description|
|---|---|---|
|name|`string`|The name of the repeating section. Will be prefixed with `repeating_` and spaces will be replaced with dashes (`-`).|
|trigger|`object`|Trigger that defines how to handle the removal of a row from the fieldset. `Optional`|
|addClass|`string`|Any additional classes that should be used for the repeating section. Note that these are not added to the fieldset itself as adding additional classes to the fieldset itself interferes with calling action buttons from chat, but are added to a span that precedes the fieldset. This allows styling of the repcontainer via a css declaration like `.bonus-class + fieldset + .repcontainer`.|


### Example
**PUG**
```js
+customControlFieldset({name:'equipment'})
  +text({name:'name',class:'underlined'})
```
**HTML**
```html



  

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

  
  

```
## fieldset
`mixin`

A mixin that creates a fieldset for the creation of a repeating section. The mixin prefixes the name with `repeating_` and replaces problem characters (e.g. spaces are replaced with dashes). Additionally, the auto-generated title properties from the K-scaffold's mixins will include the proper repeating section information.
|Argument|type|description|
|---|---|---|
|name|`string`|The name of the repeating section. Will be prefixed with `repeating_` and spaces will be replaced with dashes (`-`).|
|trigger|`object`|Trigger that defines how to handle the removal of a row from the fieldset. `Optional`|
|addClass|`string`|Any additional classes that should be used for the repeating section. Note that these are not added to the fieldset itself as adding additional classes to the fieldset itself interferes with calling action buttons from chat, but are added to a span that precedes the fieldset. This allows styling of the repcontainer via a css declaration like `.bonus-class + fieldset + .repcontainer`.|


### Examples
**PUG**
```js
+fieldset({name:'equipment'})
  +text({name:'name',class:'underlined'})
```
**HTML**
```html

  

```
**PUG**
```js
+fieldset({name:'equipment',trigger:{listenerFunc:'handleDeletedRow'},addClass:'class-1 class-2'})
  +text({name:'name',class:'underlined'})
```
**HTML**
```html


  

```
## fillLeft
`mixin`

A mixin that creates a construction that can be used to recreate sheet mechanics that fill to the left. Will apply BEM style classes in addition to the classes specified. BEM classes that can be applied are
  - `fill-left`: The class for the fill-left container.
  - `fill-left__radio`: The class applied to all the radio buttons in the container
  - `fill-left__radio--clearer`: The class applied to the clear value radio button
|Argument|type|description|
|---|---|---|
|radioObj|`object`|The object containing the details of the radio input to create. Similar to the [radio mixin](#radio), but the value property passed is used as the default checked value.|
|divObj|`object`|Optional object containing any details of the div to be applied such as class, id, or other properties. Class and ID can also be supplied by attaching them to the mixin invocation just like with a regular div.|
|valueArray|`array`|Array containing the values to be used for the fill to left construction. These should be in the order that they should be displayed left to right.|
|noClear|`boolean`|Optional argument that tells the mixin whether or not to apply the `fill-left__radio--clearer` class to the first radio button value. If falsy (or not passed), the class is applied. If truthy, the class is not applied.|


### Examples
**PUG**
```js
+fillLeft({radioObj:{name:'track',class:'some-class',value:"0"},valueArray:[0,1,2]})
```
**HTML**
```html

  
  
  

```
**PUG**
```js
+fillLeft({radioObj:{name:'track',class:'some-class',value:"0"},valueArray:[0,1,2],noClear:true})
```
**HTML**
```html

  
  
  

```
**PUG**
```js
+fillLeft({radioObj:{name:'track',class:'some-class',value:"0"},valueArray:[0,1,2],divObj:{'aria-label':'Accessible tracker'}}).custom-tracker-class
```
**HTML**
```html

  
  
  

```
## headedTextarea
`mixin`

Creates a construction for pairing a header with a textarea. Currently is locked to creating an `h3`.  This mixin also accepts classes and IDs appended directly to it (see the second example)
|Argument|type|description|
|---|---|---|
|textObj|`object`|The object describing the textarea as per [textarea](#textarea)|
|header|`string`|The `data-i18n` translation key to use for the header|


### Examples
**PUG**
```js
+headedTextarea({textObj:{name:'character description','data-i18n-placeholder':'The description of your character'},header:'description'})
```
**HTML**
```html

  
  

```
**PUG**
```js
+headedTextarea({textObj:{name:'character description','data-i18n-placeholder':'The description of your character'},header:'description'}).character-description
```
**HTML**
```html

  
  

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

```
## input
`mixin`

A generic mixin to create an input. The mixin will replace spaces in the attribute name with underscores and will add a title property if one isn't supplied that will inform the user what the attribute call for the attribute is.
|Argument|type|description|
|---|---|---|
|obj|`object`|An object containing all of the properties to apply to the element. Must have the properties; `name` and `type`. Can have any property that is valid for an input element. May also have a [trigger](#trigger) property|
|obj.name|`string`||


### Example
**PUG**
```js
+input({name:'my attribute',type:'text',class:'some-class',trigger:{affects:['other_attribute']}})'
```
**HTML**
```html
'
```
## input-label
`mixin`

Creates a construction that nests the input and span in a label so that they are connected. This is beneficial for screen readers as well as making it easier to interact with the input via mouse by clicking on the text associated with it.
|Argument|type|description|
|---|---|---|
|label|`string`|The `data-i18n` translation key to add to the span in the label.|
|inputObj|`object`|An object describing the input to be paired with the button. This is the same object that you would pass to [input](#input).|
|divObj|`object`|An object describing the container label. Similar to the inputObj, but will most likely only have a `class` property if it is passed at all.|
|spanObj|`object`|An object describing the span to be paired with the input. This is the same object that you would pass to [span](#span).|
|block|`block`|The mixin uses the pug block as the content of the select.|


### Example
**PUG**
```js
+input-label({label:'strength',inputObj:{name:'strength',type:'number'},divObj:{class:'div-class'},spanObj:{class:'span-class'}})
```
**HTML**
```html

  

```
## kscript
`mixin`

Similar to [script](#script), but includes the K-scaffold's javascript function library.
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

```
## option
`mixin`

Creates an option attribute. Also stores the trigger for the select that the option is part of. See [select](#select) for example uses.
## pseudo-button
`mixin`

A mixin for creating pseudo buttons of paired checkboxes/radios and spans such as those that had to be used to create [tabbed sheets](https://wiki.roll20.net/CSS_Wizardry#Show.2FHide_Areas) before action buttons were introduced.
|Argument|type|description|
|---|---|---|
|label|`string`|The `data-i18n` translation key to use for the displayed text.|
|inputObj|`object`|An object describing the input to be paired with the span. This is the same object that you would pass to [input](#input).|


### Example
**PUG**
```js
+pseudo-button('page 1',{name:'page',type:'radio',value:1,trigger:{triggeredFuncs:['changePage']}})
```
**HTML**
```html


  
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

```
## replaceProblems
`function`

Escapes problem characters in a string for use as a regex.
|Argument|type|description|
|---|---|---|
|string|`string`|The string to work on|


### Example
**PUG**
```js
- replaceProblems("Here's a problem => [") => "Here's a problem => ["
```
returns `string` 
## replaceSpaces
`function`

Replaces spaces in a string with underscores (`_`).
|Argument|type|description|
|---|---|---|
|string|`string`|The string to work on|


### Example
**PUG**
```js
- replaceSpaces('attribute name') => "attribute_name"
```
returns `string` 
## roller-label
`mixin`

Similar to the construction created by [button-label](#button-label), except that it creates a [roller](#roller) construction instead of just a straight button.
|Argument|type|description|
|---|---|---|
|inputObj|`object`|An object describing the input to be paired with the button. This is the same object that you would pass to [input](#input).|
|buttonObj|`object`|An object describing the button to be paired with the input. This is the same object that you would pass to [roller](#roller).|
|divObj|`object`|An object describing the container div. Similar to the first two objects, but will most likely only have a `class` property if it is passed at all.|


## script
`mixin`

Creates a generic [Roll20 script block](https://wiki.roll20.net/Building_Character_Sheets#JavaScript_2) for use with the sheetworker system.
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

  
  

```
## select-label
`mixin`

Similar to the construction created by [input-label](#input-label), except that the input is replaced with a select.
|Argument|type|description|
|---|---|---|
|label|`string`|The `data-i18n` translation key to add to the span in the label.|
|inputObj|`object`|An object describing the select to be paired with the button. This is the same object that you would pass to [select](#select).|
|divObj|`object`|An object describing the container label. Similar to the inputObj, but will most likely only have a `class` property if it is passed at all.|
|spanObj|`object`|An object describing the span to be paired with the input. This is the same object that you would pass to [span](#span).|
|block|`block`|The mixin uses the pug block as the content of the select.|


### Example
**PUG**
```js
+select-label('Whisper to GM',{name:'whisper'},{class:'div-class'},{class:'span-class'})
  +option({value:'','data-i18n':'never'})
  +option({value:'/w gm ','data-i18n':'always'})
```
**HTML**
```html

  
    
    
  

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
Placeholder text
```
## trigger
`argument`

Many of the K-scaffold's mixins utilize the scaffold's trigger system. Triggers can be passed in any mixin that creates an attribute backed element, which is any element that you would give the `name` property to. The trigger is passed as a property of the object that defines the attribute backed element. See the [input mixin](#input) below for a simple example.
Triggers are how the K-scaffold connects the attributes created in the html of the sheet with the javscript listeners to trigger sheetworker code. When accessed from a sheetworker, a trigger has all of the below properties. When passing a trigger into a mixin, it should only have any or all of the first four properties; `affects`,`initialFunc`, `calculation`, `triggeredFuncs`, and `listenerFunc`. Note that except for `listenerFunc`, the function that is called is passed arguments using the [destructuring assignment pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). This means that the functions referenced in ,`initialFunc`, `calculation`, and `triggeredFuncs` must be passed in an object associated with a key named as indicated in the arguments below.
|Argument|type|description|
|---|---|---|
|affects|`Array`|An array of attribute names that this attribute might affect. As an example, the `strength` attribute in a 5e based sheet would have `strength_mod` in its affects array.|
|initialFunc|`string`|The name of a function that has been registered with the K-scaffold using [k.registerFuncs](https://github.com/Kurohyou/Roll20-Snippets/blob/main/K_Scaffold/readme_docs/k_scaffold_js_documentation.md#registerFuncs). This function will only be called if the change to the attribute is directly caused by the user as opposed to being changed by the sheetworkers.
The K-scaffold sends this function the following arguments:
- `trigger`: The trigger object for the attribute that is being changed
- `attributes`: the attributes object containing the entire state of the sheet.
- `sections`: An object containing the row IDs of all the repeating sections, indexed by section name (e.g. repeating_equipment).|
|calculation|`string`|The name of a function that has been registered with the K-scaffold using [k.registerFuncs](https://github.com/Kurohyou/Roll20-Snippets/blob/main/K_Scaffold/readme_docs/k_scaffold_js_documentation.md#registerFuncs). This function must return the calculated value of the attribute it is for, and is only called if the attribute is not changed directly by the user. Ideally, this function should be written as a pure function, reacting only to the arguments it is passed, and returning a value without modifying any of the arguments it is passed.
The K-scaffold sends this function the following arguments:
- `trigger`: The trigger object for the attribute that is being changed
- `attributes`: the attributes object containing the entire state of the sheet.
- `sections`: An object containing the row IDs of all the repeating sections, indexed by section name (e.g. repeating_equipment).|
|triggeredFuncs|`Array`|An array of function names that have been registered with the K-scaffold using [k.registerFuncs](https://github.com/Kurohyou/Roll20-Snippets/blob/main/K_Scaffold/readme_docs/k_scaffold_js_documentation.md#registerFuncs). These functions are called any time an attribute is changed, regardless of the source of the change, do not return any values, and will likely modify the arguments that are passed to them. These functions are used for doing complex logic to determine what should be done in response to a change.
The K-scaffold sends these functions the following arguments:
- `trigger`: The trigger object for the attribute that is being changed
- `attributes`: the attributes object containing the entire state of the sheet.
- `sections`: An object containing the row IDs of all the repeating sections, indexed by section name (e.g. repeating_equipment), and in the order that they appear on the sheet.|
|listenerFunc|`string`|The name of a function that has been registered with the K-scaffold using [k.registerFuncs](https://github.com/Kurohyou/Roll20-Snippets/blob/main/K_Scaffold/readme_docs/k_scaffold_js_documentation.md#registerFuncs). This function will be called directly from the event listener for this attribute instead of the default [accessSheet](https://github.com/Kurohyou/Roll20-Snippets/blob/main/K_Scaffold/readme_docs/k_scaffold_js_documentation.md#accesssheet) listener function. If a `listenerFunc` is specified, the automated handling of the rest of the previous trigger properties will be disabled. You can still use these properties, but will need to code that handling yourself.
The K-scaffold sends this function the following argument:
- `event`: The event information object that is passed to the callback in the [sheet worker event listener](https://wiki.roll20.net/Sheet_Worker_Scripts#Event_listener). This is **NOT** passed using the object destructuring pattern, unlike the previous three function types.|
|name|`string`|The name of the attribute. When accessed from inside the default function cascade of the K-scaffold, or the callback of [getAllAttrs](https://github.com/Kurohyou/Roll20-Snippets/blob/main/K_Scaffold/readme_docs/k_scaffold_js_documentation.md#getAllAttrs), repeating attributes will include their specific row id for that instance of the attribute.|
|type|`string`|What type of attribute is this. This is determined by the type of element that first created the trigger. Can be `text`,`number`,`checkbox`,`select`,or `radio`, but will usually be `text` or `number` based on the type of default value that is assigned to the attribute.|
|defaultValue|`string|number`|What the default value of the attribute is. The k-scaffold uses this to return the default value in the event the value of the attribute becomes corrupted. For checkboxes and radios, this is determined based on the check state of the element. For selects, this is determined by which option has the `selected` property.|