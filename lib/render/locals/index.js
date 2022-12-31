/**
 * Object that stores attributes that are updated based on the pug but are used in the sheetworkers. The user can add properties to this object to export data from the pug to the sheetworkers.
 * @property {object[]} repeatingSectionDetails - Array of objects that describe each repeating section and the attributes contained in them.
 * @property {string[]} actionAttributes - Array of attribute names created by use of the `roller` mixin.
 * @property {object} cascades - Object that accumulates the trigger information for all attributes created using k-scaffold mixins. Items are added and updated here via the {@link storeTrigger} function.
 */
const varObjects = {
  repeatingSectionDetails:[],
  actionAttributes:[],
  cascades:{
    attr_character_name:{
      name:'character_name',
      type:'text',
      defaultValue:'',
      affects:[],
      triggeredFuncs:['setActionCalls'],
      listenerFunc:'accessSheet',
      listener:'change:character_name'}
    }
};

/**
 * Object that describes the state of k-scaffold prefixes and info that are manipulated in reaction to mixins being used or direclty by the user, but are not used in the sheetworkers.
 * @property {boolean} scriptUsed - Boolean that tracks whether the kScript mixin has been called or not. Default `false`.
 * @property {string} repeatingPrefix - The prefix for the current repeating section. Empty when no repeating section is currently being worked in. Automatically updated when using the fieldset mixins. Default `''`
 * @property {boolean} repeatsIgnoreSystemPrefix - Boolean that controls whether repeating sections ignore the system prefix or not. Default `false`.
 * @property {string} systemPrefix - A prefix that is added to all attribute names until changed. Useful for sheets that handle multiple systems and need separate tracking for similarly named attributes. Default `''`
 */
const k = {
  scriptUsed: false,
  repeatingPrefix:'',
  repeatsIgnoreSystemPrefix:false,
  systemPrefix:''
}


/**
 * checks that the kScript mixin is the final mixin used.
 */
const checkKUse = () => {
  if(k.scriptUsed){
    throw Error('kScript mixin already used. Kscript should be the final mixin used in the sheet code.');
  }
};
  
/**
 * Gets the current state of the system prefix
 * @returns {string}
 */
const getSystemPrefix = () => k.systemPrefix || '';

/**
 * Updates the k.systemPrefix K-scaffold global variable so that any attributes created after this point will be prepended with the prefix. By default attributes in repeating sections are not prepended; instead the repeating section name is prefixed. Returns the previous prefix.
 * @param {string} val - The value to set the prefix to. If not a string or falsy, will reset the prefix to an empty string.
 * @param {boolean} normalRepeating - Whether the prefix should be applied to repeating section names (default), or to the attribute name itself in repeating sections.
 * @returns {string}
 */
const setSystemPrefix = (val,normalRepeating = false) => {
  k.repeatsIgnoreSystemPrefix = normalRepeating;
  const prevPrefix = k.systemPrefix;
  k.systemPrefix = typeof val === 'string' ? val : '';
  return prevPrefix;
};

/**
 * Converts an attribute name into an attribute call for that attribute. Converts `_max` attribute names to the proper attribute call syntax for `_max` attributes (see second example). If called from inside the block of a {@link fieldset} mixin, will also add the appropriate information for calling a repeating attribute.
 * @param {string} string - The attribute name to create an attribute call for.
 * @returns {string}
 */
const attrTitle = (string) => `@{${k.repeatingPrefix}${replaceSpaces(string).replace(/_max$/,'|max')}}`;

/**
 * Converts a string to a valid snake_case attribute name or kebab-case action button name.
 * @param {string} string - The string to adapt
 * @returns {string}
 */
const attrName = (string) => {
  const sysPrefix = getSystemPrefix();
  let tempString = replaceSpaces(`${
  (k.repeatingPrefix && !k.repeatsIgnoreSystemPrefix) || !sysPrefix ?
    '' :
    `${sysPrefix} `
  }${string}`);
  if(sysPrefix){
    tempString = tempString
      .replace(new RegExp(`${sysPrefix}[_-]${sysPrefix}`),sysPrefix);
  }
  return tempString;
};

/**
 * Converts an ability name into an ability call for that attribute. If called from inside the block of a {@link fieldset} mixin, will also add the appropriate information for calling a repeating attribute.
 * @param {string} string - The ability name to create a call for.
 * @returns {string}
 */
const buttonTitle = (string) => `%{${k.repeatingPrefix}${replaceSpaces(string)}}`;
  
/**
 * Replaces spaces in a string with underscores (`_`).
 * @param {string} string - The string to work on
 * @returns {string}
 */
const replaceSpaces = (string) => string.replace(/\s+/g,'_');

/**
 * Escapes problem characters in a string for use as a regex.
 * @param {string} string - The string to work on
 * @returns {string}
 */
const replaceProblems = (string) => string.replace(/[\(\)\[\]\|\/\\]/g,'-');

/**
 * Capitalizes the first let of words in a string.
 * @param {string} string 
 * @returns {string}
 */
const capitalize = (string)=> string.replace(/(?:^|\s+|\/)[a-z]/ig,(letter)=>letter.toUpperCase());

/**
 * Converts a string to a valid kebab-case action button name
 * @param {string} name - The string to convert to an action button name
 * @returns {string}
 */
const actionButtonName = (name) => `${name.replace(/_|\s+/g,'-')}`;
/**
 * Converts the name of an action button in a roller construction to the controlling attribute name.
 * @param {string} name - The string to convert
 * @returns {string}
 */
