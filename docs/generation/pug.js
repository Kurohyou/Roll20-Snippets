const pugDoc = require(`pug-doc`);
const markdown = require(`markdown`).markdown;
const fs = require(`fs/promises`);
const hb = require(`handlebars`);

const parsePugdoc = async (docData,docPath) => {
  const template = await fs.readFile(`${docPath}/templates/pug.handlebars`,`utf8`)
    .then(t => hb.compile(t));
  docData.sort((a,b)=>a.meta.name.localeCompare(b.meta.name));
  const rendered = template({docData});
  return fs.writeFile(`${docPath}/pug.html`,rendered);
};

module.exports = parsePugdoc;