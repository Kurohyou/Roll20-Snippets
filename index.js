const colors = require('colors');
const path = require('path');
const {pathToFileURL} = require('url');
const fs = require('fs/promises');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const pug = require('pug');
const sass = require('sass-embedded');

const getTemplate = (filePath) => fs.readFile(filePath,'utf8')
  .then(text => {
    return text.replace(/include k-scaffold/g,'include /node_modules/@kurohyou/k-scaffold/_k.pug')
  });

const kErrorHead = (string) => {
  const borderForString = [...Array(string.length).keys()].map(()=>'=').join('');
  console.log(`==========${borderForString}\n==== ${string} ====\n==========${borderForString}`.bgRed);
}

const kStatus = (string) => {
  console.log(`${string}`.bgBlue);
}

const outputTests = async (document,destination) => {
  const mockPath = path.resolve(__dirname,'./lib/scripts/testing/jest.mocks.js');
  const mockScafPath = path.resolve(__dirname,'./lib/scripts/testing/mockScaffold.js');
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

/**
 * Renders pug into html text
 * @param {string} source - The path to the file you want to parse as pug.
 * @param {string} destination - The path to the file where you want to store the rendered HTML.
 * @param {object} [options] - Options for how the k-scaffold should parse the pug and options that should be passed to pugjs. Accepts all options specified at pugjs.org as well as:
 * @param {boolean} [options.suppressStack = true] - Whether the K-scaffold should suppress the full error stack from pug and only display the message portion of the error. The stack traces provided by pug do not refer to the actual chain of included pug files, and so are usually useless in troubleshooting an issue.
 * @returns {Promise<string|null>} - The rendered HTML or null if an error occurred
 */
const renderPug = async ({source,destination,testDestination,options={suppressStack:true}}) => {
  const template = await getTemplate(source);
  try{
    const html = pug.render(template,{pretty:true,...options,filename:source,basedir:path.dirname(process.argv[1])});
    await outputPug(html,destination,testDestination);
    return html;
  }catch(err){
    if(err.message.endsWith('kScript mixin already used. Kscript should be the final mixin used in the sheet code.')){
      kErrorHead('K-scaffold PARSE ERROR');
      console.log('kScript mixin already used. Kscript should be the final mixin used in the sheet code.');
    }else{
      kErrorHead('PUG PARSE ERROR');
      if(options.suppressStack){
        console.error(err.message)
      }else{
        console.error(err);
      }
    }
    return null;
  }
};

/**
 * Renders SCSS into CSS text
 * @param {string} source - The path to the file you want to parse as SCSS.
 * @param {string} destination - The path to the file where you want to store the rendered CSS.
 * @param {object} [options = {}] - Options for how the k-scaffold should parse the SCSS and options that should be passed to SASS. Accepts all options specified at sass-lang.com.
 * @returns {Promise<string|null>} - The rendered css or null if an error occurred
 */
const renderSASS = async ({source,destination,options={}}) => {
  try{
    const dirname = path.dirname(process.argv[1]);
    const compileOptions = {
      charset:false,
      importers: [
        {
          findFileUrl(url) {
            if(!url.startsWith('k-scaffold/')) return null;
            const sub = url.substring(2);
            const fileURL = pathToFileURL(path.resolve(dirname,'node_modules/@kurohyou/k-scaffold/_k.scss'));
            const newURL = new URL(fileURL);
            return newURL;
          }
        }
      ]
    };
    const currOptions = {...options};
    if(currOptions.importers){
      compileOptions.importers.push(...currOptions.importers);
      delete currOptions.importers;
    }
    Object.assign(compileOptions,currOptions);

    const {css} = await sass.compileAsync(source,compileOptions);
    if(destination){
      await fs.writeFile(destination,css);
      console.log(`CSS written to ${destination}`);
    }

    return css
  }catch(err){
    
    kErrorHead('SCSS PARSE ERROR');
    if(options.suppressStack){
      console.error(err.message)
    }else{
      console.error(err);
    }
    return null;
  }
};

/**
 * Renders PUG and SCSS into HTML and CSS text
 * @param {string} source - The path to the directory containing your PUG and SCSS files
 * @param {string} destination - The path to the directory where you want your HTML and CSS files to be created
 * @param {object} [pugOptions] - Options for how the k-scaffold should parse the pug and options that should be passed to pugjs. Accepts all options specified at pugjs.org as well as:
 * @param {boolean} [pugOptions.suppressStack = true] - Whether the K-scaffold should suppress the full error stack from pug and only display the message portion of the error. The stack traces provided by pug do not refer to the actual chain of included pug files, and so are usually useless in troubleshooting an issue.
 * @param {object} [scssOptions = {}] - Options for how the k-scaffold should parse the SCSS and options that should be passed to SASS. Accepts all options specified at sass-lang.com.
 * @returns {Promise<array[]>} - Array containing all rendered HTML text in an array at index 0 and all rendered CSS text at index 1.
 */
const renderAll = async ({source ='./',destination,testDestination,pugOptions={suppressStack:true},scssOptions={}}) => {
  const destDir = path.dirname(destination);
  const files = await fs.opendir(source);
  const pugOutput = [];
  const scssOutput = [];
  for await (entry of files){
    if(entry.isFile() && !entry.name.startsWith('_') && (entry.name.endsWith('.pug') || entry.name.endsWith('.scss'))){
      const resSource = path.resolve(source,entry.name);
      const resDest = destination ?
        path.resolve(destination,entry.name.replace(/\.pug$/,'.html').replace(/\.scss$/,'.css')) :
        undefined;
      if(entry.name.endsWith('.scss')){
        kStatus(` Processing ${entry.name} `);
        const newSass = await renderSASS({source:resSource,destination:resDest,options:scssOptions});
        scssOutput.push(newSass);
      }
      if(entry.name.endsWith('.pug')){
        kStatus(` Processing ${entry.name} `);
        const newPug = await renderPug({source:resSource,destination:resDest,testDestination,options:pugOptions});
        pugOutput.push(newPug);
      }
    }
  }
  return [pugOutput,scssOutput];
};

module.exports = {
  pug:renderPug,
  scss:renderSASS,
  all:renderAll
};