const actionInputName = (name) => `${name}_action`.replace(/roll_action/,'action');

/**
 * Converts a title back to an attribute name
 * @param {string} string - The string to convert to an attribute name
 * @returns {string}
 */
const titleToName = (string) => string.replace(/[@%]\{|\}/g,'');

/**
 * Adds an item to a designated array property of `varObjects` for tracking.
 * @param {any} item - 
 * @param {string} arrName - Name of the array to manipulate
 */
const addIfUnique = (item,arrName) => {
  varObjects[arrName] = varObjects[arrName] || [];
  if(varObjects[arrName].indexOf(item) === -1){
    varObjects[arrName].push(item);
  }
};

/**
 * Stores the attribute in the cascades object.
 * @param {object} element - Object describing the element
 */
const storeTrigger = function(element){
  let trigger = element.trigger || {};
  const namePrefix = {
    roll:'roll_',
    action:'act_',
    fieldset:'fieldset_'
  };
  const typeDefs = {
    select:'',
    radio:0,
    checkbox:0,
    number:0,
    text:'',
    span:''
  };
  const eventTypes = {
    roll:'clicked',
    action:'clicked',
    fieldset:'remove'
  };
  let elementName = element.title ?
    titleToName(element.title) :
    element.name;
  trigger.name = elementName.replace(/\|/g,'_');
  let cascName = `${namePrefix[element.type] || 'attr_'}${trigger.name}`;
  let match = trigger.name.match(/(repeating_[^_]+)_[^_]+_(.+)/);
  let [,section,field] = match || [,,trigger.name];
  let eventType = eventTypes[element.type] || 'change';
  if(!varObjects.cascades[cascName]){
    if(trigger.listener || trigger.triggeredFuncs || trigger.listenerFunc || trigger.initialFunc || trigger.affects){
      trigger.listener = trigger.listener || `${eventType}:${section ? `${section}:` : ''}${field}`;
      trigger.listenerFunc = trigger.listenerFunc || 'accessSheet';
    }
    trigger.type = element.type;
    if(!namePrefix[element.type]){
      trigger.defaultValue = trigger.hasOwnProperty('defaultValue') ?
        trigger.defaultValue :
        (element.type === 'checkbox' && !element.hasOwnProperty('checked')) ?
          0 :
          element.hasOwnProperty('value') ?
            element.value :
            typeDefs.hasOwnProperty(element.type) ?
              typeDefs[element.type] :
              '';
      trigger.triggeredFuncs = trigger.triggeredFuncs || [];
      if(trigger.affects){
        trigger.affects = trigger.affects.map((affect)=>replaceSpaces(affect));
      }else{
        trigger.affects = [];
      }
    }
    varObjects.cascades[cascName] = {...trigger};
  }else{
    if(!namePrefix[varObjects.cascades[cascName].type]){
      varObjects.cascades[cascName].triggeredFuncs = trigger.triggeredFuncs ?
        [...new Set([...varObjects.cascades[cascName].triggeredFuncs,...trigger.triggeredFuncs])] :
        varObjects.cascades[cascName].triggeredFuncs;
      varObjects.cascades[cascName].affects = trigger.affects ?
        [...new Set([...varObjects.cascades[cascName].affects,...trigger.affects])] : 
        varObjects.cascades[cascName].affects;
      varObjects.cascades[cascName].calculation = varObjects.cascades[cascName].calculation || 
        trigger.calculation;
    }
    if(trigger.listenerFunc || trigger.triggeredFuncs || trigger.affects){
      varObjects.cascades[cascName].listener = varObjects.cascades[cascName].listener || trigger.listener || `${eventType}:${section ? `${section}:` : ''}${field}`;
      varObjects.cascades[cascName].listenerFunc = varObjects.cascades[cascName].listenerFunc || trigger.listenerFunc || 'accessSheet';
    }
  }
};

/**
 * Finds the details for a specific repeating section
 * @param {string} section - The name of the repeating section
 * @returns {object}
 */
const getSectionDetails = function(section){
  return varObjects.repeatingSectionDetails.find((obj)=>obj.section === section);
};

/**
 * Creates an object to store information about a repating section in `varObjects` and pushes it to `repeatingSectionDetails`.
 * @param {string} section - The name of the repeating section
 */
const createFieldsetObj = function(section){
    !getSectionDetails(section) ? 
    varObjects.repeatingSectionDetails.push({section,fields:[]}) :
    null;
};

/**
 * Adds info on an attribute to an existing repeating section detail object.
 * @param {object} obj - Object describing the attribute element being created
 */
const addFieldToFieldsetObj = function(obj){
  let section = k.repeatingPrefix.replace(/_[^_]+_$/,'');
  let sectionDetails = getSectionDetails(section);
  let name = obj.name.replace(/^attr_/,'');
  if(sectionDetails && sectionDetails.fields.indexOf(name) < 0){
    sectionDetails.fields.push(name);
  }
};

/**
 * Converts a k-scaffold element object with a trigger to an element object without k-scaffold specific information.
 * @param {object} obj - The object to convert
 * @returns {object}
 */
const makeElementObj = function(obj){
  const newObj = {...obj};
  delete newObj.trigger;
  return newObj;
};

module.exports = { varObjects, k , checkKUse, getSystemPrefix, setSystemPrefix, attrTitle, attrName, buttonTitle, replaceSpaces, replaceProblems, capitalize, actionButtonName, actionInputName, titleToName, addIfUnique, storeTrigger, getSectionDetails, createFieldsetObj, addFieldToFieldsetObj, makeElementObj };