const docPath = `./docs`;

// NPM modules
const { exec } = require(`child_process`);
const fs = require(`fs/promises`);
const hb = require(`handlebars`);
const pugDoc = require('pug-doc');
const sassdoc = require('sassdoc');
const markdown = require(`markdown`).markdown;

// Custom modules
const parseJSdoc = require('./docs/generation/js');
const parsePugdoc = require('./docs/generation/pug');
const parseSassdoc = require('./docs/generation/scss');

// html tempaltes
const card = require(`${docPath}/templates/card.handlebars`);
const nav = require(`${docPath}/templates/navElement.handlebars`);

const parseLinks = (text) => markdown.toHTML(text?.trim().replace(/\{@link (.+?)\}/g,`[$1](#$1)`) || ``).replace(/<\/?p>/g,``);

hb.registerPartial(`card`,card);
hb.registerPartial(`navElement`,nav);

hb.registerHelper(`parseLinks`,parseLinks);
hb.registerHelper(`codeFormat`,(text)=>text.trim().replace(/>(<[^\/])/g,`>\n$1`).replace(/\/></g,`/>\n<`).replace(/(<\/.+?>)</g,`$1\n<`).replace(/include \.\.\/_k\.pug/,`include k-scaffold`))
hb.registerHelper('hasArgs',(params,metaArgs)=> params || metaArgs);
hb.registerHelper('kName',(name,contextName,metaName) =>
  name || contextName ?
    `k.${name || contextName}` :
    metaName
);

console.log(`Generating Documentation`);

const gen = async ()=>{
  // generate pug data
  const pdocs = new Promise((res,rej) => {
      pugDoc({
      input: `lib/**/*.pug`,
      output: `docs/data/pug.json`,
      complete:()=> res(true)
    });
  });

  // Generate jsDoc data
  const jdocs = new Promise((res,rej) => {
    exec(`jsdoc -r -X lib > docs/data/jsdoc-ast.json`,(err,stdout,stderr)=> res(true));
  });

  await Promise.all([pdocs,jdocs]);
  const pJSON = await fs.readFile(`docs/data/pug.json`,`utf8`)
    .then(t => JSON.parse(t));
  const jJSON = await fs.readFile(`docs/data/jsdoc-ast.json`,`utf8`)
    .then(t =>
      JSON.parse(t)
        .filter(o => o.comment && !o.undocumented && !o.memberof)
    );

  // Generate sass data
  const sJSON = await sassdoc.parse('./lib',{verbose:true,package:'./package.json'});
  // JSON.parse(pdocs).then(a => console.log(`pdocs`,a))
  // console.log(`pdocs`,pdocs[0].meta);
  // console.log(`jdocs`,Array.isArray(jdocs));
  await Promise.all([
    parsePugdoc(pJSON,docPath),
    parseJSdoc(jJSON,docPath),
    parseSassdoc(sJSON,docPath)
  ])
  console.log(`\n\x1b[32m`);
  console.log(`==========================`);
  console.log(`||| Doc Data generated |||`);
  console.log(`|||  ${docPath}/index.html |||`);
  console.log(`|||   ${docPath}/js.html   |||`);
  console.log(`|||   ${docPath}/pug.html  |||`);
  console.log(`==========================`);
  console.log(`\x1b[0m`)
};

gen();