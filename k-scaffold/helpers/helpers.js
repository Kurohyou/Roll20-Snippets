
const varObjects = {
    repeatingSectionDetails: [],
    actionAttributes: [],
    cascades: {
        attr_character_name: {
            name: 'character_name',
            type: 'text',
            defaultValue: '',
            affects: [],
            triggeredFuncs: ['setActionCalls'],
            listenerFunc: 'accessSheet',
            listener: 'change:character_name'
        }
    }
};
let selectName = null;
let selectTitle = null;
let repeatingPrefix = '';


// //- @pugdoc
// name: attrTitle
// description: Converts an attribute name into an attribute call for that attribute. Converts `_max` attribute names to the proper attribute call syntax for `_max` attributes (see second example). If called from inside the block of a {@link fieldset} mixin, will also add the appropriate information for calling a repeating attribute.
// arguments:
//   - {string} attrName - The attribute name to create an attribute call for.
// attributes:
// example: |
//   include _htmlelements.pug
//   //Basic attribute name
//   +input({name:'hidden name',type:'text',title:attrTitle('user accessible name')})

//   //Max attribute name
//   +input({name:'hidden max',type:'number',title:attrTitle('user accessible max')})

//   //fieldset attrTitle
//   +fieldset({name:'equipment'})
//     +input({name:'name',type:'text',title:attrTitle('user accessible name')})
const attrTitle = (string) => {
    if (!(typeof string === 'string' || string instanceof String)) {
        throw new TypeError(`attrTitle() expected a string, got ${typeof string}`);
    }
    return `@{${repeatingPrefix}${replaceSpaces(string).replace(/_max$/, '|max')}}`;
}




// //- @pugdoc
// name: buttonTitle
// description: Converts an ability name into an ability call for that attribute. If called from inside the block of a {@link fieldset} mixin, will also add the appropriate information for calling a repeating attribute.
// arguments:
//   - {string} abilityName - The ability name to create a call for.
// attributes:
// example: |
//   include _htmlelements.pug
//   //Basic attribute name
//   +button({name:'hidden button',type:'text',title:buttonTitle('user accessible name')})

//   //fieldset attrTitle
//   +fieldset({name:'equipment'})
//     +button({name:'button',type:'text',title:buttonTitle('user accessible name')})
const buttonTitle = (string) => {
    if (!(typeof string === 'string' || string instanceof String)) {
        throw new TypeError(`buttonTitle() expected a string, got ${typeof string}`);
    }
    return `%{${repeatingPrefix}${replaceSpaces(string)}}`;
}





// //- @pugdoc
// name: replaceSpaces
// description: Replaces spaces in a string with underscores (`_`).
// arguments:
//   - {string} string - The string to work on
// attributes:
const replaceSpaces = (string) => {
    if (!(typeof string === 'string' || string instanceof String)) {
        throw new TypeError(`replaceSpaces() expected a string, got ${typeof string}`);
    }
    return string.replace(/\s+/g, '_');
}







// //- @pugdoc
// name: replaceProblems
// description: Escapes problem characters in a string for use as a regex.
// arguments:
//   - {string} string - The string to work on
// attributes:
const replaceProblems = (string) => {
    if (!(typeof string === 'string' || string instanceof String)) {
        throw new TypeError(`replaceProblems() expected a string, got ${typeof string}`);
    }
    return string.replace(/[\(\)\[\]\|\/\\]/g, '-');
}










// //- @pu/* gdoc
// name: capitalize
// description: Capitalizes the first let of words in a string.
// arguments:
//   - {string} string - The string to work on
// attributes:
// - */
const capitalize = (string) => {
    if (!(typeof string === 'string' || string instanceof String)) {
        throw new TypeError(`capitalize() expected a string, got ${typeof string}`);
    }
    return string.replace(/(?:^|\s+|\/)[a-z]/ig, (letter) => letter.toUpperCase());
}







const actionButtonName = (name) => {
    if (!(typeof name === 'string' || name instanceof String)) {
        throw new TypeError(`actionButtonName() expected a string, got ${typeof name}`);
    }
    return `${name.replace(/_|\s+/g, '-')}`;
}
const actionInputName = (name) => {
    if (!(typeof name === 'string' || name instanceof String)) {
        throw new TypeError(`actionInputName() expected a string, got ${typeof name}`);
    }
    return `${name}_action`.replace(/roll_action/, 'action');
}

