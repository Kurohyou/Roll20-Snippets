// This code adapted from Nic Bradley's R20 test framework from the WFRP4e official sheet.
import { vi } from 'vitest';
import { _ } from 'underscore';

const environment = {
  attributes:{"main_tabs_tab":"nav-tabs-main-tabs--tab1","basic_input":"test","text":"text","number":"1","unchecked":0,"checked":"1","radio":"1","basic_collapse":0,"range":"2","hidden":"hidden","textarea":"textarea","fill_left":"0","fill_left_with_display":"0","select":"option 1","image":"","span":"","drop_name":"","drop_data":"","prefix_drop_name":"","prefix_drop_data":"","roller_action":"","adaptive_input":"","adaptive_textarea":"","labelled_input":"","labelled_select":"option 1","action_text":"","button_text":"","roller_text":"","labelled_roller_action":"","template_start":"&{template:test} {{character_name=@{character_name}}} {{character_id=@{character_id}}}"},
  triggers: [],
  otherCharacters: {
    // Attribute information of other test characters indexed by character name
  },
  queryResponses:{
    // object defining which value to use for roll queries, indexed by prompt text
  }
};
global.environment = environment;
const on = vi.fn((trigger, func) => {
  environment.triggers.push({ trigger, func });
});
global.on = on;
const getAttrs = vi.fn((query, callback) => {
  let values = {};
  for (const attr of query) {
    if (attr in environment.attributes) values[attr] = environment.attributes[attr];
  }
  if (typeof callback === "function") callback(values);
});
global.getAttrs = getAttrs;
const setAttrs = vi.fn((submit, params, callback) => {
  if (!callback && typeof params === "function") callback = params;
  for (const attr in submit) {
    environment.attributes[attr] = submit[attr];
  }
  if (typeof callback === "function") callback();
});
global.setAttrs = setAttrs;
const getSectionIDs = vi.fn((section, callback) => {
  const ids = [];
  const sectionName = section.indexOf("repeating_") === 0 ? section : `repeating_${section}`;
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(sectionName) === 0) ids.push(attr.split("_")[2]);
  }
  const idMap = [...new Set(ids)];
  if (typeof callback === "function") callback(idMap);
});
global.getSectionIDs = getSectionIDs;
const getSectionIDsSync = vi.fn((section) => {
  const ids = [];
  const sectionName = section.indexOf("repeating_") === 0 ? section : `repeating_${section}`;
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(sectionName) === 0) ids.push(attr.split("_")[2]);
  }
  const idMap = [...new Set(ids)];
  return idMap;
});
global.getSectionIDsSync = getSectionIDsSync;
const removeRepeatingRow = vi.fn((id) => {
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(id) > -1) delete environment.attributes[attr];
  }
});
global.removeRepeatingRow = removeRepeatingRow;
const getCompendiumPage = vi.fn((request, callback) => {
  const pages = compendiumData;
  if (!pages)
    throw new Error(
      "Tried to use getCompendiumPage, but testing environment does not contain compendiumData."
    );
  if (typeof request === "string") {
    const [category, pageName] = request.split(":");
    const response = {
      Name: pageName,
      Category: category,
      data: {},
    };
    if (pages[request]) response.data = pages[request].data;
    if (typeof callback === "function") callback(response);
  } else if (Array.isArray(request)) {
    const pageArray = [];
    for (const page of request) {
      if (pages[request] && pages[request].Category === category) pageArray.push(pages[pageName]);
    }
    if (typeof callback === "function") callback(pageArray);
  }
});
global.getCompendiumPage = getCompendiumPage;
const generateUUID = vi.fn(() => {
  var a = 0,
    b = [];
  return (function () {
    var c = new Date().getTime() + 0,
      d = c === a;
    a = c;
    for (var e = Array(8), f = 7; 0 <= f; f--)
      (e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64)),
      (c = Math.floor(c / 64));
    c = e.join("");
    if (d) {
      for (f = 11; 0 <= f && 63 === b[f]; f--) b[f] = 0;
      b[f]++;
    } else for (f = 0; 12 > f; f++) b[f] = Math.floor(64 * Math.random());
    for (f = 0; 12 > f; f++)
      c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
    return c.replace(/_/g, "z");
  })();
});
global.generateUUID = generateUUID;
const generateRowID = vi.fn(() => {
  return generateUUID().replace(/_/g, "Z");
});
global.generateRowID = generateRowID;
const simulateEvent = vi.fn((event) => {
  environment.triggers.forEach((trigger) => {
    const splitTriggers = trigger.trigger.split(" ") || [trigger.trigger];
    splitTriggers.forEach((singleTrigger) => {
      if (event === singleTrigger) {
        trigger.func({
          sourceAttribute: "test",
        });
      }
    });
  });
});
global.simulateEvent = simulateEvent;
const getTranslationByKey = vi.fn((key) => key);
global.getTranslationByKey = getTranslationByKey;
// Roll Handlingglobal.getTranslationByKey = getTranslationByKey;

const extractRollTemplate = (rollString) => {
  const rollTemplate = rollString.match(/&\{template:(.*?)\}/)?.[1];
  environment.attributes.__rolltemplate = rollTemplate;
};

