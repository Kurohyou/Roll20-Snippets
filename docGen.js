const pugDoc = require('pug-doc');
const { exec } = require('child_process');
const fs = require('fs/promises');
const hb = require('handlebars');
const card = require('./docs/templates/card.handlebars');
const nav = require('./docs/templates/navElement.handlebars');

hb.registerPartial('card',card);
hb.registerPartial('navElement',nav);

console.log('Generating Documentation');
const parsePugdoc = async (docData) => {
  const template = await fs.readFile('./docs/templates/pug.handlebars','utf8')
    .then(t => hb.compile(t));
  // console.log('TEMPLATE',template);
  const rendered = template({docData});
  return fs.writeFile('./docs/pug.html',rendered);
};
const parseJSdoc = async (docData) => {
  const template = await fs.readFile('./docs/templates/js.handlebars','utf8')
    .then(t => hb.compile(t));
  // console.log('TEMPLATE',template);
  const rendered = template({docData});
  return fs.writeFile('./docs/js.html',rendered);
};

const gen = async ()=>{
  const pdocs = new Promise((res,rej) => {
      pugDoc({
      input: 'k-scaffold/modules/**/*.pug',
      output: 'docs/data/pug.json',
      complete:()=> res(true)
    });
  });

  const jdocs = new Promise((res,rej) => {
    exec('jsdoc -r -X k-scaffold/modules > docs/data/jsdoc-ast.json',(err,stdout,stderr)=> res(true));
  });
  await Promise.all([pdocs,jdocs]);
  const pJSON = await fs.readFile('docs/data/pug.json','utf8')
    .then(t => JSON.parse(t));
    const jJSON = await fs.readFile('docs/data/jsdoc-ast.json','utf8')
      .then(t =>
        JSON.parse(t)
          .filter(o => o.comment && !o.undocumented && !o.memberof)
      );
  // JSON.parse(pdocs).then(a => console.log('pdocs',a))
  // console.log('pdocs',pdocs[0].meta);
  // console.log('jdocs',Array.isArray(jdocs));
  await Promise.all([
    parsePugdoc(pJSON),
    parseJSdoc(jJSON)
  ])
  console.log('Doc Data generated');
};

gen();