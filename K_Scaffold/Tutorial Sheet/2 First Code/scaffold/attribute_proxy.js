/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//# Attribute Obj Proxy handler
docs.js['K-Scaffold Attribute Object'] = {
  type:'object',
description:`The attributes object that is passed as the first agrument to the callbacks from [k.getAttrs()](#kgetattrs) and [k.getAllAttrs](#kgetallattrs). This is a proxy for the basic attributes object passed to the callback in the sheetworker [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) and has been upgraded with several new abilities.`,
  arguments:[
    {type:'string|number',name:'name of attribute',description:'The attribute value you are accessing. Accessing the attribute value will return the most recent value and the value will be converted into a number if it should be.'},

    {type:'function',name:'set({vocal,callback,attributes,sections,casc})',description:'Applies any updates that are currently cached to the sheet. This function uses [the destructuring assignment pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).'},
    {type:'boolean',name:'set.vocal',description:'Set will not be silent. Inverts the standard behavior of setAttrs options object.'},
    {type:'function',name:'set.callback',description:'A callback to be invoked once the setAttrs is completed'},
    {type:'object',name:'set.attributes',description:'The instance of the K-scaffold Attribute Object to use for further set operations'},
    {type:'object',name:'set.sections',description:'An object containing the idArrays for each repeating section, indexed by full section name (e.g. `repeating_equipment`)'},
    {type:'object',name:'set.casc',description:'As the casc property described below.'},

    {type:'object',name:'attributes',description:'An object that contains the original attribute values as returned by [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29). Original attribute values can always be accessed by callin them from this property directly, e.g. `attributes.attributes.strength`'},
    {type:'object',name:'updates',description:'An object that contains all the attribute values that need to be set on the sheet.'},
    {type:'object',name:'repOrders',description:'An object containing the idArrays for each repeating section that need to be udpated, indexed by full section name (e.g. `repeating_equipment`)'},
    {type:'array',name:'queue',description:'The queue of attributes to work through.'},
    {type:'object',name:'casc',description:'The expanded version of the [cascades object](#cascades).'},

    {type:'function',name:'processChange({event,trigger,attributes,sections,casc})',description:'Function to iterate through attribute changes for default handling. Uses [the destructuring assignment pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).'},
    {type:'object',name:'processChange.event',description:'[A Roll20 event object](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object).'},
    {type:'object',name:'processChange.trigger',description:'The trigger object as contained in [cascades](#cascades)'},
    {type:'object',name:'processChange.attributes',description:'The K-scaffold Attribute object to use'},
    {type:'object',name:'processChange.sections',description:'An object containing the idArrays for each repeating section, indexed by full section name (e.g. `repeating_equipment`)'},
    {type:'object',name:'processChange.casc',description:'As the casc object above.'},

    {type:'function',name:'triggerFunctions(trigger,attributes,sections)',description:'Calls functions that are triggered whenever an attribute is changed or affected'},
    {type:'object',name:'triggerFunctions.trigger',description:'The trigger object as contained in the [cascades object](#cascades)'},
    {type:'object',name:'triggerFunctions.attributes',description:'The attributes object.'},
    {type:'object',name:'triggerFunctions.sections',description:'An object containing the idArrays for each repeating section, indexed by full section name (e.g. `repeating_equipment`)'},

    {type:'function',name:'initialFunction(trigger,attributes,sections)',description:'Calls functions that are only triggered when an attribute is the triggering event'},
    {type:'object',name:'initialFunction.trigger',description:'The trigger object as contained in the [cascades object](#cascades)'},
    {type:'object',name:'initialFunction.attributes',description:'The attributes object.'},
    {type:'object',name:'initialFunction.sections',description:'An object containing the idArrays for each repeating section, indexed by full section name (e.g. `repeating_equipment`)'},

    {type:'function',name:'getCascObj(event,casc)',description:'Gets the appropriate cascade object for a given attribute or action button'},
    {type:'object',name:'event',descrition:'[A Roll20 event object](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object).'},
    {type:'object',name:'getCascObj.casc',description:'As the casc object above.'},
  ]
};
const createAttrProxy = function(attrs){
  //creates a proxy for the attributes object so that values can be worked with more easily.
  const getCascObj = function(event,casc){
    let typePrefix = event.htmlAttributes ? 'act_' : 'attr_';
    let cascName = `${typePrefix}${event.sourceAttribute}`;
    let cascObj = casc[cascName];
    return cascObj;
  };
  
  const triggerFunctions = function(trigger,attributes,sections){
    if(trigger.triggeredFuncs && trigger.triggeredFuncs.length){
      debug(`triggering functions for ${trigger.name}`);
      trigger.triggeredFuncs && trigger.triggeredFuncs.forEach(func=>funcs[func] ? 
        funcs[func]({trigger,attributes,sections}) :
        debug(`!!!Warning!!! no function named ${func} found. Triggered function not called for ${trigger.name}`,true));
    }
  };
  
  const initialFunction = function(trigger,attributes,sections){
    if(trigger.initialFunc){
      debug(`initial functions for ${obj.name}`);
      funcs[trigger.initialFunc] ?
        funcs[trigger.initialFunc]({trigger:trigger,attributes,sections}) :
        debug(`!!!Warning!!! no function named ${trigger.initialFunc} found. Initial function not called for ${trigger.name}`,true);
    }
  };
  const processChange = function({event,trigger,attributes,sections,casc}){
    debug({trigger});
    if(event && !trigger){
      debug('initial change detected. No trigger found');
      return;
    }
    if(!attributes || !sections || !casc){
      debug(`!!! Insufficient arguments || attributes > ${!!attributes} | sections > ${!!sections} | casc > ${!!casc} !!!`);
      return;
    }
    //store the queue in attributes.
    if(event){
      debug('checking for initial functions');
      initialFunction(trigger,attributes,sections);//functions that should only be run if the attribute was the thing changed by the user
    }
    if(trigger){
      debug(`processing ${trigger.name}`);
      triggerFunctions(trigger,attributes,sections);
      if(!event && trigger.calculation){
        attributes[trigger.name] = funcs[trigger.calculation]({trigger,attributes,sections,casc});
      }
      if(Array.isArray(trigger.affects)){
        attributes.queue.push(...trigger.affects);
      }
    }
    attributes.set({attributes,sections,casc});
  };
  const attrTarget = {
    updates:{},
    attributes:{...attrs},
    repOrders:{},
    queue: [],
    casc:{},
    processChange,
    triggerFunctions,
    initialFunction,
    getCascObj
  };
  const attrHandler = {
    get:function(obj,prop){//gets the most value of the attribute.
      //If it is a repeating order, returns the array, otherwise returns the update value or the original value
      if(prop === 'set'){
        return function(){
          let {attributes,sections,casc,callback,vocal} = arguments[0] ? arguments[0] : {};
          if(attributes && attributes.queue.length && sections && casc){
            let triggerName = attributes.queue.shift();
            let trigger = getCascObj({sourceAttribute:triggerName},casc);
            attributes.processChange({trigger,attributes,sections,casc});
          }else{
            debug({updates:obj.updates});
            let trueCallback = Object.keys(obj.repOrders).length ?
              function(){
                Object.entries(obj.repOrders).forEach(([section,order])=>{
                  _setSectionOrder(section,order,)
                });
                callback && callback();
              }:
              callback;
            Object.keys(obj.updates).forEach((key)=>obj.attributes[key] = obj.updates[key]);
            const update = obj.updates;
            obj.updates = {};
            set(update,vocal,trueCallback);
          }
        }
      }else if(Object.keys(obj).some(key=>key===prop)){ 
        return Reflect.get(...arguments)
      }else{
        let retValue;
        switch(true){
          case obj.repOrders.hasOwnProperty(prop):
            retValue = obj.repOrders[prop];
            break;
          case obj.updates.hasOwnProperty(prop):
            retValue = obj.updates[prop];
            break;
          default:
            retValue = obj.attributes[prop];
            break;
        }
        let cascRef = `attr_${prop.replace(/(repeating_[^_]+_)[^_]+/,'$1\$x')}`;
        let numRetVal = +retValue;
        if(!Number.isNaN(numRetVal) && retValue !== ''){
          retValue = numRetVal;
        }else if(cascades[cascRef] && typeof cascades[cascRef].defaultValue === 'number'){
          retValue = cascades[cascRef].defaultValue;
        }
        return retValue;
      }
    },
    set:function(obj,prop,value){
      //Sets the value. Also verifies that the value is a valid attribute value
      //e.g. not undefined, null, or NaN
      if(value || value===0 || value===''){
        if(/reporder|^repeating_[^_]+$/.test(prop)){
          let section = prop.replace(/_reporder_/,'');
          obj.repOrders[section] = value;
        }else if(`${obj.attributes}` !== `${value}` || 
          (obj.updates[prop] && `${obj.updates}` !== `${value}`)
        ){
          obj.updates[prop] = value;
        }
      }else{
        debug(`!!!Warning: Attempted to set ${prop} to an invalid value:${value}; value not stored!!!`);
      }
      return true;
    },
    deleteProperty(obj,prop){
      //removes the property from the original attributes, updates, and the reporders
      Object.keys(obj).forEach((key)=>{
        delete obj[key][prop.toLowerCase()];
      });
    }
  };
  return new Proxy(attrTarget,attrHandler);
};

