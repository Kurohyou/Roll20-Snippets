const path = require('path');
const fs = require('fs/promises');

const outputTests = async (document,destination) => {
  const mockPath = path.resolve(__dirname,'./../lib/scripts/mock20.js');
  const mockScafPath = path.resolve(__dirname,'./../lib/scripts/mockScaffold.js');
  const scriptContent = document.querySelector('script').innerHTML;
  const repeatingAttributes = [...document.querySelectorAll('fieldset')].reduce((memo,fieldset)=>{
    const repAttr = [...fieldset.querySelectorAll('[name^="attr_"]')];
    memo.push(...repAttr);
    return memo;
  },[]);
  const attributes = JSON.stringify(
    [...document.querySelectorAll('[name^="attr_"]:not(div)')].reduce((memo,el)=>{
      if(repeatingAttributes.indexOf(el) < 0){
        const name = el.getAttribute('name').replace(/attr_/,'');
        if(Object.keys(memo).includes(name) && !el.checked){
          return memo;
        }
        const tag = el.tagName;
        if(tag === 'SELECT'){
          // Handling for selecting default option of a select
          memo[name] = (
              el.querySelector('[selected]') || 
              el.querySelector(':first-child')
            )?.value || '';
        }else if (el.type === 'radio'){
          // handling for radios
          if(el.checked){
            memo[name] = el.value;
          }
        }else if(el.type === 'checkbox'){
          // Handling for checkboxes
          memo[name] = el.checked ?
            el.value :
            0;
        }else{
          memo[name] = el.getAttribute('value') || '';
        }
      }
      return memo;
    },{})
  );
  const scriptPrepend = await fs.readFile(mockPath,'utf8')
    .then(t => t.replace(/\/\/ PLACE DEFAULT ATTRIBUTES/,`attributes:${attributes},`));
  const scriptAppend = await fs.readFile(mockScafPath,'utf8');
  const testContent = `${scriptPrepend}\n${scriptContent}\n${scriptAppend}`;
  await fs.mkdir(destination,{recursive:true});
  return fs.writeFile(path.resolve(destination,'./testFramework.js'),testContent);
};

module.exports = outputTests;