/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Sheet Updaters and styling functions
/**
 * An object to store your update functions in. Functions should be index by the version they are for (e.g. the update handler for version 1.01 would be indexed to '1.01'). These update functions will be iterated through based on the previous version of the sheet (as stored in the `sheet_version` attribute of the sheet) and the new version of the sheet (as stored in {@link k.version}).
 * @type {object}
 */
const updateHandlers = {};
const openHandlers = {};
const initialSetups = {};
const updateSheet = function(){
  log('updating sheet');
  getAllAttrs({props:['sheet_version','debug_mode','collapsed',...baseGet],callback:(attributes,sections,casc)=>{
    kFuncs.debugMode = !!attributes.debug_mode;
    if(!attributes.sheet_version){
      Object.entries(initialSetups).forEach(([funcName,handler])=>{
        debug(`running ${funcName}`);
        func({attributes,sections,casc});
      });
    }else{
      Object.entries(updateHandlers).forEach(([ver,handler])=>{
        if(attributes.version < +ver){
          handler({attributes,sections,casc});
        }
      });
    }
    Object.entries(openHandlers).forEach(([funcName,func])=>{
      debug(`running ${funcName}`);
      func({attributes,sections,casc});
    });
    attributes.sheet_version = kFuncs.version;
    log(`Sheet Update applied. Current Sheet Version ${kFuncs.version}`);
    //styleOnOpen(attributes,sections);
    //setActionCalls({attributes,sections});
    attributes.set();
    log('Sheet ready for use');
  }});
};

const initialSetup = function(attributes,sections){
  debug('Initial sheet setup');
};

/**
 * This is the default listener function for attributes that the K-Scaffold uses. It utilizes the `triggerFuncs`, `listenerFunc`, `calculation`, and `affects` properties of the K-scaffold trigger object (see the Pug section of the scaffold for more details).
 * @param {Roll20Event} event
 * @returns {void}
 */
const accessSheet = function(event){
  debug({funcs:Object.keys(funcs)});
  debug({event});
  getAllAttrs({event,callback:(attributes,sections,casc)=>{
    let trigger = attributes.getCascObj(event,casc);
    attributes.processChange({event,trigger,attributes,sections,casc});
  }});
};
funcs.accessSheet = accessSheet;