# K Scaffold JS documentation
- [k.sheetName](#ksheetName)
- [k.version](#kversion)
- [k.debugMode](#kdebugMode)
- [k.sanitizeForRegex](#ksanitizeForRegex)
- [k.value](#kvalue)
- [k.parseRepeatName](#kparseRepeatName)
- [k.parseTriggerName](#kparseTriggerName)
- [k.parseHTMLName](#kparseHTMLName)
- [k.capitalize](#kcapitalize)
- [k.extractQueryResult](#kextractQueryResult)
- [k.pseudoQuery](#kpseudoQuery)
- [k.log](#klog)
- [k.debug](#kdebug)
- [k.orderSections](#korderSections)
- [k.orderSection](#korderSection)
- [k.commaArray](#kcommaArray)
- [K-Scaffold Attribute Object](#K-Scaffold-Attribute-Object)
- [k.registerFuncs](#kregisterFuncs)
- [k.callFunc](#kcallFunc)
- [accessSheet](#accessSheet)
- [k.setSectionOrder](#ksetSectionOrder)
- [k.removeRepeatingRow](#kremoveRepeatingRow)
- [k.getAttrs](#kgetAttrs)
- [k.getAllAttrs](#kgetAllAttrs)
- [k.getSections](#kgetSections)
- [k.setAttrs](#ksetAttrs)
- [k.generateRowID](#kgenerateRowID)
## k.sheetName
`string`

This stores the name of your sheet for use in the logging functions [k.log](#klog) and [k.debug](#kdebug).
## k.version
`number`

This stores the version of your sheet for use in the logging functions [k.log](#klog) and [k.debug](#kdebug), and in the K-scaffolds sheet versioning handling. It is also stored in the sheet_version attribute on your character sheet.
## k.debugMode
`boolean`

A boolean flag that tells the script whether to enable or disable [k.debug](#kdebug) calls. If the version of the sheet is `0`, or an attribute named `debug_mode` is found on opening this is set to true for all sheets you open from that point on. Otherwise, it remains false.
## k.sanitizeForRegex
`function`

```js
k.sanitizeForRegex(text)
```
Replaces problem characters to use a string as a regex.
|Argument|type|description|
|...|...|...|
|text|`string`|The text to replace characters in.
## k.value
`function`

```js
k.value(val,def)
```
Converts a value to a number, it's default value, or `0` if no default value passed.
|Argument|type|description|
|...|...|...|
|val|`any`|The value to coerce into a number.
|def|`number`|A default value to use, if not passed, 0 is used instead.
## k.parseRepeatName
`function`

```js
k.parseRepeatName(string)
```
Extracts the section (e.g. `repeating_equipment`), rowID (e.g `-;lkj098J:LKj`), and field name (e.g. `bulk`) from a repeating attribute name.
|Argument|type|description|
|...|...|...|
|string|`string`|The attribute name to parse.
- `returns array` - For a repeating attribute named `repeating_equipment_-LKJhpoi98;lj_weight`, the array will be `['repeating_equipment','-LKJhpoi98;lj','weight']`.
## k.parseTriggerName
`function`

```js
k.parseTriggerName(string)
```
Parses out the components of a trigger name similar to [parseRepeatName](#parserepeatname). Aliases: parseClickTrigger.

Aliases: `k.parseClickTrigger`
|Argument|type|description|
|...|...|...|
|string|`string`|The triggerName property of the [event](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object).
- `returns array` - For a repeating button named `repeating_equipment_-LKJhpoi98;lj_roll`, the array will be `['repeating_equipment','-LKJhpoi98;lj','roll']`. For a non repeating button named `roll`, the array will be `[undefined,undefined,'roll']`
## k.parseHTMLName
`function`

```js
k.parseHTMLName(string)
```
Parses out the attribute name from the htmlattribute name.
|Argument|type|description|
|...|...|...|
|string|`string`|The triggerName property of the [event](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object).
- `returns array` - For a repeating button named `act_repeating_equipment_-LKJhpoi98;lj_roll`, the array will be `['repeating_equipment','-LKJhpoi98;lj','roll']`. For a non repeating button named `act_roll`, the array will be `[undefined,undefined,'roll']`
## k.capitalize
`function`

```js
k.capitalize(string)
```
Capitalize each word in a string.
|Argument|type|description|
|...|...|...|
|string|`string`|The string to capitalize
- `returns string` - The capitalized string
## k.extractQueryResult
`function`

```js
k.extractQueryResult(section,sections,customText)
```
Extracts a roll query result for use in later functions. Must be awaited as per [startRoll documentation](https://wiki.roll20.net/Sheet_Worker_Scripts#Roll_Parsing.28NEW.29). Stolen from [Oosh's Adventures with Startroll thread](https://app.roll20.net/forum/post/10346883/adventures-with-startroll).
|Argument|type|description|
|...|...|...|
|query|`string`|The query should be just the text as the `?{` and `}` at the start/end of the query are added by the function.
- `returns string` - The selected value from the roll query
## k.pseudoQuery
`function`

```js
k.pseudoQuery(section,sections,customText)
```
Simulates a query for ensuring that async/await works correctly in the sheetworker environment when doing conditional startRolls. E.g. if you have an if/else and only one of the conditions results in `startRoll` being called (and thus an `await`), the sheetworker environment would normally crash. Awaiting this in the condition that does not actually need to call `startRoll` will keep the environment in sync.
|Argument|type|description|
|...|...|...|
|value|`number|string`|The value to return. Optional.
- `returns string` - The `value` passed to the function is returned after startRoll resolves.
## k.log
`function`

```js
k.log(msg)
```
An alias for console.log.
|Argument|type|description|
|...|...|...|
|msg|`string|object|array`|The message can be a straight string, an object, or an array. If it is an object or array, the object will be broken down so that each key is used as a label to output followed by the value of that key. If the value of the key is an object or array, it will be output via `console.table`.
## k.debug
`function`

```js
k.debug(msg,force)
```
Alias for console.log that only triggers when debug mode is enabled or when the sheet's version is `0`.
|Argument|type|description|
|...|...|...|
|setObj|`string`|See [k.log](#klog)
|force|`boolean`|Pass as a truthy value to force the debug output to be output to the console regardless of debug mode.
## k.orderSections
`function`

```js
k.orderSections(attributes,sections)
```
Orders the section id arrays for all sections in the `sections` object to match the repOrder attribute.
|Argument|type|description|
|...|...|...|
|attributes|`object`|The attributes object that must have a value for the reporder for each section.
|sections|`object`|Object containing the IDs for the repeating sections, indexed by repeating section name.
## k.orderSection
`function`

```js
k.orderSection(repOrder,IDs)
```
Orders a single ID array.
|Argument|type|description|
|...|...|...|
|setObj|`array`|Array of IDs in the order they are in on the sheet.
|vocal|`array`|Array of IDs to be ordered.
## k.commaArray
`function`

```js
k.commaArray(string)
```
Splits a comma delimited string into an array
|Argument|type|description|
|...|...|...|
|setObj|`string`|The string to split.
- `returns array` - The string segments of the comma delimited list.
## K-Scaffold Attribute Object
`object`

The attributes object that is passed as the first agrument to the callbacks from [k.getAttrs()](#kgetattrs) and [k.getAllAttrs](#kgetallattrs). This is a proxy for the basic attributes object passed to the callback in the sheetworker [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) and has been upgraded with several new abilities.
|Argument|type|description|
|...|...|...|
|name of attribute|`string|number`|The attribute value you are accessing. Accessing the attribute value will return the most recent value and the value will be converted into a number if it should be.
|set({vocal,callback,attributes,sections,casc})|`function`|Applies any updates that are currently cached to the sheet. This function uses [the destructuring assignment pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).
|set.vocal|`boolean`|Set will not be silent. Inverts the standard behavior of setAttrs options object.
|set.callback|`function`|A callback to be invoked once the setAttrs is completed
|set.attributes|`object`|The instance of the K-scaffold Attribute Object to use for further set operations
|set.sections|`object`|An object containing the idArrays for each repeating section, indexed by full section name (e.g. `repeating_equipment`)
|set.casc|`object`|As the casc property described below.
|attributes|`object`|An object that contains the original attribute values as returned by [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29). Original attribute values can always be accessed by callin them from this property directly, e.g. `attributes.attributes.strength`
|updates|`object`|An object that contains all the attribute values that need to be set on the sheet.
|repOrders|`object`|An object containing the idArrays for each repeating section that need to be udpated, indexed by full section name (e.g. `repeating_equipment`)
|queue|`array`|The queue of attributes to work through.
|casc|`object`|The expanded version of the [cascades object](#cascades).
|processChange({event,trigger,attributes,sections,casc})|`function`|Function to iterate through attribute changes for default handling. Uses [the destructuring assignment pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).
|processChange.event|`object`|[A Roll20 event object](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object).
|processChange.trigger|`object`|The trigger object as contained in [cascades](#cascades)
|processChange.attributes|`object`|The K-scaffold Attribute object to use
|processChange.sections|`object`|An object containing the idArrays for each repeating section, indexed by full section name (e.g. `repeating_equipment`)
|processChange.casc|`object`|As the casc object above.
|triggerFunctions(trigger,attributes,sections)|`function`|Calls functions that are triggered whenever an attribute is changed or affected
|triggerFunctions.trigger|`object`|The trigger object as contained in the [cascades object](#cascades)
|triggerFunctions.attributes|`object`|The attributes object.
|triggerFunctions.sections|`object`|An object containing the idArrays for each repeating section, indexed by full section name (e.g. `repeating_equipment`)
|initialFunction(trigger,attributes,sections)|`function`|Calls functions that are only triggered when an attribute is the triggering event
|initialFunction.trigger|`object`|The trigger object as contained in the [cascades object](#cascades)
|initialFunction.attributes|`object`|The attributes object.
|initialFunction.sections|`object`|An object containing the idArrays for each repeating section, indexed by full section name (e.g. `repeating_equipment`)
|getCascObj(event,casc)|`function`|Gets the appropriate cascade object for a given attribute or action button
|event|`object`|
|getCascObj.casc|`object`|As the casc object above.
## k.registerFuncs
`function`

Function that registers a function for being called via the funcs object. Returns true if the function was successfully registered, and false if it could not be registered for any reason.
|Argument|type|description|
|...|...|...|
|funcObj|`object`|Object with keys that are names to register functions under and values that are functions.
|optionsObj|`object`|Object that contains options to use for this registration.
|optionsObj.type|`['strings']`|Array that contains the types of specialized functions that apply to the functions being registered. Valid types are `"opener"`, `"updater"`, and `"default"`. `"default"` is always used, and never needs to be passed.
- `returns boolean` - True if the registration succeeded, false if it failed.
## k.callFunc
`function`

Function to call a function previously registered to the funcs object. May not be used that much. Either returns the function or null if no function exists.
|Argument|type|description|
|...|...|...|
|funcName|`string`|The name of the function to invoke.
|args|`any`|The arguments to call the function with.
- `returns any` - undefined
## k.accessSheet
`function`

The default listener for the K-scaffold. Used whenever a `listenerFunc` is not specified in an attribute's trigger object
|Argument|type|description|
|...|...|...|
|event|`object`|The event from the Roll20 trigger as described in [the wiki](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object)
## k.setSectionOrder
`function`

Alias for [setSectionOrder()](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) that allows you to use the section name in either `repeating_section` or `section` formats. Note that the Roll20 sheetworker [setSectionOrder](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) currently causes some display issues on sheets.
|Argument|type|description|
|...|...|...|
|section|`string`|The name of the section to change the order in. Accepts the section name with or without the `repeating_` prefix.
|order|`['string']`|Array of the row ids in the order that the rows need to be placed.
## k.removeRepeatingRow
`function`

Alias for [removeRepeatingRow](https://wiki.roll20.net/Sheet_Worker_Scripts#removeRepeatingRow.28_RowID_.29) that also removes the row from the current object of attribute values and array of section IDs to ensure that erroneous updates are not issued.
|Argument|type|description|
|...|...|...|
|row|`string`|The row id including the section name, e.g. `repeating_equipment_-oiuLKJ987ulkj`.
|attributes|`object`|The attributes object passed to the callback in [k.getAllAttrs()](#getAllAttrs), [k.getAttrs()](#getAttrs), or [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29)
|sections|`object`|Object that contains arrays of all the IDs in sections on the sheet indexed by repeating name.
## k.getAttrs
`function`

```js
k.getAttrs({props,callback})
```
Alias for [getAttrs](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28_RowID_.29) that converts the default object of attribute values into a K-scaffold attributes object and passes that back to the callback function.
|Argument|type|description|
|...|...|...|
|props|`array`|Array of attribute names to get the values of as per the [getAttrs() sheetworker](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29). If not passed, gets all the attributes contained in the cascades object.
|callback|`function`|The function to call after the attribute values have been gotten. Works the same as the callback for the [getAttrs() sheetworker](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29).
## k.getAllAttrs
`function`

```js
k.getAllAttrs({props,sectionDetails,callback})
```
Alias for [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) and [getSectionIDs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that combines the actions of both sheetworker functions and converts the default object of attribute values into a K-scaffold attributes object. 
|Argument|type|description|
|...|...|...|
|props|`array`|Array of attribute names to get the values of as per the [getAttrs() sheetworker](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29).
|sectionDetails|`array`|An array of objects that contain the details on how to handle a given repeating section. See [k.getSections](#getSections) for more details.
|callback(attributes,sections,casc)|`function`|The function to call after the attribute values have been gotten. Three arguments are passed to the callback; `attributes`, `sections`, and `casc`. `sections` is an object that holds arrays of row ids, indexed by repeating section name. `casc` is the expanded version of the cascades object with repeating attributes including their row IDs.
## k.getSections
`function`

```js
k.getSections(sectionDetails,callback)
```
Alias for [getSectionIDs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that allows you to iterate through several sections at once. Also assembles an array of repeating attributes to get.
|Argument|type|description|
|...|...|...|
|props|`array`|Array of attribute names to get the values of as per the [getAttrs() sheetworker](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29).
|sectionDetails|`array`|An array of objects that contain the details on how to handle a given repeating section. See [k.repeatingSectionDetails](#krepeatingsectiondetails) for more details.
|callback(repeatAttrs,sections)|`function`|The function to call after the attribute values have been gotten. Two arguments are passed to the callback; `repeatAttrs` and `sections`. `repeatAttrs` is an array of repeating attributes ready to be used in a [getAttrs](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29), or [k.getAttrs](#kgetattrs) call. `sections` is an object that holds arrays of row ids, indexed by repeating section name.
## k.setAttrs
`function`

```js
k.setAttrs(setObj,vocal,callback)
```
Alias for [setAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#setAttrs.28values.2Coptions.2Ccallback.29) that sets silently by default.
|Argument|type|description|
|...|...|...|
|setObj|`object`|Object with key/value pairs of attributes to set on the sheet. See [the wiki page](https://wiki.roll20.net/Sheet_Worker_Scripts#setAttrs.28values.2Coptions.2Ccallback.29) for more information.
|vocal|`boolean`|Whether to set silently (default value) or not.
|callback()|`function`|The callback function to invoke after the setting has been completed. No arguments are passed to the callback function.
## k.generateRowID
`function`

```js
k.generateRowID(section,sections,customText)
```
Alias for generateRowID that adds the new id to the sections object. Also allows for creation of custom IDs that conform to the section ID requirements.
|Argument|type|description|
|...|...|...|
|setObj|`string`|The section name to create an ID for. The `repeating_` prefix is optional so both `repeating_equipment` and `equipment` are valid.
|vocal|`object`|Object containing the IDs for the repeating sections, indexed by repeating section name.
|customText|`string`|Custom text to start the ID with. This text should not be longer than the standard repeating section ID format.