/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Sheet Variables
const sheetName = '';
const version = 0;
let debugMode = false;
//const actionAttributes = ['body','mind','spirit','initiative','repeating_skill_$x_roll','repeating_weapon_$x_roll','situational_awareness','remnant_initiative','assault_roll','strike_roll','motion_roll','repeating_remnant-weapon_$x_roll','repeating_drone_$x_assault','repeating_drone_$x_strike'];
const systemDefaults = {
};
const systems = [];
const repeatMonitor = [];
const listeners = {};
const dynamicQueries = {};
const baseGet = Object.entries(cascades).reduce((memo,[attrName,detailObj])=>{
  if(!/repeating/.test(attrName) && detailObj.type !== 'action'){
    memo.push(detailObj.name);
  }
  if(detailObj.listener){
    listeners[detailObj.listener] = detailObj.listenerFunc;
  }
  return memo;
},['sheet_state','section_state','character_name']);
const updateHandlers = {};