const funcs = {};

docs.js['k.registerFuncs'] = {
  type:'function',
  description:'Function that registers a function for being called via the funcs object. Returns true if the function was successfully registered, and false if it could not be registered for any reason.',
  arguments:[
    {type:'object',name:'funcObj',description:'Object with keys that are names to register functions under and values that are functions.'},
    {type:'object',name:'optionsObj',description:'Object that contains options to use for this registration.'},
    {type:'[\'strings\']',name:'optionsObj.type',description:'Array that contains the types of specialized functions that apply to the functions being registered. Valid types are `"opener"`, `"updater"`, and `"default"`. `"default"` is always used, and never needs to be passed.'}
  ],
  retValue:{
    type:'boolean',
    description:'True if the registration succeeded, false if it failed.'
  }
};
const registerFuncs = function(funcObj,optionsObj = {}){
  if(typeof funcObj !== 'object' || typeof optionsObj !== 'object'){
    debug(`!!!! K-scaffold error: Improper arguments to register functions !!!!`);
    return false;
  }
  const typeArr = optionsObj.type ? ['default',...optionsObj.type] : ['default'];
  const typeSwitch = {
    'opener':openHandlers,
    'updater':updateHandlers,
    'default':funcs
  };
  let setState;
  Object.entries(funcObj).map(([prop,value])=>{
    typeArr.forEach((type)=>{
      if(typeSwitch[type][prop]){
        debug(`!!! Duplicate function name for ${prop} as ${type}!!!`);
        setState = false;
      }else if(typeof value === 'function'){
        typeSwitch[type][prop] = value;
        setState = setState !== false ? true : false;
      }else{
        debug(`!!! K-scaffold error: Function registration requires a function. Invalid value to register as ${type} !!!`);
        setState = false;
      }
    });
  });
  return setState;
};
kFuncs.registerFuncs = registerFuncs;

docs.js['k.callFunc'] = {
  type:'function',
  description:'Function to call a function previously registered to the funcs object. May not be used that much. Either returns the function or null if no function exists.',
  arguments:[
    {type:'string',name:'funcName',description:'The name of the function to invoke.'},
    {type:'any',name:'args',description:'The arguments to call the function with.'}
  ],
  retValue:{
    type:'any',
  }
};
const callFunc = function(funcName,...args){
  if(funcs[funcName]){
    debug(`calling ${funcName}`);
    return funcs[funcName](...args);
  }else{
    debug(`Invalid function name: ${funcName}`);
    return null;
  }
};
kFuncs.callFunc = callFunc;