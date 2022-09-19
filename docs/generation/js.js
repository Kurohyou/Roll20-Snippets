const fs = require(`fs/promises`);
const hb = require(`handlebars`);
const markdown = require(`markdown`).markdown;

const parseJSdoc = async (docData,docPath) => {
  const template = await fs.readFile(`${docPath}/templates/js.handlebars`,`utf8`)
    .then(t => hb.compile(t));
  // console.log(`TEMPLATE`,template);
  docData.sort((a,b)=>a.name.localeCompare(b.name));
  const rendered = template({docData});
  return fs.writeFile(`${docPath}/js.html`,rendered);
};

module.exports = parseJSdoc;