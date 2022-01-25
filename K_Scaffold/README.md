# The K-Scaffold
This is the first public release of the character sheet scaffold that I use to build my sheets. It is still under continuous development and will likely change in the future. The scaffold allows sheets and sheetworkers to be written in a more seamless fashion by writing the listeners and connections between attributes directly in the PUG for the sheet.
- [The K-Scaffold](#the-k-scaffold)
  - [Features](#features)
  - [js scaffold documentation](https://htmlpreview.github.io/?https://github.com/Kurohyou/Roll20-Snippets/blob/kscaffoldmodule/K_Scaffold/out/global.html)
  - [HTML element mixins](#html-element-mixins)
    - [Attribute and button mixins](#attribute-and-button-mixins)
      - [input(obj)](#inputobj)
        - [text(obj)](#textobj)
        - [checkbox(obj)](#checkboxobj)
        - [radio(obj)](#radioobj)
        - [number(obj)](#numberobj)
        - [range(obj)](#rangeobj)
        - [hidden(obj)](#hiddenobj)
      - [textarea(obj)](#textareaobj)
      - [select(obj) and option(obj)](#selectobj-and-optionobj)
      - [img(obj)](#imgobj)
      - [span(obj)](#spanobj)
      - [button(obj)](#buttonobj)
        - [action(obj)](#actionobj)
        - [roller(obj)](#rollerobj)
      - [input-label(label,inputObj,divObj,spanObj)](#input-labellabelinputobjdivobjspanobj)
        - [select-label(label,selectObj,divObj,spanObj)](#select-labellabelselectobjdivobjspanobj)
        - [button-label(inputObj,buttonObj,divObj)](#button-labelinputobjbuttonobjdivobj)
      - [headedTextarea(obj,header)](#headedtextareaobjheader)
      - [adaptiveTextarea(textObj)](#adaptivetextareatextobj)
    - [Roll20 Elements](#roll20-elements)
    - [General HTML Elements](#general-html-elements)
    - [Functions](#functions)
      - [attrTitle(string)](#attrtitlestring)
      - [buttonTitle(string)](#buttontitlestring)
## Features
The scaffold incorporates many useful features. Some of these are PUG mixins and some are sheetworker functions. Others connect the information created in the PUG file with what is used in the sheetworkers. Details on the sheetworker functions can be found in the [js scaffold documentation](https://htmlpreview.github.io/?https://github.com/Kurohyou/Roll20-Snippets/blob/kscaffoldmodule/K_Scaffold/out/global.html)

## HTML element mixins
The most basic element of the K-scaffold are the mixins that are provided for most html elements that might be used in a character sheet. These mixins allow you to specify attributes for an element via an object syntax instead of the standard html syntax. This is useful when iterating through collections of items that may each need different attributes added to their elements and may even require different input types. Something like this.

```js
input(name='attr_character_name' type='text' value='')
input(name='attr_age' type='number' value=10)
```
This creates:
```html
<input name="attr_character_name" type="text" value="">
<input name="attr_age" type="number" value="10">
```
This is a pretty small set of repetitions, but here's how that same setup could be written using the K-scaffold:

```js
- let charDetails = [{name:'character name',type:'text',value:''},{name:'age',type:'number',value:10}];
each obj in charDetails
  +input(obj)
```
The html generated from this pug would be:
```html
<input name="attr_character_name" title="@{character_name}" type="text" value="">
<input name="attr_age" title="@{age}" type="number" value="10">
```

Note that the input mixin has taken care of prepending `attr_` on the name and replacing spaces with underscores. All input and button mixins in the scaffold will take care of these basic naming requirements. Additionally, if there is no title property passed these mixins will automatically add a title property giving the attribute or ability call required to access these elements from the Roll20 chat.

The mixins and functions included in the K-scaffold can be split into four categories of attribute & button mixins, Roll20 element mixins, basic html elements, and PUG functions.

### Attribute and button mixins
#### input(obj)
```js
+input({name:'my attribute',type:'text'})
```
creates:
```html
<input name="attr_my_attribute" type="text" title="@{my_attribute}">
```
The input mixin is a basic mixin that can be used to create any input by passing at minimum a name and type property in the object. 

Input has numerous aliases to allow for creation of the various input types without needing to explicitly pass a `type` property in the object.
##### text(obj)
```js
+text({name:'my attribute'})
```
creates:
```html
<input name="attr_my_attribute" type="text" title="@{my_attribute}">
```
##### checkbox(obj)
```js
+checkbox({name:'my attribute',value:1,checked:''})
```
creates:
```html
<input name="attr_my_attribute" type="checkbox" title="@{my_attribute}" value="1" checked>
```
Note that when using the trigger functionality of the scaffold, the trigger's default value will be set to the value of the checkbox only if the checkbox has the `checked` property, otherwise it is set to `0`.
##### radio(obj)
```js
+radio({name:'my attribute',value:1,checked:''})
+radio({name:'my attribute',value:2})
```
creates:
```html
<input name="attr_my_attribute" type="radio" title="@{my_attribute}" value="1" checked>
<input name="attr_my_attribute" type="radio" title="@{my_attribute}" value="2">
Note that when using the trigger functionality of the scaffold, the trigger should be placed on the radio that is checked by default as this will determine what the default value of the trigger is.
```
##### number(obj)
```js
+number({name:'my attribute',value:1})
```
creates:
```html
<input name="attr_my_attribute" type="number" title="@{my_attribute}" value="1">
```
##### range(obj)
```js
+range({name:'my attribute',value:1})
```
creates:
```html
<input name="attr_my_attribute" type="range" title="@{my_attribute}" value="1">
```
##### hidden(obj)
```js
+hidden({name:'my attribute',value:1})
```
creates:
```html
<input name="attr_my_attribute" type="hidden" title="@{my_attribute}" value="1">
```
#### textarea(obj)
```js
+textarea({name:'my attribute',value:''})
```
creates:
```html
<textarea name="attr_my_attribute" title="@{my_attribute}" value=""></textarea>
```
The `textarea` mixin creates a textarea element.
#### select(obj) and option(obj)
```js
+select({name:'my attribute'})
  +option({value:'option 1',selected:''})
    | option 1
  +option({value:'option 2'})
    | option 2
```
creates:
```html
<select name="attr_my_attribute" title="@{my_attribute}" value="">
  <option value="option 1" selected>option 1</option>
  <option value="option 2">option 2</option>
</select>
```
The `select` and `option` mixins are used together to create selects with options. Note that when using the trigger functionality, the trigger should be placed on the option that is selected by default as this will determine the default value of the trigger.
#### img(obj)
```js
+img({name:'my attribute',src:'www.myimage.jpg'})
```
creates:
```html
<img name="attr_my_attribute" title="@{my_attribute}" src="www.myimage.jpg">
```
Note that an image element should always be paired with an input to be used to edit the img's src. Additionally, the src should be set to whatever the default value of that paired attribute is.
#### span(obj)
```js
+span({name:'my attribute',value:'',class:'attribute-backed'})
  |This span is attribute backed
+span({class:'regular-span'})
  |This is a normal span
```
creates:
```html
<span name="attr_my_attribute" title="@{my_attribute}" value="" class="attribute-backed">This span is attribute backed</span>
<span class="regular-span">This is a normal span</span>
```
The `span` mixin has different behavior based on whether you pass a name property or not. If a name property is passed then it will add a `title` property if there isn't already one. When using the trigger functionality, it is recommended to pass a `value` property as well or specify a `defaultValue` in the trigger.
#### button(obj)
```js
+button({name:'my button',type:'roll',value:'/r 2d6'})
  |roll
+button({{name:'my button',type:'action'})
  |action
```
creates:
```html
<button name="roll_my_button" type="roll" title="%{my_button}" value="">roll</button>
<button name="act_my-button" type="action" title="%{my-button}">action</button>
```
The `button` mixin will name the button based on whether the button is a roll button or action button. Action buttons use kebab-case instead of snake_case for the attribute name itself. If no type is passed to the mixin, the type is set to `roll`.

The `button` mixin has two aliases, `action` and `roller`.
##### action(obj)
```js
+action({{name:'my button',})
  |action
```
creates:
```html
<button name="act_my-button" type="action" title="%{my-button}">action</button>
```
##### roller(obj)
```js
+roller({{name:'my button'})
  |Roll some dice via CRP
```
creates:
```html
<button name="roll_my_button" class="roller" type="roll" value="@{my_button_action}" title="%{my_button}">action</button>
<button name="act_my-button-action" hidden type="action" title="%{my-button-action}"></button>
<input name="attr_my_button_action" type="hidden" title="%{my_button_action}" value="">
```
The `roller` mixin creates a set of three elements that are meant to work together and require sheetworker support to work. Only the roll button is visible to the user. The benefit of this construction is that it creates a button that will trigger CRP or other sheetworker actions, but can be dragged to the user's macro bar unlike a base action button. This mixin requires using the trigger functionality of the scaffold and will add a default trigger for the function `initiateRoll()` if no trigger is passed.
#### input-label(label,inputObj,divObj,spanObj)
```js
- let inputObj = {name:'my attribute',type:'text',value:''};
- let divObj = {class:'other-class'};
- let spanObj = {class:'span-class'};
+input-label('label for input',inputObj,divObj,spanObj)
```
creates:
```html
<label class="other-class input-label">
  <span data-i18n="label for input" class="span-class"></span>
  <input name="attr_my_attribute" type="text" value="">
</label>
```
The `input-label` mixin creates a label construction for associating a span and an input together so that they can be laid out. The `divObj` and `spanObj` arguments are optional.
This mixin has several aliases for constructing similar layout associations for buttons and selects.
##### select-label(label,selectObj,divObj,spanObj)
```js
- let selectObj = {name:'my attribute'};
- let divObj = {class:'other-class'};
- let spanObj = {class:'span-class'};
+select-label('label for input',inputObj,divObj,spanObj)
  +option({value:'option 1'})
    |option 1
  +option({value:'option 2'})
    |option 2
```
creates:
```html
<label class="other-class input-label">
  <span data-i18n="label for input" class="span-class"></span>
  <select name="attr_my_attribute">
    <option value="option 1">option 1</option>
    <option value="option 2">option 2</option>
  </select>
</label>
```
##### button-label(inputObj,buttonObj,divObj)
```js
- let inputObj = {name:'my attribute',type:'number',value:'0'};
- let divObj = {class:'other-class'};
- let buttonObj = {name:'my button',value:"/r 2d6 + @{my_attribute}"};
+button-label(inputObj,spanObj,divObj)
  |Roll dice
```
creates:
```html
<div class="other-class input-label">
  <button name="roll_my_button" value="/r 2d6 + @{my_attribute}">Roll Dice</button>
  <input name="attr_my_attribute" type="number" value="0">
</div>
```
The `button-label` mixin creates a `div` instead of a `label` so that both the button and the input are interactable. However, the construction can be styled the same as other `input-labels` via the `input-label` class.
This mixin has two aliases; `roller-label` and `action-label` which function the same way but create the indicated button constructions instead of a base button.
#### headedTextarea(obj,header)
```js
+headedTextarea({name:'my textarea'},'A textarea with a header')
```
creates:
```html
<div class="headed-textarea">
  <h3 class="headed-textarea__header" data-i18n="A textarea with a header">
  </h3>
  <textarea class="headed-textarea__textarea" name="attr_my_textarea" title="@{my_textarea}"></textarea>
</div>
```
The `headedTextarea` mixin creates a combined textarea and header that can be easily styled as one entity.
#### adaptiveTextarea(textObj)
```js
+adaptiveTextarea({name:'character description'})
```
creates:
```html
<div class="adaptive adaptive--text">
  <span class="adaptive--text__span" name="attr_character_description" title="@{character_description}"></span>
  <textarea class="adaptive--text__textarea" name="attr_character_description" title="@{character_description}"></textarea>
</div>
```
Creates a textarea that will (with proper CSS) grow to fit the content. See [the Roll20 wiki](https://wiki.roll20.net/CSS_Wizardry#Content-scaled_Inputs) for more information about styling this element.
#### adaptiveInput(textObj)
```js
+adaptiveInput({name:'character name'})
```
creates:
```html
<div class="adaptive adaptive--input">
  <span class="adaptive--input__span" name="attr_character_name" title="@{character_name}"></span>
  <input class="adaptive--input__input" name="attr_character_name" title="@{character_name}"/>
</div>
```
Similar to `adaptiveTextarea`, but can grow horizontally with the content of an input.
#### compendiumAttributes
```js
+compendiumAttributes({prefix,lookupAttributes,triggerAccept,trigger})
```
creates:
```html
<input name="attr_drop_name" accept="Name" value="" type="hidden" title="@{drop_name}"/>
<input name="attr_drop_data" accept="data" value="" type="hidden" title="@{drop_data}"/>
```
Creates a series of drop target attributes. Note that the mixin uses the [destructuring assignment syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). All arguments are optional. The default values and purpose are:
- prefix: `undefined` | If a prefix is passed, it is prepended to the name of each of the drop target inputs.
- lookupAttributes: `['Name','data']` | These are the compendium attributes to accept. These defaults are the ones that are generally the most useful.
- triggerAccept: `'Name'` | Which compendium acceptor to put the trigger on
- trigger: `{listenerFunc:'handleCompendiumDrop'}` | the K-scaffold trigger to use for a compendium drop. The default is a generically named listener function.
### Roll template mixins
These mixins create the roll template specific elements required for good looking chat output. They also simplify working with rolltemplate helper functions.
#### rolltemplate(name)
```js
+rolltemplate('my-system')
  |Text output for template
```
creates:
```html
<rolltemplate class="sheet-rolltemplate-my-system">
  <div class="template my-system system-{{system}}">Text output for template
  </div>
</rolltemplate>
```
Creates the rolltemplate prepending `"sheet-rolltemplate-"` to the name passed to it. Also creates a container within the rolltemplate which can be used to easily style the area of the template.
#### multiPartTemplate(my-system)
```js
+multiPartTemplate(name)
```
creates:
```html
<rolltemplate class="sheet-rolltemplate-my-system">
  {{#^rollBetween() computed::finished 0 0}}
    <span class="finished"></span>
  {{/^rollBetween() computed::finished 0 0}}
  <div class="template my-system system-{{system}}{{#continuation}} continuation{{/continuation}}{{#first}} first{{/first}} finished">Text output for template
  </div>
</rolltemplate>
```
Similar to `rolltemplate(name)`, but creates a base for a more complex template that will be used to output complex rolls from [custom roll parsing](https://wiki.roll20.net/Custom_Roll_Parsing) and may need to bridge multiple messages.
#### characterLink
```js
+characterLink()
```
creates:
```html
{{#character_name}}
  {{#character_id}}
    <h4 class="character_name">[{{footer}}](http://journal.roll20.net/character/{{character_id}})</h4>
  {{/character_id}}{{^character_id}}
    <h4 class="character_name">{{footer}}</h4>
  {{/character_id}}
{{/character_name}}
```
Creates a construction for inserting a link to a character (if an id is passed along with the character name)
#### templateConditionalDisplay(fieldBool,invert)
```js
+templateConditionalDisplay('roll1')
  |Output if roll1 is passed
+templateConditionalDisplay('roll1',true)
  |Output if roll1 is not passed
```
creates:
```html
{{#roll1}}Output if roll1 is passed{{/roll1}}
{{^roll1}}Output if roll1 is not passed{{/roll1}}
```
This provides a functional interface for working with the [property logic](https://wiki.roll20.net/Building_Character_Sheets/Roll_Templates#Logic) of roll templates. It accepts a `fieldBool` which is the name of the field to check for presence/absence, and `invert` which is a boolean that defaults to false; when it is truthy it inverts the logic of the conditional display to only display when the field is absent.
#### templateHelperFunction(helperObj)
```js
+templateHelperFunction({func:'rollWasCrit',values:'roll1'})
  |Output on a crit
+templateHelperFunction({func:'rollWasCrit',values:'roll1',invert:true})
  |Output on a normal hit
```
creates:
```html
{{#rollWasCrit() roll1}}Output on a crit{{/rollWasCrit() roll1}}
{{#^rollWasCrit() roll1}}Output on a normal hit{{/^rollWasCrit() roll1}}
```
Sets up a call to the indicated helper function. Inserts the block as the content to display if the helper function returns true.
Accepts an object with the following properties:
- func: The name of the helper function to run.
- values: The text that would normally come after the helper function call (e.g. the `roll1 16` in `{{#rollGreater() roll1 16}}`)
- invert: An optional boolean that when true inverts the functionality of the helper function. Defaults to false.
There are also aliases for `templateHelperFunction` that are specific for each of the [helper functions](https://wiki.roll20.net/Building_Character_Sheets/Roll_Templates#Helper_Functions). These accept the same helperObj, except that the `func` argument is no longer needed (and will be ignored if passed). These alias functions are:
- rollWasCrit
- rollWasFumble
- rollTotal
- rollGreater
- rollLess
- rollBetween
- allProps
### General HTML Elements
There are several generic HTML element mixins which can be used to create these elements via objects instead of explicit definition using the standard PUG syntax. These generic element mixins all accept an object with keys of properties to set and values of what to set those properties to. The generic element mixins are:
- div(obj) - The div obj can also accept a name property for use with the [character sheet image attributes](https://wiki.roll20.net/Image_use_in_character_sheets)
- h1(obj)
- h2(obj)
- h3(obj)
- h4(obj)
- h5(obj)
- h6(obj)
- p(obj)
In addition to the above, there are two additional element mixins for handling scripts which are described below.
#### script
```js
+script
  include myfunctions.js
```
creates:
```html
<script type="text/worker">
  //contents of myfunctions.js
</script>
```
Creates a script tag with the proper type to put your sheetworker functions in. This basic version should only be used if not using the K-scaffold javascript function library.
#### kscript
```js
+script
  include myfunctions.js
```
creates:
```html
<script type="text/worker">
  //The code for the k-scaffold javascript function library will go here.
  //contents of myfunctions.js
</script>
```
Similar to the `script` mixin, but adds all of the code for the k-scaffold function library as the first code in the script block.
### PUG Functions
#### attrTitle(string)
This function returns a properly formatted version of the element's name for use in a title or elsewhere that specifying how to call the element's value in chat may be useful.
```js
attrTitle('my attribute') => '@{my_attribute}'
```
#### buttonTitle(string)
This function returns a properly formatted version of the element's name for use in a title or elsewhere that specifying how to call the element's value in chat may be useful.
```js
buttonTitle('my button') => '%{my_button}'
```