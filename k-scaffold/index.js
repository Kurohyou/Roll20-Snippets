const path = require('path');
const {pathToFileURL} = require('url');
const fs = require('fs/promises');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const pug = require('pug');
const sass = require('sass-embedded');

const getTemplate = (filePath) => fs.readFile(filePath,'utf8')
  .then(text => text.replace(/include k-scaffold/g,'include /node_modules/k-scaffold/_k.pug'));

const outputPug = async (html,destination) => {
  if(!destination) return;
  const destDir = path.dirname(destination);
  console.log(destDir);
  await fs.mkdir(destDir,{recursive:true});
  await fs.writeFile(destination,html);
  const dom = new JSDOM(html);
  const { window } = dom;
  const { document } = window;
  
  const transArr = [...document.querySelectorAll('[data-i18n]')];
  const translations = transArr.reduce((memo,el)=>{
    memo[el.dataset.i18n] = el.textContent?.trim() || el.dataset.i18n;
    return memo;
  },{});
  console.log('translations',translations);
  if(translations){
    const translationHandle = await fs.open(path.resolve(path.dirname(destination),'translations.json'),'w+');
    const currTranslation = await translationHandle.readFile('utf8')
      .then(t => JSON.parse(t))
      .catch( e => {return {}});
    Object.entries(translations)
      .forEach(([key,val]) => {
        if(!currTranslation[key]){
          currTranslation[key] = val;
        }
      });
    translationHandle.writeFile(JSON.stringify(currTranslation,null,2),'utf8');
    translationHandle.close();
  }

};

const renderPug = async ({source,destination,options={}}) => {
  const template = await getTemplate(source);
  const html = pug.render(template,{pretty:true,...options,basedir:path.dirname(process.argv[1])});
  await outputPug(html,destination);
  return html;
};

const renderSASS = async ({source,destination,options={}}) => {
  const dirname = path.dirname(process.argv[1]);
  const rPath = path.resolve(dirname,'./node_modules/k-scaffold');
  const compileOptions = {
    charset:false,
    importers: [
      {
        findFileUrl(url) {
          if(!url.startsWith('k/')) return null;
          const sub = url.substring(2);
          const fileURL = pathToFileURL('node_modules/k-scaffold');
          const newURL = new URL(sub, pathToFileURL('node_modules/k-scaffold/'));
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
    fs.writeFile(destination,css);
  }

  return css
};

module.exports = {
  pug:renderPug,
  scss:renderSASS
};