/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/**
 * Function that extracts the information of which roll was clicked from the name of the button.
 * @param {string} string - The triggerName to be parsed
 * @returns {array} - Returns an array containing the repeating section name, the row id, and the field that is referenced.
 */
const extractRollInfo = function(string){
  //Get the information on which button was clicked.
  const [section,id,button] = k.parseTriggerName(string);
  //Convert the button name into the name of the relevant attribute (e.g. saving-throw => saving_throw). Also removes the `-action` suffix of the action button to get the raw field name.
  const field = button.replace(/\-?action/,'').replace(/\-/g,'_');
  return [section,id,field];
};

/**
 * Function to translate our advantage query
 * @returns {string}
 */
const translateAdvantageQuery = function(){
  //Iterate throught the advantage options and create the translated strings.
  const options = [['advantage','2d20kh1'],['normal','1d20'],['disadvantage','2d20kl1']]
  .map((arr)=>{
    const translated = k.capitalize(getTranslationByKey(arr[0]));
    return `${translated},${arr[1]}`;
  })
  .join('|');
  return `?{${k.capitalize(getTranslationByKey('roll with'))}|${options}}`;
};

/**
 * Our function that will actually initiate the roll. 
 * @param {object} attributes - Our object containing the attributes needed for the roll
 * @param {object} rollObj - The object containing the fields to send with the roll
 * @returns {void}
 */
const initiateRoll = async function(attributes,rollObj){
  if(rollObj.roll){
    rollObj.roll = rollObj.roll.replace(/@\{roll_state\}/,(match)=>{
      //If roll state is set to ask the user what to do, we need to assemble a translated version of the query.
      if(/\?\{/.test(attributes.roll_state)){
        return translateAdvantageQuery();
      }else{
        //Otherwise just use the roll_state
        return attributes.roll_state;
      }
    });
  }
  //Assemble our completed roll string.
  const message = Object.entries(rollObj)
    .reduce((text,[field,content]) => {
      return text += `{{${field}=${content}}}`;
    },`@{template_start}`);
  //Send the completed roll string to the chat parser.
  const roll = await startRoll(message);
  //An object to aggregate the changes that need to be made to what is displayed in the roll output.
  const computeObj = {};
  //If the roll contained a result, target, and roll field with an inline roll in them, then we want to compare the roll and target values to determine if the result was a success or failure.
  k.debug({roll});
  if(roll.results.result && roll.results.target && roll.results.roll){
    computeObj.result = roll.results.roll.result >= roll.results.target ? 1 : 0;
  }
  //Now we finish our roll, which tells Roll20 to actually display it in chat.
  finishRoll(roll.rollId,computeObj);
};

/**
 * Our generic rolling function. This will be used for our simple attribute and saving throw rolls that need very little logic.
 * @param {object} event - The Roll20 event object.
 * @returns {void}
 */
const rollGeneric = function(event){
  const[section,id,field] = extractRollInfo(event.triggerName);
  const attributeRef = attributeNames.indexOf(field) > -1 ?
    `${field}_mod` :
    undefined;
  k.getAttrs({
    props:rollGet,
    callback: (attributes)=>{
      //object that will aggregate all the roll template fields we will need to send to chat.
      const rollObj = {
        name:`^{${field.replace(/_/g,' ')}}`,
        roll:attributeRef ? 
          `[[@{roll_state} + 0@{${attributeRef}}]]` :
          `[[@{roll_state}]]`,
        target:`[[0@{saving_throw}]]`,
        result:`[[0[computed value]]]`
      };
      //Send the roll.
      initiateRoll(attributes,rollObj);
    }
  });
};
k.registerFuncs({rollGeneric});

/**
 * Our attack roll function. This won't need much logic, but has a slightly different button/attribute relationship that we need to account for.
 * @param {object} event - The Roll20 event object.
 * @returns {void}
 */
const rollAttack = function(event){
  const[section,id,field] = extractRollInfo(event.triggerName);
  const row = `${section}_${id}`;
  k.getAttrs({
    props:[...rollGet,`${row}_type`,`${row}_damage`],
    callback:(attributes)=>{
      const type = attributes[`${row}_type`];
      const rollObj = {
        name:`@{${row}_name}`,
        roll_name:'^{attack}',
        roll:`[[@{roll_state} + 0@{attack_modifier}[${getTranslationByKey('attack modifier')}] + 0@{${row}_attack_bonus}[${getTranslationByKey('bonus')}] + 0@{${type}_mod}[${getTranslationByKey(type)}]]]`,
        range:`@{${row}_range}`,
        traits:`@{${row}_traits}`,
        aspects:`@{${row}_aspects}`,
        description:`@{${row}_description}`
      }
      if(attributes[`${row}_damage`]){
        rollObj.damage = `[[@{${row}_damage}]]`;
      }
      initiateRoll(attributes,rollObj);
    }
  });
};
k.registerFuncs({rollAttack});

/**
 * Our function to cast spells. This will be our most complex roll function because it is going to have the ability to affect attributes on the sheet in reaction to the roll.
 * @param {object} event - The Roll20 event object.
 * @returns {void}
 */
const castSpell = async function(event){
  const[section,id,field] = extractRollInfo(event.triggerName);
  const row = `${section}_${id}`;

  //Assemble the attributes to get for the spell being cast.
  const spellGet = ['apprentice','journeyman','master']
    .reduce((arr,level)=>{
      arr.push(`${level}_per_day`);
      return arr;
    },[...rollGet,`${row}_level`]);
  
  k.getAttrs({
    props:spellGet,
    //Note that his callback is asynchronous because we are going to wait for the roll to resolve and then do some additional operations.
    callback:async (attributes)=>{
      const level = attributes[`${row}_level`];
      const rollObj = {
        name:`@{${row}_name}`,
        description:`@{${row}_description}`,
      }
      if(field !== 'describe'){
        const num = field.replace(/.+?(\d+)$/,'$1');
        rollObj.effect = `@{${row}_effect_${num}}`;
      }else{
        [1,2,3].forEach((num)=>{
          rollObj[`effect_${num}`] = `@{${row}_effect_${num}}`;
        });
      }
      await initiateRoll(attributes,rollObj);
      //If we are actually casting the spell, decrement the spells per day for that level of spell to a minimum of zero.
      if(field !== 'describe'){
        attributes[`${level}_per_day`] = Math.max(attributes[`${level}_per_day`] - 1,0);
        attributes.set();
      }
    }
  })
};
k.registerFuncs({castSpell});
