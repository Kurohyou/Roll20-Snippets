/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Sheet Updaters and styling functions
const updateHandlers = {};
kFuncs.updateHandlers = updateHandlers;
const updateSheet = function(){
  log('updating sheet');
  getAllAttrs({props:['sheet_version','debug_mode','collapsed',...baseGet],callback:(attributes,sections,casc)=>{
    kFuncs.debugMode = !!attributes.debug_mode;
    if(!attributes.sheet_version){
      initialSetup(attributes,sections);
    }else{
      Object.entries(updateHandlers).forEach(([ver,handler])=>{
        if(attributes.version < +ver){
          handler({attributes,sections,casc});
        }
      });
    }
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

//These functions access the sheet and iterate through all changes necessary before calling setAttrs
const accessSheet = function(event){
  debug({funcs});
  debug({event});
  getAllAttrs({event,callback:(attributes,sections,casc)=>{
    let trigger = attributes.getCascObj(event,casc);
    attributes.processChange({event,trigger,attributes,sections,casc});
  }});
};
funcs.accessSheet = accessSheet;