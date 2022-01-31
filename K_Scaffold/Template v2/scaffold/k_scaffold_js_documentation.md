# K Scaffold JS documentation
## `string` - sheetName
This stores the name of your sheet for use in the logging functions [k.log](#klog) and [k.debug](#kdebug).
## `number` - version
This stores the version of your sheet for use in the logging functions [k.log](#klog) and [k.debug](#kdebug), and in the K-scaffolds sheet versioning handling. It is also stored in the sheet_version attribute on your character sheet.
## `boolean` - debugMode
A boolean flag that tells the script whether to enable or disable [k.debug](#kdebug) calls. If the version of the sheet is `0`, or an attribute named `debug_mode` is found on opening this is set to true for all sheets you open from that point on. Otherwise, it remains false.
## `function` - k.sanitizeForRegex
Replaces problem characters to use a string as a regex.
- `string` - text: The text to replace characters in.
## `function` - k.value
Converts a value to a number, it's default value, or `0` if no default value passed.
- `any` - val: The value to coerce into a number.
- `number` - def: A default value to use, if not passed, 0 is used instead.
## `function` - k.parseRepeatName
Extracts the section (e.g. `repeating_equipment`), rowID (e.g `-;lkj098J:LKj`), and field name (e.g. `bulk`) from a repeating attribute name.
- `string` - string: The attribute name to parse.
- `array` - For a repeating attribute named `repeating_equipment_-LKJhpoi98;lj_weight`, the array will be `['repeating_equipment','-LKJhpoi98;lj','weight']`.
## `function` - k.parseTriggerName
Parses out the components of a trigger name similar to {@link parseRepeatName}. Aliases: parseClickTrigger.

Aliases: `k.parseClickTrigger`
- `string` - string: The triggerName property of the [event](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object).
- `array` - For a repeating button named `repeating_equipment_-LKJhpoi98;lj_roll`, the array will be `['repeating_equipment','-LKJhpoi98;lj','roll']`. For a non repeating button named `roll`, the array will be `[undefined,undefined,'roll']`
## `function` - k.parseHTMLName
Parses out the attribute name from the htmlattribute name.
- `string` - string: The triggerName property of the [event](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object).
- `array` - For a repeating button named `act_repeating_equipment_-LKJhpoi98;lj_roll`, the array will be `['repeating_equipment','-LKJhpoi98;lj','roll']`. For a non repeating button named `act_roll`, the array will be `[undefined,undefined,'roll']`
## `function` - k.capitalize
Capitalize each word in a string.
- `string` - string: The string to capitalize
- `string` - The capitalized string
## `function` - k.extractQueryResult
Extracts a roll query result for use in later functions. Must be awaited as per [startRoll documentation](https://wiki.roll20.net/Sheet_Worker_Scripts#Roll_Parsing.28NEW.29). Stolen from [Oosh's Adventures with Startroll thread](https://app.roll20.net/forum/post/10346883/adventures-with-startroll).
- `string` - query: The query should be just the text as the `?{` and `}` at the start/end of the query are added by the function.
- `string` - The selected value from the roll query
## `function` - k.pseudoQuery
Simulates a query for ensuring that async/await works correctly in the sheetworker environment when doing conditional startRolls. E.g. if you have an if/else and only one of the conditions results in `startRoll` being called (and thus an `await`), the sheetworker environment would normally crash. Awaiting this in the condition that does not actually need to call `startRoll` will keep the environment in sync.
- `number|string` - value: The value to return. Optional.
- `string` - The `value` passed to the function is returned after startRoll resolves.
## `function` - k.log
An alias for console.log.
- `string|object|array` - msg: The message can be a straight string, an object, or an array. If it is an object or array, the object will be broken down so that each key is used as a label to output followed by the value of that key. If the value of the key is an object or array, it will be output via `console.table`.
## `function` - k.debug
Alias for console.log that only triggers when debug mode is enabled or when the sheet's version is `0`.
- `string` - setObj: See [k.log](#klog)
- `boolean` - force: Pass as a truthy value to force the debug output to be output to the console regardless of debug mode.
## `function` - k.orderSections
Orders the section id arrays for all sections in the `sections` object to match the repOrder attribute.
- `object` - attributes: The attributes object that must have a value for the reporder for each section.
- `object` - sections: Object containing the IDs for the repeating sections, indexed by repeating section name.
## `function` - k.orderSection
Orders a single ID array.
- `array` - setObj: Array of IDs in the order they are in on the sheet.
- `array` - vocal: Array of IDs to be ordered.
## `function` - k.commaArray
Splits a comma delimited string into an array
- `string` - setObj: The string to split.
- `array` - The string segments of the comma delimited list.
## `object` - K-Scaffold Attribute Object
The attributes object that is passed as the first agrument to the callbacks from [k.getAttrs()](#kgetattrs) and [k.getAllAttrs](#kgetallattrs). This is a proxy for the basic attributes object passed to the callback in the sheetworker [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) and has been upgraded with several new abilities.
- `string|number` - name of attribute: The attribute value you are accessing. Accessing the attribute value will return the most recent value and the value will be converted into a number if it should be.
- `function` - set({vocal,callback,attributes,sections,casc}): Applies any updates that are currently cached to the sheet. This function uses [the destructuring assignment pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).
- `boolean` - set.vocal: Set will not be silent. Inverts the standard behavior of setAttrs options object.
- `function` - set.callback: A callback to be invoked once the setAttrs is completed
- `object` - set.attributes: The instance of the K-scaffold Attribute Object to use for further set operations
- `object` - set.sections: An object containing the idArrays for each repeating section, indexed by full section name (e.g. `repeating_equipment`)
- `object` - set.casc: As the casc property described below.
- `object` - attributes: An object that contains the original attribute values as returned by [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29). Original attribute values can always be accessed by callin them from this property directly, e.g. `attributes.attributes.strength`
- `object` - updates: An object that contains all the attribute values that need to be set on the sheet.
- `object` - repOrders: An object containing the idArrays for each repeating section that need to be udpated, indexed by full section name (e.g. `repeating_equipment`)
- `array` - queue: The queue of attributes to work through.
- `object` - casc: The expanded version of the [cascades object](#cascades).
- `function` - processChange({event,trigger,attributes,sections,casc}): Function to iterate through attribute changes for default handling. Uses [the destructuring assignment pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).
- `object` - processChange.event: [A Roll20 event object](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object).
- `object` - processChange.trigger: The trigger object as contained in [cascades](#cascades)
- `object` - processChange.attributes: The K-scaffold Attribute object to use
- `object` - processChange.sections: An object containing the idArrays for each repeating section, indexed by full section name (e.g. `repeating_equipment`)
- `object` - processChange.casc: As the casc object above.
- `function` - triggerFunctions(trigger,attributes,sections): Calls functions that are triggered whenever an attribute is changed or affected
- `object` - triggerFunctions.trigger: The trigger object as contained in the [cascades object](#cascades)
- `object` - triggerFunctions.attributes: The attributes object.
- `object` - triggerFunctions.sections: An object containing the idArrays for each repeating section, indexed by full section name (e.g. `repeating_equipment`)
- `function` - initialFunction(trigger,attributes,sections): Calls functions that are only triggered when an attribute is the triggering event
- `object` - initialFunction.trigger: The trigger object as contained in the [cascades object](#cascades)
- `object` - initialFunction.attributes: The attributes object.
- `object` - initialFunction.sections: An object containing the idArrays for each repeating section, indexed by full section name (e.g. `repeating_equipment`)
- `function` - getCascObj(event,casc): Gets the appropriate cascade object for a given attribute or action button
- `object` - event: 
- `object` - getCascObj.casc: As the casc object above.
## `function` - k.registerFuncs
Function that registers a function for being called via the funcs object. Returns true if the function was successfully registered, and false if it could not be registered for any reason.
- `object` - funcObj: Object with keys that are names to register functions under and values that are functions.
- `object` - optionsObj: Object that contains options to use for this registration.
- `['strings']` - optionsObj.type: Array that contains the types of specialized functions that apply to the functions being registered. Valid types are `"opener"`, `"updater"`, and `"default"`. `"default"` is always used, and never needs to be passed.
- `boolean` - True if the registration succeeded, false if it failed.
## `function` - k.callFunc
Function to call a function previously registered to the funcs object. May not be used that much. Either returns the function or null if no function exists.
- `string` - funcName: The name of the function to invoke.
- `any` - args: The arguments to call the function with.
- `any` - undefined
## `function` - k.accessSheet
The default listener for the K-scaffold. Used whenever a `listenerFunc` is not specified in an attribute's trigger object
- `object` - event: The event from the Roll20 trigger as described in [the wiki](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object)
## `function` - k.setSectionOrder
Alias for [setSectionOrder()](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) that allows you to use the section name in either `repeating_section` or `section` formats. Note that the Roll20 sheetworker [setSectionOrder](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) currently causes some display issues on sheets.
- `string` - section: The name of the section to change the order in. Accepts the section name with or without the `repeating_` prefix.
- `['string']` - order: Array of the row ids in the order that the rows need to be placed.
## `function` - k.removeRepeatingRow
Alias for [removeRepeatingRow](https://wiki.roll20.net/Sheet_Worker_Scripts#removeRepeatingRow.28_RowID_.29) that also removes the row from the current object of attribute values and array of section IDs to ensure that erroneous updates are not issued.
- `string` - row: The row id including the section name, e.g. `repeating_equipment_-oiuLKJ987ulkj`.
- `object` - attributes: The attributes object passed to the callback in [k.getAllAttrs()](#getAllAttrs), [k.getAttrs()](#getAttrs), or [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29)
- `object` - sections: Object that contains arrays of all the IDs in sections on the sheet indexed by repeating name.
## `function` - k.getAttrs
Alias for [getAttrs](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28_RowID_.29) that converts the default object of attribute values into a K-scaffold attributes object and passes that back to the callback function.
- `array` - props: Array of attribute names to get the values of as per the [getAttrs() sheetworker](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29). If not passed, gets all the attributes contained in the cascades object.
- `function` - callback: The function to call after the attribute values have been gotten. Works the same as the callback for the [getAttrs() sheetworker](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29).
## `function` - k.getAllAttrs
Alias for [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) and [getSectionIDs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that combines the actions of both sheetworker functions and converts the default object of attribute values into a K-scaffold attributes object. 
- `array` - props: Array of attribute names to get the values of as per the [getAttrs() sheetworker](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29).
- `array` - sectionDetails: An array of objects that contain the details on how to handle a given repeating section. See [k.getSections](#getSections) for more details.
- `function` - callback(attributes,sections,casc): The function to call after the attribute values have been gotten. Three arguments are passed to the callback; `attributes`, `sections`, and `casc`. `sections` is an object that holds arrays of row ids, indexed by repeating section name. `casc` is the expanded version of the cascades object with repeating attributes including their row IDs.
## `function` - k.getSections
Alias for [getSectionIDs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that allows you to iterate through several sections at once. Also assembles an array of repeating attributes to get.
- `array` - props: Array of attribute names to get the values of as per the [getAttrs() sheetworker](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29).
- `array` - sectionDetails: An array of objects that contain the details on how to handle a given repeating section. See [k.repeatingSectionDetails](#krepeatingsectiondetails) for more details.
- `function` - callback(repeatAttrs,sections): The function to call after the attribute values have been gotten. Two arguments are passed to the callback; `repeatAttrs` and `sections`. `repeatAttrs` is an array of repeating attributes ready to be used in a [getAttrs](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29), or [k.getAttrs](#kgetattrs) call. `sections` is an object that holds arrays of row ids, indexed by repeating section name.
## `function` - k.setAttrs
Alias for [setAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#setAttrs.28values.2Coptions.2Ccallback.29) that sets silently by default.
- `object` - setObj: Object with key/value pairs of attributes to set on the sheet. See [the wiki page](https://wiki.roll20.net/Sheet_Worker_Scripts#setAttrs.28values.2Coptions.2Ccallback.29) for more information.
- `boolean` - vocal: Whether to set silently (default value) or not.
- `function` - callback(): The callback function to invoke after the setting has been completed. No arguments are passed to the callback function.
## `function` - k.generateRowID
Alias for generateRowID that adds the new id to the sections object. Also allows for creation of custom IDs that conform to the section ID requirements.
- `string` - setObj: The section name to create an ID for. The `repeating_` prefix is optional so both `repeating_equipment` and `equipment` are valid.
- `object` - vocal: Object containing the IDs for the repeating sections, indexed by repeating section name.
- `string` - customText: Custom text to start the ID with. This text should not be longer than the standard repeating section ID format.