const titleToName = (string) => {
    if (!(typeof string === 'string' || string instanceof String)) {
        throw new TypeError(`titleToName() expected a string, got ${typeof string}`);
    }
    return string.replace(/[@%]\{|\}/g, '');
}


const addIfUnique = (item, arrName) => {
    varObjects[arrName] = varObjects[arrName] || [];
    if (varObjects[arrName].indexOf(item) === -1) {
        varObjects[arrName].push(item);
    }
};

const storeTrigger = function (element) {
    let trigger = element.trigger || {};
    const namePrefix = {
        roll: 'roll_',
        action: 'act_',
        fieldset: 'fieldset_'
    };
    const typeDefs = {
        select: '',
        radio: 0,
        checkbox: 0,
        number: 0,
        text: '',
        span: ''
    };
    const eventTypes = {
        roll: 'clicked',
        action: 'clicked',
        fieldset: 'remove'
    };
    let elementName = element.title ?
        titleToName(element.title) :
        element.name;
    trigger.name = elementName.replace(/\|/g, '_');
    let cascName = `${namePrefix[element.type] || 'attr_'}${trigger.name}`;
    let match = trigger.name.match(/(repeating_[^_]+)_[^_]+_(.+)/);
    let [, section, field] = match || [, , trigger.name];
    let eventType = eventTypes[element.type] || 'change';
    if (!varObjects.cascades[cascName]) {
        if (trigger.listener || trigger.triggeredFuncs || trigger.listenerFunc || trigger.initialFunc || trigger.affects) {
            trigger.listener = trigger.listener || `${eventType}:${section ? `${section}:` : ''}${field}`;
            trigger.listenerFunc = trigger.listenerFunc || 'accessSheet';
        }
        trigger.type = element.type;
        if (!namePrefix[element.type]) {
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
            if (trigger.affects) {
                trigger.affects = trigger.affects.map((affect) => replaceSpaces(affect));
            } else {
                trigger.affects = [];
            }
        }
        varObjects.cascades[cascName] = { ...trigger };
    } else {
        if (!namePrefix[varObjects.cascades[cascName].type]) {
            varObjects.cascades[cascName].triggeredFuncs = trigger.triggeredFuncs ?
                [...new Set([...varObjects.cascades[cascName].triggeredFuncs, ...trigger.triggeredFuncs])] :
                varObjects.cascades[cascName].triggeredFuncs;
            varObjects.cascades[cascName].affects = trigger.affects ?
                [...new Set([...varObjects.cascades[cascName].affects, ...trigger.affects])] :
                varObjects.cascades[cascName].affects;
            varObjects.cascades[cascName].calculation = varObjects.cascades[cascName].calculation ||
                trigger.calculation;
        }
        if (trigger.listenerFunc || trigger.triggeredFuncs || trigger.affects) {
            varObjects.cascades[cascName].listener = varObjects.cascades[cascName].listener || trigger.listener || `${eventType}:${section ? `${section}:` : ''}${field}`;
            varObjects.cascades[cascName].listenerFunc = varObjects.cascades[cascName].listenerFunc || trigger.listenerFunc || 'accessSheet';
        }
    }
};

const getSectionDetails = function (section) {
    return varObjects.repeatingSectionDetails.find((obj) => obj.section === section);
};

const createFieldsetObj = function (section) {
    !getSectionDetails(section) ?
        varObjects.repeatingSectionDetails.push({ section, fields: [] }) :
        null;
};

const addFieldToFieldsetObj = function (obj) {
    let section = repeatingPrefix.replace(/_[^_]+_$/, '');
    let sectionDetails = getSectionDetails(section);
    let name = obj.name.replace(/^attr_/, '');
    if (sectionDetails && sectionDetails.fields.indexOf(name) < 0) {
        sectionDetails.fields.push(name);
    }
};

const makeElementObj = function (obj) {
    const newObj = { ...obj };
    delete newObj.trigger;
    return newObj;
};