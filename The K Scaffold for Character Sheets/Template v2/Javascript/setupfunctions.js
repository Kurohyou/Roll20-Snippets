/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/*
  Sheet Styling
*/
const navigateSheet = function(event){
  debug('navigating sheet');
  const setObj = {};
  let [,,page] = parseClickTrigger(event.triggerName);
  page = page.replace(/nav-|-action/g,'');
  debug({page});
  navButtons.forEach((button)=>{
    let element = button.replace(/-action/,'');
    let action = element === page ? 'addClass' : 'removeClass';
    $20(`.${element}`)[action]('active');
  });
  setObj.sheet_state = page;
  debug({setObj});
  set(setObj);
};
funcs.navigateSheet = navigateSheet;

const setupSystem = function(trigger,attributes,sections){
};