const cleanRollElements = (value) => {
  const cleanText = value
    .replace(/\{\{|\}}(?=$|\s|\{)/g, "")
    .replace(/=/,'===SPLITHERE===');
  const splitText = cleanText.split("===SPLITHERE===");
  return splitText;
};

const extractRollElements = (rollString) => {
  const rollElements = rollString.match(/\{\{(.*?)\}{2,}(?=$|\s|\{)/g);
  if (!rollElements || rollElements.length < 1) return {}
  return  Object.fromEntries(rollElements.map(cleanRollElements));
};

const getExpression = (element) => element.replace(/(\[\[|\]\])/gi, "");

const getDiceOrHalf = (size) => {
  const diceStack = environment.diceStack;
  if (!diceStack?.[size] || diceStack[size].length < 0) return size / 2;
  return environment.diceStack[size].pop();
};

const getDiceRolls = (expression) => {
  const rolls = expression.match(/([0-9]+)?d([0-9]+)/gi);
  if (!rolls) return [];
  const allRolls = [];
  rolls.forEach((roll) => {
    const [number, size] = roll.split(/d/i);
    for (let i = 1; i <= number; i++) {
      const dice = getDiceOrHalf(size);
      allRolls.push(dice);
    }
  });
  return allRolls;
};

const calculateResult = (startExpression, dice) => {
  let expression = startExpression.replace(/\[.+?\]/g,'')

  const rolls = expression.match(/([0-9]+)?d([0-9]+)/gi);
  if (!rolls) return eval(expression);
  rolls.forEach((roll, index) => {
    const [number, size] = roll.split(/d/i);
    let total = 0;
    for (let i = 1; i <= number; i++) {
      total += +dice.shift();
    }
    expression = expression.replace(/([0-9]+d[0-9]+([+\-*/][0-9]+)?)(.*?)$/gi, "$1");
    const regex = new RegExp(roll, "gi");
    expression = expression.replace(regex, total);
  });

  return eval(expression);
};

const replaceAttributes = (element) => {
  const test = /@\{(.*?)\}/i;
  while (test.test(element)) {
    element = element.replace(/@\{(.*?)\}/gi, (sub, ...args) => {
      const attributeName = args[0];
      const attributeValue = environment.attributes[attributeName];
      const attributeExists = typeof attributeValue !== "undefined";
      const possibleAttributes = Object.keys(environment.attributes);
      if (attributeExists) return attributeValue;
      else
        throw new Error(
          `Roll called ${sub} but no corresponding attribute "${attributeName}" was found. Attributes are: ${possibleAttributes.join(
            ", "
          )}`
        );
    });
  }
  return element;
};

const replaceQueries = (element) => {
  return element.replace(/\?\{(.+?)[|}]([^}]+?\})?/g,(match,p,a) => {
    a = a?.split(/\s*\|\s*/) || [];
    return environment.queryResponses[p] || a[0] || '';
  });
};

const calculateRollResult = (rollElements) => {
  const results = {};
  for (const key in rollElements) {
    const element = rollElements[key];
    if (element.indexOf("[[") === -1) continue;
    const attributeFilled = replaceAttributes(element);
    const queryAnswered = replaceQueries(attributeFilled);
    const expression = getExpression(queryAnswered);
    const dice = getDiceRolls(expression);
    const result = calculateResult(expression, [...dice]);
    results[key] = {
      result,
      dice,
      expression,
    };
  }
  return results;
};

const startRoll = vi.fn(async (rollString) => {
  if (!rollString) throw new Error("startRoll expected a Roll String but none was provided.");
  const rollResult = { results: {} };
  extractRollTemplate(rollString);
  const rollElements = extractRollElements(rollString);
  rollResult.results = calculateRollResult(rollElements);
  rollResult.rollId = generateUUID();
  return rollResult;
});
global.startRoll = startRoll;
const finishRoll = vi.fn(() => {});
global.finishRoll = finishRoll;

  const k = (function(){
  const kFuncs = {};
  
  const cascades = {"attr_character_name":{"name":"character_name","type":"text","defaultValue":"","affects":[],"triggeredFuncs":["setActionCalls"],"listenerFunc":"accessSheet","listener":"change:character_name"},"attr_main_tabs_tab":{"name":"main_tabs_tab","type":"hidden","defaultValue":"nav-tabs-main-tabs--tab1","triggeredFuncs":[],"affects":[]},"act_nav-tabs-main-tabs--basic-attributes":{"triggeredFuncs":["kSwitchTab"],"name":"nav-tabs-main-tabs--basic-attributes","listener":"clicked:nav-tabs-main-tabs--basic-attributes","listenerFunc":"accessSheet","type":"action"},"act_nav-tabs-main-tabs--repeating-attributes":{"triggeredFuncs":["kSwitchTab"],"name":"nav-tabs-main-tabs--repeating-attributes","listener":"clicked:nav-tabs-main-tabs--repeating-attributes","listenerFunc":"accessSheet","type":"action"},"act_nav-tabs-main-tabs--empty-tab":{"triggeredFuncs":["kSwitchTab"],"name":"nav-tabs-main-tabs--empty-tab","listener":"clicked:nav-tabs-main-tabs--empty-tab","listenerFunc":"accessSheet","type":"action"},"attr_basic_input":{"name":"basic_input","type":"text","defaultValue":"test","triggeredFuncs":[],"affects":[]},"attr_text":{"name":"text","type":"text","defaultValue":"text","triggeredFuncs":[],"affects":[]},"attr_number":{"name":"number","type":"number","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_unchecked":{"name":"unchecked","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_checked":{"name":"checked","type":"checkbox","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_radio":{"name":"radio","type":"radio","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_basic_collapse":{"name":"basic_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_range":{"name":"range","type":"range","defaultValue":2,"triggeredFuncs":[],"affects":[]},"attr_hidden":{"name":"hidden","type":"hidden","defaultValue":"hidden","triggeredFuncs":[],"affects":[]},"attr_textarea":{"name":"textarea","defaultValue":"textarea","triggeredFuncs":[],"affects":[]},"attr_fill_left":{"name":"fill_left","type":"hidden","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_not_clearable_fill_left":{"name":"not_clearable_fill_left","type":"radio","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_fill_left_with_display":{"name":"fill_left_with_display","type":"hidden","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_select":{"affects":["dummy_attribute"],"name":"select","listener":"change:select","listenerFunc":"accessSheet","type":"select","defaultValue":"","triggeredFuncs":[]},"attr_span":{"name":"span","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_drop_name":{"triggeredFuncs":["handleCompendiumDrop"],"name":"drop_name","listener":"change:drop_name","listenerFunc":"accessSheet","type":"hidden","defaultValue":"","affects":[]},"attr_drop_data":{"name":"drop_data","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_prefix_drop_name":{"triggeredFuncs":["handleCompendiumDrop"],"name":"prefix_drop_name","listener":"change:prefix_drop_name","listenerFunc":"accessSheet","type":"hidden","defaultValue":"","affects":[]},"attr_prefix_drop_data":{"name":"prefix_drop_data","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_action-button":{"triggeredFuncs":["actionTrigger"],"name":"action-button","listener":"clicked:action-button","listenerFunc":"accessSheet","type":"action"},"act_roller-action":{"triggeredFuncs":["rollFunc"],"name":"roller-action","listener":"clicked:roller-action","listenerFunc":"accessSheet","type":"action"},"attr_roller_action":{"name":"roller_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_adaptive_input":{"name":"adaptive_input","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_adaptive_textarea":{"name":"adaptive_textarea","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_labelled_input":{"name":"labelled_input","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_labelled_select":{"affects":["dummy_attribute"],"name":"labelled_select","listener":"change:labelled_select","listenerFunc":"accessSheet","type":"select","defaultValue":"","triggeredFuncs":[]},"act_labelled_action":{"triggeredFuncs":["actionTrigger"],"name":"labelled_action","listener":"clicked:labelled_action","listenerFunc":"accessSheet","type":"action"},"attr_action_text":{"name":"action_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_button_text":{"name":"button_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_roller_text":{"name":"roller_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_labelled-roller-action":{"triggeredFuncs":["rollFunc"],"name":"labelled-roller-action","listener":"clicked:labelled-roller-action","listenerFunc":"accessSheet","type":"action"},"attr_labelled_roller_action":{"name":"labelled_roller_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"fieldset_repeating_basic-fieldset":{"triggeredFuncs":"funcOnRemove","name":"repeating_basic-fieldset","listener":"remove:repeating_basic-fieldset","listenerFunc":"accessSheet","type":"fieldset"},"attr_repeating_basic-fieldset_$X_basic_input":{"name":"repeating_basic-fieldset_$X_basic_input","type":"text","defaultValue":"test","triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_text":{"name":"repeating_basic-fieldset_$X_text","type":"text","defaultValue":"text","triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_number":{"name":"repeating_basic-fieldset_$X_number","type":"number","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_unchecked":{"name":"repeating_basic-fieldset_$X_unchecked","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_checked":{"name":"repeating_basic-fieldset_$X_checked","type":"checkbox","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_radio":{"name":"repeating_basic-fieldset_$X_radio","type":"radio","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_basic_collapse":{"name":"repeating_basic-fieldset_$X_basic_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_range":{"name":"repeating_basic-fieldset_$X_range","type":"range","defaultValue":2,"triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_hidden":{"name":"repeating_basic-fieldset_$X_hidden","type":"hidden","defaultValue":"hidden","triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_textarea":{"name":"repeating_basic-fieldset_$X_textarea","defaultValue":"textarea","triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_fill_left":{"name":"repeating_basic-fieldset_$X_fill_left","type":"hidden","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_not_clearable_fill_left":{"name":"repeating_basic-fieldset_$X_not_clearable_fill_left","type":"radio","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_fill_left_with_display":{"name":"repeating_basic-fieldset_$X_fill_left_with_display","type":"hidden","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_select":{"affects":["dummy_attribute"],"name":"repeating_basic-fieldset_$X_select","listener":"change:repeating_basic-fieldset:select","listenerFunc":"accessSheet","type":"select","defaultValue":"","triggeredFuncs":[]},"attr_repeating_basic-fieldset_$X_span":{"name":"repeating_basic-fieldset_$X_span","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_drop_name":{"triggeredFuncs":["handleCompendiumDrop"],"name":"repeating_basic-fieldset_$X_drop_name","listener":"change:repeating_basic-fieldset:drop_name","listenerFunc":"accessSheet","type":"hidden","defaultValue":"","affects":[]},"attr_repeating_basic-fieldset_$X_drop_data":{"name":"repeating_basic-fieldset_$X_drop_data","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_prefix_drop_name":{"triggeredFuncs":["handleCompendiumDrop"],"name":"repeating_basic-fieldset_$X_prefix_drop_name","listener":"change:repeating_basic-fieldset:prefix_drop_name","listenerFunc":"accessSheet","type":"hidden","defaultValue":"","affects":[]},"attr_repeating_basic-fieldset_$X_prefix_drop_data":{"name":"repeating_basic-fieldset_$X_prefix_drop_data","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_repeating_basic-fieldset_$X_action-button":{"triggeredFuncs":["actionTrigger"],"name":"repeating_basic-fieldset_$X_action-button","listener":"clicked:repeating_basic-fieldset:action-button","listenerFunc":"accessSheet","type":"action"},"act_repeating_basic-fieldset_$X_roller-action":{"triggeredFuncs":["rollFunc"],"name":"repeating_basic-fieldset_$X_roller-action","listener":"clicked:repeating_basic-fieldset:roller-action","listenerFunc":"accessSheet","type":"action"},"attr_repeating_basic-fieldset_$X_roller_action":{"name":"repeating_basic-fieldset_$X_roller_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_adaptive_input":{"name":"repeating_basic-fieldset_$X_adaptive_input","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_adaptive_textarea":{"name":"repeating_basic-fieldset_$X_adaptive_textarea","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_labelled_input":{"name":"repeating_basic-fieldset_$X_labelled_input","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_labelled_select":{"affects":["dummy_attribute"],"name":"repeating_basic-fieldset_$X_labelled_select","listener":"change:repeating_basic-fieldset:labelled_select","listenerFunc":"accessSheet","type":"select","defaultValue":"","triggeredFuncs":[]},"act_repeating_basic-fieldset_$X_labelled_action":{"triggeredFuncs":["actionTrigger"],"name":"repeating_basic-fieldset_$X_labelled_action","listener":"clicked:repeating_basic-fieldset:labelled_action","listenerFunc":"accessSheet","type":"action"},"attr_repeating_basic-fieldset_$X_action_text":{"name":"repeating_basic-fieldset_$X_action_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_button_text":{"name":"repeating_basic-fieldset_$X_button_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_basic-fieldset_$X_roller_text":{"name":"repeating_basic-fieldset_$X_roller_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_repeating_basic-fieldset_$X_labelled-roller-action":{"triggeredFuncs":["rollFunc"],"name":"repeating_basic-fieldset_$X_labelled-roller-action","listener":"clicked:repeating_basic-fieldset:labelled-roller-action","listenerFunc":"accessSheet","type":"action"},"attr_repeating_basic-fieldset_$X_labelled_roller_action":{"name":"repeating_basic-fieldset_$X_labelled_roller_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_basic_input":{"name":"repeating_class-fieldset_$X_basic_input","type":"text","defaultValue":"test","triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_text":{"name":"repeating_class-fieldset_$X_text","type":"text","defaultValue":"text","triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_number":{"name":"repeating_class-fieldset_$X_number","type":"number","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_unchecked":{"name":"repeating_class-fieldset_$X_unchecked","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_checked":{"name":"repeating_class-fieldset_$X_checked","type":"checkbox","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_radio":{"name":"repeating_class-fieldset_$X_radio","type":"radio","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_basic_collapse":{"name":"repeating_class-fieldset_$X_basic_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_range":{"name":"repeating_class-fieldset_$X_range","type":"range","defaultValue":2,"triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_hidden":{"name":"repeating_class-fieldset_$X_hidden","type":"hidden","defaultValue":"hidden","triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_textarea":{"name":"repeating_class-fieldset_$X_textarea","defaultValue":"textarea","triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_fill_left":{"name":"repeating_class-fieldset_$X_fill_left","type":"hidden","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_not_clearable_fill_left":{"name":"repeating_class-fieldset_$X_not_clearable_fill_left","type":"radio","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_fill_left_with_display":{"name":"repeating_class-fieldset_$X_fill_left_with_display","type":"hidden","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_select":{"affects":["dummy_attribute"],"name":"repeating_class-fieldset_$X_select","listener":"change:repeating_class-fieldset:select","listenerFunc":"accessSheet","type":"select","defaultValue":"","triggeredFuncs":[]},"attr_repeating_class-fieldset_$X_span":{"name":"repeating_class-fieldset_$X_span","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_drop_name":{"triggeredFuncs":["handleCompendiumDrop"],"name":"repeating_class-fieldset_$X_drop_name","listener":"change:repeating_class-fieldset:drop_name","listenerFunc":"accessSheet","type":"hidden","defaultValue":"","affects":[]},"attr_repeating_class-fieldset_$X_drop_data":{"name":"repeating_class-fieldset_$X_drop_data","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_prefix_drop_name":{"triggeredFuncs":["handleCompendiumDrop"],"name":"repeating_class-fieldset_$X_prefix_drop_name","listener":"change:repeating_class-fieldset:prefix_drop_name","listenerFunc":"accessSheet","type":"hidden","defaultValue":"","affects":[]},"attr_repeating_class-fieldset_$X_prefix_drop_data":{"name":"repeating_class-fieldset_$X_prefix_drop_data","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_repeating_class-fieldset_$X_action-button":{"triggeredFuncs":["actionTrigger"],"name":"repeating_class-fieldset_$X_action-button","listener":"clicked:repeating_class-fieldset:action-button","listenerFunc":"accessSheet","type":"action"},"act_repeating_class-fieldset_$X_roller-action":{"triggeredFuncs":["rollFunc"],"name":"repeating_class-fieldset_$X_roller-action","listener":"clicked:repeating_class-fieldset:roller-action","listenerFunc":"accessSheet","type":"action"},"attr_repeating_class-fieldset_$X_roller_action":{"name":"repeating_class-fieldset_$X_roller_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_adaptive_input":{"name":"repeating_class-fieldset_$X_adaptive_input","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_adaptive_textarea":{"name":"repeating_class-fieldset_$X_adaptive_textarea","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_labelled_input":{"name":"repeating_class-fieldset_$X_labelled_input","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_labelled_select":{"affects":["dummy_attribute"],"name":"repeating_class-fieldset_$X_labelled_select","listener":"change:repeating_class-fieldset:labelled_select","listenerFunc":"accessSheet","type":"select","defaultValue":"","triggeredFuncs":[]},"act_repeating_class-fieldset_$X_labelled_action":{"triggeredFuncs":["actionTrigger"],"name":"repeating_class-fieldset_$X_labelled_action","listener":"clicked:repeating_class-fieldset:labelled_action","listenerFunc":"accessSheet","type":"action"},"attr_repeating_class-fieldset_$X_action_text":{"name":"repeating_class-fieldset_$X_action_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_button_text":{"name":"repeating_class-fieldset_$X_button_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_class-fieldset_$X_roller_text":{"name":"repeating_class-fieldset_$X_roller_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_repeating_class-fieldset_$X_labelled-roller-action":{"triggeredFuncs":["rollFunc"],"name":"repeating_class-fieldset_$X_labelled-roller-action","listener":"clicked:repeating_class-fieldset:labelled-roller-action","listenerFunc":"accessSheet","type":"action"},"attr_repeating_class-fieldset_$X_labelled_roller_action":{"name":"repeating_class-fieldset_$X_labelled_roller_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_add-custom-fieldset":{"listenerFunc":"addItem","name":"add-custom-fieldset","listener":"clicked:add-custom-fieldset","type":"action"},"act_edit-custom-fieldset":{"listenerFunc":"editSection","name":"edit-custom-fieldset","listener":"clicked:edit-custom-fieldset","type":"action"},"fieldset_repeating_custom-fieldset":{"addFuncs":["funcOnAdd"],"name":"repeating_custom-fieldset","type":"fieldset"},"attr_repeating_custom-fieldset_$X_basic_input":{"name":"repeating_custom-fieldset_$X_basic_input","type":"text","defaultValue":"test","triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_text":{"name":"repeating_custom-fieldset_$X_text","type":"text","defaultValue":"text","triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_number":{"name":"repeating_custom-fieldset_$X_number","type":"number","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_unchecked":{"name":"repeating_custom-fieldset_$X_unchecked","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_checked":{"name":"repeating_custom-fieldset_$X_checked","type":"checkbox","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_radio":{"name":"repeating_custom-fieldset_$X_radio","type":"radio","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_basic_collapse":{"name":"repeating_custom-fieldset_$X_basic_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_range":{"name":"repeating_custom-fieldset_$X_range","type":"range","defaultValue":2,"triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_hidden":{"name":"repeating_custom-fieldset_$X_hidden","type":"hidden","defaultValue":"hidden","triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_textarea":{"name":"repeating_custom-fieldset_$X_textarea","defaultValue":"textarea","triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_fill_left":{"name":"repeating_custom-fieldset_$X_fill_left","type":"hidden","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_not_clearable_fill_left":{"name":"repeating_custom-fieldset_$X_not_clearable_fill_left","type":"radio","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_fill_left_with_display":{"name":"repeating_custom-fieldset_$X_fill_left_with_display","type":"hidden","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_select":{"affects":["dummy_attribute"],"name":"repeating_custom-fieldset_$X_select","listener":"change:repeating_custom-fieldset:select","listenerFunc":"accessSheet","type":"select","defaultValue":"","triggeredFuncs":[]},"attr_repeating_custom-fieldset_$X_span":{"name":"repeating_custom-fieldset_$X_span","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_drop_name":{"triggeredFuncs":["handleCompendiumDrop"],"name":"repeating_custom-fieldset_$X_drop_name","listener":"change:repeating_custom-fieldset:drop_name","listenerFunc":"accessSheet","type":"hidden","defaultValue":"","affects":[]},"attr_repeating_custom-fieldset_$X_drop_data":{"name":"repeating_custom-fieldset_$X_drop_data","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_prefix_drop_name":{"triggeredFuncs":["handleCompendiumDrop"],"name":"repeating_custom-fieldset_$X_prefix_drop_name","listener":"change:repeating_custom-fieldset:prefix_drop_name","listenerFunc":"accessSheet","type":"hidden","defaultValue":"","affects":[]},"attr_repeating_custom-fieldset_$X_prefix_drop_data":{"name":"repeating_custom-fieldset_$X_prefix_drop_data","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_repeating_custom-fieldset_$X_action-button":{"triggeredFuncs":["actionTrigger"],"name":"repeating_custom-fieldset_$X_action-button","listener":"clicked:repeating_custom-fieldset:action-button","listenerFunc":"accessSheet","type":"action"},"act_repeating_custom-fieldset_$X_roller-action":{"triggeredFuncs":["rollFunc"],"name":"repeating_custom-fieldset_$X_roller-action","listener":"clicked:repeating_custom-fieldset:roller-action","listenerFunc":"accessSheet","type":"action"},"attr_repeating_custom-fieldset_$X_roller_action":{"name":"repeating_custom-fieldset_$X_roller_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_adaptive_input":{"name":"repeating_custom-fieldset_$X_adaptive_input","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_adaptive_textarea":{"name":"repeating_custom-fieldset_$X_adaptive_textarea","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_labelled_input":{"name":"repeating_custom-fieldset_$X_labelled_input","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_labelled_select":{"affects":["dummy_attribute"],"name":"repeating_custom-fieldset_$X_labelled_select","listener":"change:repeating_custom-fieldset:labelled_select","listenerFunc":"accessSheet","type":"select","defaultValue":"","triggeredFuncs":[]},"act_repeating_custom-fieldset_$X_labelled_action":{"triggeredFuncs":["actionTrigger"],"name":"repeating_custom-fieldset_$X_labelled_action","listener":"clicked:repeating_custom-fieldset:labelled_action","listenerFunc":"accessSheet","type":"action"},"attr_repeating_custom-fieldset_$X_action_text":{"name":"repeating_custom-fieldset_$X_action_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_button_text":{"name":"repeating_custom-fieldset_$X_button_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_custom-fieldset_$X_roller_text":{"name":"repeating_custom-fieldset_$X_roller_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_repeating_custom-fieldset_$X_labelled-roller-action":{"triggeredFuncs":["rollFunc"],"name":"repeating_custom-fieldset_$X_labelled-roller-action","listener":"clicked:repeating_custom-fieldset:labelled-roller-action","listenerFunc":"accessSheet","type":"action"},"attr_repeating_custom-fieldset_$X_labelled_roller_action":{"name":"repeating_custom-fieldset_$X_labelled_roller_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"fieldset_repeating_inline-fieldset":{"name":"repeating_inline-fieldset","type":"fieldset"},"attr_repeating_inline-fieldset_$X_display_state":{"name":"repeating_inline-fieldset_$X_display_state","type":"radio","defaultValue":"short-display","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_collapse":{"triggeredFuncs":["collapseSection"],"name":"repeating_inline-fieldset_$X_collapse","listener":"change:repeating_inline-fieldset:collapse","listenerFunc":"accessSheet","type":"checkbox","defaultValue":0,"affects":[]},"attr_repeating_inline-fieldset_$X_name":{"name":"repeating_inline-fieldset_$X_name","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_basic_input":{"name":"repeating_inline-fieldset_$X_basic_input","type":"text","defaultValue":"test","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_text":{"name":"repeating_inline-fieldset_$X_text","type":"text","defaultValue":"text","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_number":{"name":"repeating_inline-fieldset_$X_number","type":"number","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_unchecked":{"name":"repeating_inline-fieldset_$X_unchecked","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_checked":{"name":"repeating_inline-fieldset_$X_checked","type":"checkbox","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_radio":{"name":"repeating_inline-fieldset_$X_radio","type":"radio","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_basic_collapse":{"name":"repeating_inline-fieldset_$X_basic_collapse","type":"checkbox","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_range":{"name":"repeating_inline-fieldset_$X_range","type":"range","defaultValue":2,"triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_hidden":{"name":"repeating_inline-fieldset_$X_hidden","type":"hidden","defaultValue":"hidden","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_textarea":{"name":"repeating_inline-fieldset_$X_textarea","defaultValue":"textarea","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_fill_left":{"name":"repeating_inline-fieldset_$X_fill_left","type":"hidden","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_not_clearable_fill_left":{"name":"repeating_inline-fieldset_$X_not_clearable_fill_left","type":"radio","defaultValue":1,"triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_fill_left_with_display":{"name":"repeating_inline-fieldset_$X_fill_left_with_display","type":"hidden","defaultValue":0,"triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_select":{"affects":["dummy_attribute"],"name":"repeating_inline-fieldset_$X_select","listener":"change:repeating_inline-fieldset:select","listenerFunc":"accessSheet","type":"select","defaultValue":"","triggeredFuncs":[]},"attr_repeating_inline-fieldset_$X_span":{"name":"repeating_inline-fieldset_$X_span","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_drop_name":{"triggeredFuncs":["handleCompendiumDrop"],"name":"repeating_inline-fieldset_$X_drop_name","listener":"change:repeating_inline-fieldset:drop_name","listenerFunc":"accessSheet","type":"hidden","defaultValue":"","affects":[]},"attr_repeating_inline-fieldset_$X_drop_data":{"name":"repeating_inline-fieldset_$X_drop_data","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_prefix_drop_name":{"triggeredFuncs":["handleCompendiumDrop"],"name":"repeating_inline-fieldset_$X_prefix_drop_name","listener":"change:repeating_inline-fieldset:prefix_drop_name","listenerFunc":"accessSheet","type":"hidden","defaultValue":"","affects":[]},"attr_repeating_inline-fieldset_$X_prefix_drop_data":{"name":"repeating_inline-fieldset_$X_prefix_drop_data","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_repeating_inline-fieldset_$X_action-button":{"triggeredFuncs":["actionTrigger"],"name":"repeating_inline-fieldset_$X_action-button","listener":"clicked:repeating_inline-fieldset:action-button","listenerFunc":"accessSheet","type":"action"},"act_repeating_inline-fieldset_$X_roller-action":{"triggeredFuncs":["rollFunc"],"name":"repeating_inline-fieldset_$X_roller-action","listener":"clicked:repeating_inline-fieldset:roller-action","listenerFunc":"accessSheet","type":"action"},"attr_repeating_inline-fieldset_$X_roller_action":{"name":"repeating_inline-fieldset_$X_roller_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_adaptive_input":{"name":"repeating_inline-fieldset_$X_adaptive_input","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_adaptive_textarea":{"name":"repeating_inline-fieldset_$X_adaptive_textarea","type":"span","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_labelled_input":{"name":"repeating_inline-fieldset_$X_labelled_input","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_labelled_select":{"affects":["dummy_attribute"],"name":"repeating_inline-fieldset_$X_labelled_select","listener":"change:repeating_inline-fieldset:labelled_select","listenerFunc":"accessSheet","type":"select","defaultValue":"","triggeredFuncs":[]},"act_repeating_inline-fieldset_$X_labelled_action":{"triggeredFuncs":["actionTrigger"],"name":"repeating_inline-fieldset_$X_labelled_action","listener":"clicked:repeating_inline-fieldset:labelled_action","listenerFunc":"accessSheet","type":"action"},"attr_repeating_inline-fieldset_$X_action_text":{"name":"repeating_inline-fieldset_$X_action_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_button_text":{"name":"repeating_inline-fieldset_$X_button_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"attr_repeating_inline-fieldset_$X_roller_text":{"name":"repeating_inline-fieldset_$X_roller_text","type":"text","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_repeating_inline-fieldset_$X_labelled-roller-action":{"triggeredFuncs":["rollFunc"],"name":"repeating_inline-fieldset_$X_labelled-roller-action","listener":"clicked:repeating_inline-fieldset:labelled-roller-action","listenerFunc":"accessSheet","type":"action"},"attr_repeating_inline-fieldset_$X_labelled_roller_action":{"name":"repeating_inline-fieldset_$X_labelled_roller_action","type":"hidden","defaultValue":"","triggeredFuncs":[],"affects":[]},"act_add-inline-fieldset":{"listenerFunc":"sectionInteract","name":"add-inline-fieldset","listener":"clicked:add-inline-fieldset","type":"action"},"act_edit-inline-fieldset":{"listenerFunc":"sectionInteract","name":"edit-inline-fieldset","listener":"clicked:edit-inline-fieldset","type":"action"},"attr_template_start":{"name":"template_start","type":"text","defaultValue":"&{template:test} {{character_name=@{character_name}}} {{character_id=@{character_id}}}","triggeredFuncs":[],"affects":[]}};
  
  kFuncs.cascades = cascades;
  
  const repeatingSectionDetails = [{"section":"repeating_basic-fieldset","fields":["basic_input","text","number","unchecked","checked","radio","basic_collapse","range","hidden","textarea","fill_left","not_clearable_fill_left","fill_left_with_display","select","span","drop_name","drop_data","prefix_drop_name","prefix_drop_data","roller_action","adaptive_input","adaptive_textarea","labelled_input","labelled_select","action_text","button_text","roller_text","labelled_roller_action"]},{"section":"repeating_class-fieldset","fields":["basic_input","text","number","unchecked","checked","radio","basic_collapse","range","hidden","textarea","fill_left","not_clearable_fill_left","fill_left_with_display","select","span","drop_name","drop_data","prefix_drop_name","prefix_drop_data","roller_action","adaptive_input","adaptive_textarea","labelled_input","labelled_select","action_text","button_text","roller_text","labelled_roller_action"]},{"section":"repeating_custom-fieldset","fields":["basic_input","text","number","unchecked","checked","radio","basic_collapse","range","hidden","textarea","fill_left","not_clearable_fill_left","fill_left_with_display","select","span","drop_name","drop_data","prefix_drop_name","prefix_drop_data","roller_action","adaptive_input","adaptive_textarea","labelled_input","labelled_select","action_text","button_text","roller_text","labelled_roller_action"]},{"section":"repeating_inline-fieldset","fields":["display_state","collapse","name","basic_input","text","number","unchecked","checked","radio","basic_collapse","range","hidden","textarea","fill_left","not_clearable_fill_left","fill_left_with_display","select","span","drop_name","drop_data","prefix_drop_name","prefix_drop_data","roller_action","adaptive_input","adaptive_textarea","labelled_input","labelled_select","action_text","button_text","roller_text","labelled_roller_action"]}];
  
  kFuncs.repeatingSectionDetails = repeatingSectionDetails;
  /**
 * This stores the name of your sheet for use in the logging functions {@link log} and {@link debug}. Accessible by `k.sheetName`
 * @var
 * @type {string}
 */
let sheetName = 'kScaffold Powered Sheet';
kFuncs.sheetName = sheetName;
/**
	* This stores the version of your sheet for use in the logging functions{@link log} and {@link debug}. It is also stored in the sheet_version attribute on your character sheet. Accessible via `k.version`
	* @var
	* @type {number}
	*/
let version = 0;
kFuncs.version = version;
/**
	* A boolean flag that tells the script whether to enable or disable {@link debug} calls. If the version of the sheet is `0`, or an attribute named `debug_mode` is found on opening this is set to true for your entire session. Otherwise, it remains false.
	* @var
	* @type {boolean}
	*/
let debugMode = false;
kFuncs.debugMode = debugMode;
const funcs = {};
kFuncs.funcs = funcs;
const updateHandlers = {};
const openHandlers = {};
const initialSetups = {};
const allHandlers = {};
const addFuncs = {};

const kscaffoldJSVersion = '0.0.4';
const kscaffoldPUGVersion = '0.0.4';
  /*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/**
 * Replaces problem characters to use a string as a regex
 * @param {string} text - The text to replace characters in
 * @returns {string}
 * @example
 * const textForRegex = k.sanitizeForRegex('.some thing[with characters]');
 * console.log(textForRegex);// => "\.some thing\[with characters\]"
 */
const sanitizeForRegex = function(text){
  return text.replace(/\.|\||\(|\)|\[|\]|\-|\+|\?|\/|\{|\}|\^|\$|\*/g,'\\$&');
};
kFuncs.sanitizeForRegex = sanitizeForRegex;

/**
 * Converts a value to a number, it\'s default value, or `0` if no default value passed.
 * @param {string|number} val - Value to convert to a number
 * @param {number} def - The default value, uses 0 if not passed
 * @returns {number|undefined}
 * @example
 * const num = k.value('100');
 * console.log(num);// => 100
 */
const value = function(val,def){
  return (+val||def||0);
};
kFuncs.value = value;

/**
 * Extracts the section (e.g. `repeating_equipment`), rowID (e.g `-;lkj098J:LKj`), and field name (e.g. `bulk`) from a repeating attribute name.
 * @param {string} string - The string to parse
 * @returns {array} - Array of matches. Index 0: the section name, e.g. repeating_equipment | Index 1:the row ID | index 2: The name of the attribute
 * @returns {string[]}
 * @example
 * //Extract info from a full repeating name
 * const [section,rowID,attrName] = k.parseRepeatName('repeating_equipment_-8908asdflkjZlkj23_name');
 * console.log(section);// => "repeating_equipment"
 * console.log(rowID);// => "-8908asdflkjZlkj23"
 * console.log(attrName);// => "name"
 * 
 * //Extract info from just a row name
 * const [section,rowID,attrName] = k.parseRepeatName('repeating_equipment_-8908asdflkjZlkj23');
 * console.log(section);// => "repeating_equipment"
 * console.log(rowID);// => "-8908asdflkjZlkj23"
 * console.log(attrName);// => undefined
 */
const parseRepeatName = function(string){
  let match = string.match(/(repeating_[^_]+)_([^_]+)(?:_(.+))?/);
  match.shift();
  return match;
};
kFuncs.parseRepeatName = parseRepeatName;

/**
 * Parses out the components of a trigger name similar to [parseRepeatName](#parserepeatname). Aliases: parseClickTrigger.
 * 
 * Aliases: `k.parseClickTrigger`
 * @param {string} string The triggerName property of the
 * @returns {array} - For a repeating button named `repeating_equipment_-LKJhpoi98;lj_roll`, the array will be `['repeating_equipment','-LKJhpoi98;lj','roll']`. For a non repeating button named `roll`, the array will be `[undefined,undefined,'roll']`
 * @returns {string[]}
 * @example
 * //Parse a non repeating trigger
 * const [section,rowID,attrName] = k.parseTriggerName('clicked:some-button');
 * console.log(section);// => undefined
 * console.log(rowID);// => undefined
 * console.log(attrName);// => "some-button"
 * 
 * //Parse a repeating trigger
 * const [section,rowID,attrName] = k.parseTriggerName('clicked:repeating_attack_-234lkjpd8fu8usadf_some-button');
 * console.log(section);// => "repeating_attack"
 * console.log(rowID);// => "-234lkjpd8fu8usadf"
 * console.log(attrName);// => "some-button"
 * 
 * //Parse a repeating name
 * const [section,rowID,attrName] = k.parseTriggerName('repeating_attack_-234lkjpd8fu8usadf_some-button');
 * console.log(section);// => "repeating_attack"
 * console.log(rowID);// => "-234lkjpd8fu8usadf"
 * console.log(attrName);// => "some-button"
 */
const parseTriggerName = function(string){
  let match = string.replace(/^clicked:/,'').match(/(?:(repeating_[^_]+)_([^_]+)_)?(.+)/);
  match.shift();
  return match;
};
kFuncs.parseTriggerName = parseTriggerName;
const parseClickTrigger = parseTriggerName;
kFuncs.parseClickTrigger = parseClickTrigger;

/**
 * Parses out the attribute name from the htmlattribute name.
 * @param {string} string - The triggerName property of the [event](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object).
 * @returns {string}
 * @example
 * //Parse a name
 * const attrName = k.parseHtmlName('attr_attribute_1');
 * console.log(attrName);// => "attribute_1"
 */
const parseHTMLName = function(string){
  let match = string.match(/(?:attr|act|roll)_(.+)/);
  match.shift();
  return match[0];
};
kFuncs.parseHTMLName = parseHTMLName;

/**
 * Capitalize each word in a string
 * @param {string} string - The string to capitalize
 * @returns {string}
 * @example
 * const capitalized = k.capitalize('a word');
 * console.log(capitalized);// => "A Word"
 */
const capitalize = function(string){
  return string.replace(/(?:^|\s+|\/)[a-z]/ig,(letter)=>letter.toUpperCase());
};
kFuncs.capitalize = capitalize;

/**
 * Extracts a roll query result for use in later functions. Must be awaited as per [startRoll documentation](https://wiki.roll20.net/Sheet_Worker_Scripts#Roll_Parsing.28NEW.29). Stolen from [Oosh\'s Adventures with Startroll thread](https://app.roll20.net/forum/post/10346883/adventures-with-startroll).
 * @param {string} query - The query should be just the text as the `?{` and `}` at the start/end of the query are added by the function.
 * @returns {Promise} - Resolves to the selected value from the roll query
 * @example
 * const rollFunction = async function(){
 *  //Get the result of a choose from list query
 *  const queryResult = await extractQueryResult('Prompt Text Here|Option 1|Option 2');
 *  console.log(queryResult);//=> "Option 1" or "Option 2" depending on what the user selects
 * 
 *  //Get free from input from the user
 *  const freeResult = await extractQueryResult('Prompt Text Here');
 *  consoel.log(freeResult);// => Whatever the user entered
 * }
 */
const extractQueryResult = async function(query){
	debug('entering extractQueryResult');
	let queryRoll = await startRoll(`!{{query=[[0[response=?{${query}}]]]}}`);
	finishRoll(queryRoll.rollId);
	return queryRoll.results.query.expression.replace(/^.+?response=|\]$/g,'');
};
kFuncs.extractQueryResult = extractQueryResult;

/**
 * Simulates a query for ensuring that async/await works correctly in the sheetworker environment when doing conditional startRolls. E.g. if you have an if/else and only one of the conditions results in `startRoll` being called (and thus an `await`), the sheetworker environment would normally crash. Awaiting this in the condition that does not actually need to call `startRoll` will keep the environment in sync.
 * @param {string|number} [value] - The value to return. Optional.
 * @returns {Promise} - Resolves to the value passed to the function
 * @example
 * const rollFunction = async function(){
 *  //Get the result of a choose from list query
 *  const queryResult = await pseudoQuery('a value');
 *  console.log(queryResult);//=> "a value"
 * }
 */
const pseudoQuery = async function(value){
	debug('entering pseudoQuery');
	let queryRoll = await startRoll(`!{{query=[[0[response=${value}]]]}}`);
	finishRoll(queryRoll.rollId);
	return queryRoll.results.query.expression.replace(/^.+?response=|\]$/g,'');
};
kFuncs.pseudoQuery = pseudoQuery;

/**
 * An alias for console.log.
 * @param {any} msg - The message can be a straight string, an object, or an array. If it is an object or array, the object will be broken down so that each key is used as a label to output followed by the value of that key. If the value of the key is an object or array, it will be output via `console.table`.
 */
const log = function(msg){
  if(typeof msg === 'string'){
    console.log(`%c${kFuncs.sheetName} log| ${msg}`,"background-color:#159ccf");
  }else if(typeof msg === 'object'){
    Object.keys(msg).forEach((m)=>{
      if(typeof msg[m] === 'string'){
        console.log(`%c${kFuncs.sheetName} log| ${m}: ${msg[m]}`,"background-color:#159ccf");
      }else{
        console.log(`%c${kFuncs.sheetName} log| ${typeof msg[m]} ${m}`,"background-color:#159ccf");
        console.table(msg[m]);
      }
    });
  }
};
kFuncs.log = log;

/**
 * Alias for console.log that only triggers when debug mode is enabled or when the sheet\'s version is `0`. Useful for entering test logs that will not pollute the console on the live sheet.
 * @param {any} msg - 'See {@link k.log}
 * @param {boolean} force - Pass as a truthy value to force the debug output to be output to the console regardless of debug mode.
 * @returns {void}
 */
const debug = function(msg,force){
  if(!kFuncs.debugMode && !force && kFuncs.version > 0) return;
  if(typeof msg === 'string'){
    console.log(`%c${kFuncs.sheetName} DEBUG| ${msg}`,"background-color:tan;color:red;");
  }else if(typeof msg === 'object'){
    Object.keys(msg).forEach((m)=>{
      if(typeof msg[m] === 'string'){
        console.log(`%c${kFuncs.sheetName} DEBUG| ${m}: ${msg[m]}`,"background-color:tan;color:red;");
      }else{
        console.log(`%c${kFuncs.sheetName} DEBUG| ${typeof msg[m]} ${m}`,"background-color:tan;color:red;font-weight:bold;");
        console.table(msg[m]);
      }
    });
  }
};
kFuncs.debug = debug;

/**
 * Orders the section id arrays for all sections in the `sections` object to match the repOrder attribute.
 * @param {attributesProxy} attributes - The attributes object that must have a value for the reporder for each section.
 * @param {object[]} sections - Object containing the IDs for the repeating sections, indexed by repeating section name.
 */
const orderSections = function(attributes,sections){
  Object.keys(sections).forEach((section)=>{
    attributes.attributes[`_reporder_${section}`] = commaArray(attributes[`_reporder_${section}`]);
    orderSection(attributes.attributes[`_reporder_${section}`],sections[section]);
  });
};
kFuncs.orderSections = orderSections;

/**
 * Orders a single ID array.
 * @param {string[]} repOrder - Array of IDs in the order they are in on the sheet.
 * @param {string[]} IDs - Array of IDs to be ordered.
 */
const orderSection = function(repOrder,IDs=[]){
  IDs.sort((a,b)=>{
    return repOrder.indexOf(a.toLowerCase()) - repOrder.indexOf(b.toLowerCase());
  });
};
kFuncs.orderSection = orderSection;

/**
 * Splits a comma delimited string into an array
 * @param {string} string - The string to split.
 * @returns {array} - The string segments of the comma delimited list.
 */
const commaArray = function(string=''){
  return string.toLowerCase().split(/\s*,\s*/);
};
kFuncs.commaArray = commaArray;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//# Attribute Obj Proxy handler
const createAttrProxy = function(attrs){
  //creates a proxy for the attributes object so that values can be worked with more easily.
  const getCascObj = function(event,casc){
    const eventName = event.triggerName || event.sourceAttribute;
    let typePrefix = eventName.startsWith('clicked:') ?
      'act_' :
      event.removedInfo ?
      'fieldset_' :
      'attr_';
    let cascName = `${typePrefix}${eventName.replace(/(?:removed|clicked):/,'')}`;
    let cascObj = casc[cascName];
    if(typePrefix === 'attr_'){
      cascObj.previousValue = event.previousValue;
    }
    return cascObj;
  };
  
  const triggerFunctions = function(obj,attributes,sections){
    if(obj.triggeredFuncs && obj.triggeredFuncs.length){
      debug(`triggering functions for ${obj.name}`);
      obj.triggeredFuncs && obj.triggeredFuncs.forEach(func=>funcs[func] ? 
        funcs[func]({trigger:obj,attributes,sections}) :
        debug(`!!!Warning!!! no function named ${func} found. Triggered function not called for ${obj.name}`,true));
    }
  };
  
  const initialFunction = function(obj,attributes,sections){
    if(obj.initialFunc){
      debug(`initial functions for ${obj.name}`);
      funcs[obj.initialFunc] ?
        funcs[obj.initialFunc]({trigger:obj,attributes,sections}) :
        debug(`!!!Warning!!! no function named ${obj.initialFunc} found. Initial function not called for ${obj.name}`,true);
    }
  };
  const alwaysFunctions = function(trigger,attributes,sections,casc){
    Object.values(allHandlers).forEach((handler)=>{
      handler({trigger,attributes,sections,casc});
    });
  };
  const processChange = function({event,trigger,attributes,sections,casc}){
    if(event && !trigger){
      debug(`${event.sourceAttribute} change detected. No trigger found`);
      return;
    }
    if(!attributes || !sections || !casc){
      debug(`!!! Insufficient arguments || attributes > ${!!attributes} | sections > ${!!sections} | casc > ${!!casc} !!!`);
      return;
    }
    debug({trigger});
    if(event){
      debug('checking for initial & always functions');
      alwaysFunctions(trigger,attributes,sections,casc);//Functions that should be run for all events.
      initialFunction(trigger,attributes,sections,casc);//functions that should only be run if the attribute was the thing changed by the user
    }
    if(trigger){
      debug(`processing ${trigger.name}`);
      triggerFunctions(trigger,attributes,sections,casc);
      if(!event && trigger.calculation && funcs[trigger.calculation]){
        attributes[trigger.name] = funcs[trigger.calculation]({trigger,attributes,sections,casc});
      }else if(trigger.calculation && !funcs[trigger.calculation]){
        debug(`K-Scaffold Error: No function named ${trigger.calculation} found`);
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
    alwaysFunctions,
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
        let cascRef = `attr_${prop.replace(/(repeating_[^_]+_)[^_]+/,'$1\$X')}`;
        let numRetVal = +retValue;
        if(!Number.isNaN(numRetVal) && retValue !== ''){
          retValue = numRetVal;
        }else if(cascades[cascRef] && (typeof cascades[cascRef].defaultValue === 'number' || cascades[cascRef].type === 'number')){
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


/**
 * Function that registers a function for being called via the funcs object. Returns true if the function was successfully registered, and false if it could not be registered for any reason.
 * @param {object} funcObj - Object with keys that are names to register functions under and values that are functions.
 * @param {object} optionsObj - Object that contains options to use for this registration.
 * @param {string[]} optionsObj.type - Array that contains the types of specialized functions that apply to the functions being registered. Valid types are `"opener"`, `"updater"`, and `"default"`. `"default"` is always used, and never needs to be passed.
 * @returns {boolean} - True if the registration succeeded, false if it failed.
 * @example
 * //Basic Registration
 * const myFunc = function({trigger,attributes,sections,casc}){};
 * k.registerFuncs({myFunc});
 * 
 * //Register a function to run on sheet open
 * const openFunc = function({trigger,attributes,sections,casc}){};
 * k.registerFuncs({openFunc},{type:['opener']})
 * 
 * //Register a function to run on all events
 * const allFunc = function({trigger,attributes,sections,casc}){};
 * k.registerFuncs({allFunc},{type:['all']})
 */
const registerFuncs = function(funcObj,optionsObj = {}){
  if(typeof funcObj !== 'object' || typeof optionsObj !== 'object'){
    debug(`!!!! K-scaffold error: Improper arguments to register functions !!!!`);
    return false;
  }
  const typeArr = optionsObj.type ? ['default',...optionsObj.type] : ['default'];
  const typeSwitch = {
    'opener':openHandlers,
    'updater':updateHandlers,
    'new':initialSetups,
    'all':allHandlers,
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

const setActionCalls = function({attributes,sections}){
  actionAttributes.forEach((base)=>{
    let [section,,field] = k.parseTriggerName(base);
    let fieldAction = field.replace(/_/g,'-');
    if(section){
      sections[section].forEach((id)=>{
        attributes[`${section}_${id}_${field}`] = `%{${attributes.character_name}|${section}_${id}_${fieldAction}}`;
      });
    }else{
      attributes[`${field}`] = `%{${attributes.character_name}|${fieldAction}}`;
    }
  });
};
funcs.setActionCalls = setActionCalls;

/**
 * Function to call a function previously registered to the funcs object. May not be used that much. Either returns the function or null if no function exists.
 * @param {string} funcName - The name of the function to invoke.
 * @param {...any} args - The arguments to call the function with.
 * @returns {any}
 * @example
 * //Call myFunc with two arguments
 * k.callFunc('myFunc','an argument','another argument');
 */
const callFunc = function(funcName,...args){
  if(funcs[funcName]){
    debug(`calling ${funcName}`);
    return funcs[funcName](...args);
  }else{
    debug(`Invalid function name: ${funcName}`);
    return null;
  }
};
kFuncs.callFunc = callFunc;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Sheet Updaters and styling functions
const updateSheet = function(){
  log('updating sheet');
  getAllAttrs({props:['debug_mode',...baseGet],callback:(attributes,sections,casc)=>{
    kFuncs.debugMode = kFuncs.debugMode || !!attributes.debug_mode;
    debug({sheet_version:attributes.sheet_version});
    if(!attributes.sheet_version){
      Object.entries(initialSetups).forEach(([funcName,handler])=>{
        if(typeof funcs[funcName] === 'function'){
          debug(`running ${funcName}`);
          funcs[funcName]({attributes,sections,casc});
        }else{
          debug(`!!!Warning!!! no function named ${funcName} found. Initial sheet setup not performed.`);
        }
      });
    }else{
      Object.entries(updateHandlers).forEach(([ver,handler])=>{
        if(attributes.sheet_version < +ver){
          handler({attributes,sections,casc});
        }
      });
    }
    Object.entries(openHandlers).forEach(([funcName,func])=>{
      if(typeof funcs[funcName] === 'function'){
        debug(`running ${funcName}`);
        funcs[funcName]({attributes,sections,casc});
      }else{
        debug(`!!!Warning!!! no function named ${funcName} found. Sheet open handling not performed.`);
      }
    });
    setActionCalls({attributes,sections});
    attributes.sheet_version = kFuncs.version;
    log(`Sheet Update applied. Current Sheet Version ${kFuncs.version}`);
    attributes.set();
    log('Sheet ready for use');
  }});
};

const initialSetup = function(attributes,sections){
  debug('Initial sheet setup');
};

/**
 * This is the default listener function for attributes that the K-Scaffold uses. It utilizes the `triggerFuncs`, `listenerFunc`, `calculation`, and `affects` properties of the K-scaffold trigger object (see the Pug section of the scaffold for more details).
 * @param {Roll20Event} event - The Roll20 event object
 * @returns {void}
 * @example
 * //Call from an attribute change
 * on('change:an_attribute',k.accessSheet);
 */
const accessSheet = function(event){
  debug({funcs:Object.keys(funcs)});
  debug({event});
  getAllAttrs({callback:(attributes,sections,casc)=>{
    let trigger = attributes.getCascObj(event,casc);
    attributes.processChange({event,trigger,attributes,sections,casc});
  }});
};
funcs.accessSheet = accessSheet;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/*
Cascade Expansion functions
*/
//Expands the repeating section templates in cascades to reflect the rows actually available
const expandCascade = function(cascade,sections,attributes){
  return _.keys(cascade).reduce((memo,key)=>{//iterate through cascades and replace references to repeating attributes with correct row ids.
    if(/^(?:act|attr)_repeating_/.test(key)){//If the attribute is a repeating attribute, do special logic
      expandRepeating(memo,key,cascade,sections,attributes);
    }else if(key){//for non repeating attributes do this logic
      expandNormal(memo,key,cascade,sections);
    }
    return memo;
  },{});
};

const expandRepeating = function(memo,key,cascade,sections,attributes){
  key.replace(/((?:attr|act)_)(repeating_[^_]+)_[^_]+?_(.+)/,(match,type,section,field)=>{
    (sections[section]||[]).forEach((id)=>{
      memo[`${type}${section}_${id}_${field}`]=_.clone(cascade[key]);//clone the details so that each row's attributes have correct ids
      memo[`${type}${section}_${id}_${field}`].name = `${section}_${id}_${field}`;
      if(key.startsWith('attr_')){
        memo[`${type}${section}_${id}_${field}`].affects = memo[`${type}${section}_${id}_${field}`].affects.reduce((m,affected)=>{
          if(section === affected){//otherwise if the affected attribute is in the same section, simply set the affected attribute to have the same row id.
            m.push(applyID(affected,id));
          }else if(/repeating/.test(affected)){//If the affected attribute isn't in the same repeating section but is still a repeating attribute, add all the rows of that section
            addAllRows(affected,m,sections);
          }else{//otherwise the affected attribute is a non repeating attribute. Simply add it to the computed affected array
            m.push(affected);
          }
          return m;
        },[]);
      }
    });
  });
};

const applyID = function(affected,id){
  return affected.replace(/(repeating_[^_]+_)[^_]+(.+)/,`$1${id}$2`);
};

const expandNormal = function(memo,key,cascade,sections){
  memo[key] = _.clone(cascade[key]);
  if(key.startsWith('attr_')){
    memo[key].affects = memo[key].affects || [];
    memo[key].affects = memo[key].affects.reduce((m,a)=>{
      if(/^repeating/.test(a)){
        addAllRows(a,m,sections);
      }else{
        m.push(a);
      }
      return m;
    },[]);
  }
};

const addAllRows = function(affected,memo,sections){
  affected.replace(/(repeating_[^_]+?)_[^_]+?_(.+)/,(match,section,field)=>{
    sections[section].forEach(id=>memo.push(`${section}_${id}_${field}`));
  });
};/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/**
 * Alias for [setSectionOrder()](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) that allows you to use the section name in either `repeating_section` or `section` formats. Note that the Roll20 sheetworker [setSectionOrder](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) currently causes some display issues on sheets.
 * @name setSectionOrder
 * @param {string} section - The name of the section, with or without `repeating_`
 * @param {string[]} order - Array of ids describing the desired order of the section.
 * @returns {void}
 * @example
 * //Set the order of a repeating_weapon section
 * k.setSectionOrder('repeating_equipment',['id1','id2','id3']);
 * //Can also specify the section name without the repeating_ prefix
 * k.setSectionOrder('equipment',['id1','id2','id3']);
 */
const _setSectionOrder = function(section,order){
  let trueSection = section.replace(/repeating_/,'');
  setSectionOrder(trueSection,order);
};
kFuncs.setSectionOrder = _setSectionOrder;

/**
 * Alias for [removeRepeatingRow](https://wiki.roll20.net/Sheet_Worker_Scripts#removeRepeatingRow.28_RowID_.29) that also removes the row from the current object of attribute values and array of section IDs to ensure that erroneous updates are not issued.
 * @name removeRepeatingRow
 * @param {string} row - The row id to be removed
 * @param {attributesProxy} attributes - The attribute values currently in memory
 * @param {object} sections - Object that contains arrays of all the IDs in sections on the sheet indexed by repeating name.
 * @returns {void}
 * @example
 * //Remove a repeating Row
 * k.getAllAttrs({
 *  callback:(attributes,sections)=>{
 *    const rowID = sections.repeating_equipment[0];
 *    k.removeRepeatingRow(`repeating_equipment_${rowID}`,attributes,sections);
 *    console.log(sections.repeating_equipment); // => rowID no longer exists in the array.
 *    console.log(attributes[`repeating_equipment_${rowID}_name`]); // => undefined
 *  }
 * })
 */
const _removeRepeatingRow = function(row,attributes,sections){
  debug(`removing ${row}`);
  Object.keys(attributes.attributes).forEach((key)=>{
    if(key.startsWith(row)){
      delete attributes[key];
    }
  });
  let [,section,rowID] = row.match(/(repeating_[^_]+)_(.+)/,'');
  sections[section] = sections[section].filter((id)=>id!==rowID);
  removeRepeatingRow(row);
};
kFuncs.removeRepeatingRow = _removeRepeatingRow;

/**
 * Alias for [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) that converts the default object of attribute values into an {@link attributesProxy} and passes that back to the callback function.
 * @name getAttrs
 * @param {string[]} [props=baseGet] - Array of attribute names to get the value of. Defaults to {@link baseGet} if not passed.
 * @param {function(attributesProxy)} callback - The function to call after the attribute values have been gotten. An {@link attributesProxy} is passed to the callback.
 * @example
 * //Gets the attributes named in props.
 * k.getAttrs({
 *  props:['attribute_1','attribute_2'],
 *  callback:(attributes)=>{
 *    //Work with the attributes as you would in a normal getAttrs, or use the superpowers of the K-scaffold attributes object like so:
 *    attributes.attribute_1 = 'new value';
 *    attributes.set();
 *  }
 * })
 */
const _getAttrs = function({props=baseGet,callback}){
  getAttrs(props,(values)=>{
    const attributes = createAttrProxy(values);
    callback(attributes);
  });
};
kFuncs.getAttrs = _getAttrs;

/**
 * Alias for [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) and [getSectionIDs](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that combines the actions of both sheetworker functions and converts the default object of attribute values into an {@link attributesProxy}. Also gets the details on how to handle all attributes from the master {@link cascades} object and.
 * @param {Object} args
 * @param {string[]} [args.props=baseGet] - Array of attribute names to get the value of. Defaults to {@link baseGet} if not passed.
 * @param {repeatingSectionDetails} sectionDetails - Array of details about a section to get the IDs for and attributes that need to be gotten. 
 * @param {function(attributesProxy,sectionObj,expandedCascade):void} args.callback - The function to call after the attribute values have been gotten. An {@link attributesProxy} is passed to the callback along with a {@link sectionObj} and {@link expandedCascade}.
 * @example
 * //Get every K-scaffold linked attribute on the sheet
 * k.getAllAttrs({
 *  callback:(attributes,sections,casc)=>{
 *    //Work with the attributes as you please.
 *    attributes.some_attribute = 'a value';
 *    attributes.set();//Apply our change
 *  }
 * })
 */
const getAllAttrs = function({props=baseGet,sectionDetails=repeatingSectionDetails,callback}){
  getSections(sectionDetails,(repeats,sections)=>{
    getAttrs([...props,...repeats],(values)=>{
      const attributes = createAttrProxy(values);
      orderSections(attributes,sections);
      const casc = expandCascade(cascades,sections,attributes);
      callback(attributes,sections,casc);
    })
  });
};
kFuncs.getAllAttrs = getAllAttrs;

/**
 * Alias for [getSectionIDs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that allows you to iterate through several functions at once. Also assembles an array of repeating attributes to get.
 * @param {object[]} sectionDetails - Array of details about a section to get the IDs for and attributes that need to be gotten.
 * @param {string} sectionDetails.section - The full name of the repeating section including the `repeating_` prefix.
 * @param {string[]} sectionDetails.fields - Array of field names that need to be gotten from the repeating section
 * @param {function(string[],sectionObj)} callback - The function to call once all IDs have been gotten and the array of repating attributes to get has been assembled. The callback is passed the array of repating attributes to get and a {@link sectionObj}.
 * @example
 * // Get some section details
 * const sectionDetails = {
 *  {section:'repeating_equipment',fields:['name','weight','cost']},
 *  {section:'repeating_weapon',fields:['name','attack','damage']}
 * };
 * k.getSections(sectionDetails,(attributeNames,sections)=>{
 *  console.log(attributeNames);// => Array containing all row specific attribute names
 *  console.log(sections);// => Object with arrays containing the row ids. Indexed by section name (e.g. repeating_eqiupment)
 * })
 */
const getSections = function(sectionDetails,callback){
  let queueClone = _.clone(sectionDetails);
  const worker = (queue,repeatAttrs=[],sections={})=>{
    let detail = queue.shift();
    getSectionIDs(detail.section,(IDs)=>{
      sections[detail.section] = IDs;
      IDs.forEach((id)=>{
        detail.fields.forEach((f)=>{
          repeatAttrs.push(`${detail.section}_${id}_${f}`);
        });
      });
      repeatAttrs.push(`_reporder_${detail.section}`);
      if(queue.length){
        worker(queue,repeatAttrs,sections);
      }else{
        callback(repeatAttrs,sections);
      }
    });
  };
  if(!queueClone[0]){
    callback([],{});
  }else{
    worker(queueClone);
  }
};
kFuncs.getSections = getSections;

// Sets the attributes while always calling with {silent:true}
// Can be awaited to get the values returned from _setAttrs
/**
 * Alias for [setAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#setAttrs.28values.2Coptions.2Ccallback.29) that sets silently by default.
 * @param {object} obj - The object containting attributes to set
 * @param {boolean} [vocal=false] - Whether to set silently (default value) or not.
 * @param {function()} [callback] - The callback function to invoke after the setting has been completed. No arguments are passed to the callback function.
 * @example
 * //Set some attributes silently
 * k.setAttrs({attribute_1:'new value'})
 * //Set some attributes and triggers listeners
 * k.setAttrs({attribute_1:'new value',true})
 * //Set some attributes and call a callback function
 * k.setAttrs({attribute_1:'new value'},null,()=>{
 *  //Do something after the attribute is set
 * })
 */
const set = function(obj,vocal=false,callback){
  setAttrs(obj,{silent:!vocal},callback);
};
kFuncs.setAttrs = set;

const generateCustomID = function(string){
  if(!string.startsWith('-')){
    string = `-${string}`;
  }
  rowID = generateRowID();
  let re = new RegExp(`^.{${string.length}}`);
  return `${string}${rowID.replace(re,'')}`;
};


/**
 * Alias for generateRowID that adds the new id to the {@link sectionObj}. Also allows for creation of custom IDs that conform to the section ID requirements.
 * @name generateRowID
 * @param {sectionObj} sections
 * @param {string} [customText] - Custom text to start the ID with. This text should not be longer than the standard repeating section ID format.
 * @returns {string} - The created ID
 * @example
 * k.getAllAttrs({
 *  callback:(attributes,sections,casc)=>{
 *    //Create a new row ID
 *    const rowID = k.generateRowID('repeating_equipment',sections);
 *    console.log(rowID);// => -p8rg908ug0suzz
 *    //Create a custom row ID
 *    const customID = k.generateRowID('repeating_equipment',sections,'custom');
 *    console.log(customID);// => -custom98uadj89kj
 *  }
 * });
 */
const _generateRowID = function(section,sections,customText){
  let rowID = customText ?
    generateCustomID(customText) :
    generateRowID();
  section = section.match(/^repeating_[^_]+$/) ?
    section :
    `repeating_${section}`;
  sections[section] = sections[section] || [];
  sections[section].push(rowID);
  return `${section}_${rowID}`;
};
kFuncs.generateRowID = _generateRowID;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
const listeners = {};
const baseGet = Object.entries(cascades).reduce((memo,[attrName,detailObj])=>{
  if(!/repeating/.test(attrName) && detailObj.type !== 'action'){
    memo.push(detailObj.name);
  }
  if(detailObj.listener){
    listeners[detailObj.listener] = detailObj.listenerFunc;
  }
  return memo;
},[]);
kFuncs.baseGet = baseGet;
const registerEventHandlers = function(){
  on('sheet:opened',updateSheet);
  debug({funcKeys:Object.keys(funcs),funcs});
  //Roll20 change and click listeners
  Object.entries(listeners).forEach(([event,funcName])=>{
    if(funcs[funcName]){
      on(event,funcs[funcName]);
    }else{
      debug(`!!!Warning!!! no function named ${funcName} found. No listener created for ${event}`,true);
    }
  });
  log(`kScaffold Loaded`);
};
setTimeout(registerEventHandlers,0);//Delay the execution of event registration to ensure all event properties are present.

const addItem = function(event){
  let [,,section] = parseClickTrigger(event.triggerName);
  section = section.replace(/add-/,'');
  getAllAttrs({
    callback:(attributes,sections,casc) => {
      let row = _generateRowID(section,sections);
      debug({row});
      attributes[`${row}_name`] = '';
      setActionCalls({attributes,sections});
      const trigger = cascades[`fieldset_repeating_${section}`];
      if(trigger && trigger.addFuncs){
        trigger.addFuncs.forEach((funcName) => {
          if(funcs[funcName]){
            funcs[funcName]({attributes,sections,casc,trigger});
          }
        });
      }
      attributes.set({attributes,sections,casc});
    }
  });
};
funcs.addItem = addItem;

const editSection = function(event){
  let [,,section] = parseClickTrigger(event.triggerName);
  section = section.replace(/edit-/,'');
  let target = `fieldset.repeating_${section} + .repcontainer`;
  $20(target).toggleClass('ui-sortable');
  $20(target).toggleClass('editmode');
};
registerFuncs({editSection});/**
 * The default tab navigation function of the K-scaffold. Courtesy of Riernar. It will add `k-active-tab` to the active tab-container and `k-active-button` to the active button. You can either write your own CSS to control display of these, or use the default CSS included in `scaffold/_k.scss`. Note that `k-active-button` has no default CSS as it is assumed that you will want to style the active button to match your system.
 * @param {Object} trigger - The trigger object
 */
const kSwitchTab = function ({ trigger, attributes }) {
  const [container, tab] = (
    trigger.name.match(/nav-tabs-(.+)--(.+)/) ||
    []
  ).slice(1);
  $20(`[data-container-tab="${container}"]`).removeClass('k-active-tab');
  $20(`[data-container-tab="${container}"][data-tab="${tab}"]`).addClass('k-active-tab');
  $20(`[data-container-button="${container}"]`).removeClass('k-active-button');
  $20(`[data-container-button="${container}"][data-button="${tab}"]`).addClass('k-active-button');
  const tabInputName = `${container.replace(/\-/g,'_')}_tab`;
  if(persistentTabs.indexOf(tabInputName) > -1){
    attributes[tabInputName] = trigger.name;
  }
}

registerFuncs({ kSwitchTab });

/**
 * Sets persistent tabs to their last active state
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const kTabOnOpen = function({trigger,attributes,sections,casc}){
  if(typeof persistentTabs === 'undefined') return;
  persistentTabs.forEach((tabInput) => {
    const pseudoTrigger = {name:attributes[tabInput]};
    kSwitchTab({trigger:pseudoTrigger, attributes});
  });
};
registerFuncs({ kTabOnOpen },{type:['opener']});
  return kFuncs;
  }());
  const actionAttributes = ["roller_action","labelled_roller_action","repeating_basic-fieldset_$X_roller_action","repeating_basic-fieldset_$X_labelled_roller_action","repeating_class-fieldset_$X_roller_action","repeating_class-fieldset_$X_labelled_roller_action","repeating_custom-fieldset_$X_roller_action","repeating_custom-fieldset_$X_labelled_roller_action","repeating_inline-fieldset_$X_roller_action","repeating_inline-fieldset_$X_labelled_roller_action"];const persistentTabs = ["main_tabs_tab"];const inlineFieldsets = ["inline fieldset"];

console.debug = vi.fn(a => null);
console.log = vi.fn(a => null);
console.table = vi.fn(a => null);
module.exports = {k,...global};