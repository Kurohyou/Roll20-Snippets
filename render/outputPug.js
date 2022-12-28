const path = require('path');
const fs = require('fs/promises');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const outputTests = require('./outputTests');

const outputPug = async (html,destination,testDestination) => {
  if(!destination) return;
  const destDir = path.dirname(destination);
  await fs.mkdir(destDir,{recursive:true});
  await fs.writeFile(destination,html);
  console.log(`HTML written to ${destination}`);
  const dom = new JSDOM(html);
  const { window } = dom;
  const { document } = window;
  if(testDestination){
    await outputTests(document,testDestination);
  }
  // List items are handled as part of the i18n list checking
  const i18nSubTypes = ['','-title','-placeholder','-label','-aria-label','-alt','-vars','-dynamic','-list'];
  const translations = i18nSubTypes.reduce((memo,type)=>{
    const transElems = [...document.querySelectorAll(`[data-i18n${type}]`)];
    const baseType = type.replace(/^-/,'');
    transElems.forEach(el => {
      if(type === '-list'){
        const listArr = [];
        const items = [...el.querySelectorAll('[data-i18n-list-item]')];
        items.forEach(item => {
          if(item.dataset['i18n-list-item']){
            listArr.push(dataset['i18n-list-item']);
          }
        });
        memo[el.dataset['i18n-list']] = listArr.filter(s => s && s.trim()).join(',');
      }else{
        memo[el.dataset[`i18n${type}`]] = (
            type ?
              el.getAttribute(baseType):
              el.textContent?.trim()
          ) ||
          el.dataset[`i18n${type}`] ;
      }
    });
    return memo;
  },{});
  if(translations){
    const transPath = path.resolve(path.dirname(destination),'translation.json');
    const currTranslation = await fs.readFile(transPath,'utf8')
      .then(t => JSON.parse(t))
      .catch( e => {return {}});
    const toUse = {...currTranslation,...translations};
    await fs.writeFile(transPath,JSON.stringify(toUse,null,2));
  }
};

module.exports = outputPug;