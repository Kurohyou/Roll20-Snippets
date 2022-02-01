/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Sheet Updaters and styling functions
const updateHandlers = {};
const openHandlers = {};
const updateSheet = function(){
  log('updating sheet');
  getAllAttrs({props:['sheet_version','debug_mode','collapsed',...baseGet],
    callback:(attributes,sections,casc)=>{
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
      Object.entries(openHandlers).forEach(([funcName,func])=>{
        debug(`running ${funcName}`);
        func({attributes,sections,casc});
      });
      attributes.sheet_version = kFuncs.version;
      log(`Sheet Update applied. Current Sheet Version ${kFuncs.version}`);
      //styleOnOpen(attributes,sections);
      //setActionCalls({attributes,sections});
      ['pug','js'].forEach((type)=>{
        if(casc[`attr_k${type}docs`]){
          attributes[`k${type}docs`] = docGen(type);
          if(type==='pug'){
            debug({[`k${type}docs`]:attributes[`k${type}docs`]});
          }
        }
      });
      attributes.set();
      log('Sheet ready for use');
    }
  });
};

const docGen = function(language){
  if(language==='pug'){
    debug(`doc gen for ${language}`);
    debug({[`docs.pug`]:docs.pug});
  }
  let docHead = [`# K Scaffold ${language.toUpperCase()} documentation`];
  Object.keys(docs[language]).forEach((funcName)=>{
    docHead.push(`- [${funcName}](#${funcName.replace(/\./g,'').replace(/\s/g,'-')})`);
  });
  return Object.entries(docs[language]).reduce((text,[name,docObj])=>{
    let type = docObj.type;
    text.push(`## ${docObj.name || name}`,`\`${type}\`\n`);
    if(docObj.invocation){
      text.push(`\`\`\`js\n${docObj.invocation}\n\`\`\``);
    }
    if(docObj.description){
      text.push(docObj.description);
    }
    let args = Array.isArray(docObj.arguments) ? docObj.arguments : [];
    if(args.length){
      text.push('|Argument|type|description|','|---|---|---|')
    }
    args.forEach((a)=>{
      text.push(`|${a.name}|\`${a.type}\`|${a.description || ''}|`)
    });
    if(args.length){
      text.push('\n')
    }
    let example = Array.isArray(docObj.example) ? docObj.example : [];
    if(example.length){
      text.push(`### Example${example.length > 1 ? 's' : ''}`);
    }
    example.forEach((eArr)=>{
      text.push(
        `**${language.toUpperCase()}**`,
        `\`\`\`js`,
        eArr[0],
        `\`\`\``
      );
      if(docObj.type === 'mixin'){
        text.push(
          '**HTML**',
          `\`\`\`html`,
          eArr[1],
          `\`\`\``
        );
      }
    });
    if(docObj.retValue){
      text.push(`returns \`${docObj.retValue.type}\` ${
        docObj.retValue.description ? 
          `- ${docObj.retValue.description}` :
          ''
        }`
      );
    }
    return text;
  },docHead).join('\n');
};

const initialSetup = function(attributes,sections){
debug('Initial sheet setup');
};

docs.js.accessSheet = {
  name:'k.accessSheet',
  type:'function',
  description:'The default listener for the K-scaffold. Used whenever a `listenerFunc` is not specified in an attribute\'s trigger object',
  arguments:[
    {type:'object',name:'event',description:'The event from the Roll20 trigger as described in [the wiki](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object)'}
  ]
};
const accessSheet = function(event){
debug({funcs:Object.keys(funcs)});
debug({event});
getAllAttrs({event,callback:(attributes,sections,casc)=>{
  let trigger = attributes.getCascObj(event,casc);
  attributes.processChange({event,trigger,attributes,sections,casc});
}});
};
funcs.accessSheet = accessSheet;