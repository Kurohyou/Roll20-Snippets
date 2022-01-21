/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
const registerEventHandlers = function(){
  on('sheet:opened',updateSheet);
  debug({funcs:Object.keys(funcs)});
  //Roll20 change and click listeners
  Object.entries(listeners).forEach(([event,funcName])=>{
    if(funcs[funcName]){
      on(event,funcs[funcName]);
    }else{
      debug(`!!!Warning!!! no function named ${funcName} found. No listener created for ${event}`,true);
    }
  });
};
registerEventHandlers();
log(`Sheet Loaded`);