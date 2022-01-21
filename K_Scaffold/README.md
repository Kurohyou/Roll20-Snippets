# The K-Scaffold
This is the first public release of the character sheet scaffold that I use to build my sheets. It is still under continuous development and will likely change in the future. The scaffold allows sheets and sheetworkers to be written in a more seamless fashion by writing the listeners and connections between attributes directly in the PUG for the sheet.

## Features
The scaffold incorporates many useful features. Some of these are PUG mixins and some are sheetworker functions. Others connect the information created in the PUG file with what is used in the sheetworkers. Details on the sheetworker functions can be found in the [js scaffold documentation](js_scaffold.html)

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
#### adaptiveTextarea(textObj)
### Roll20 Elements
### General HTML Elements
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