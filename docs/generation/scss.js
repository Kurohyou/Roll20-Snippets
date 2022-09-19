const fs = require(`fs/promises`);
const hb = require(`handlebars`);
const markdown = require(`markdown`).markdown;

const parseSCSSdoc = async (docData,docPath) => {
  const template = await fs.readFile(`${docPath}/templates/scss.handlebars`,`utf8`)
    .then(t => hb.compile(t));
  docData.sort((a,b)=>a.context.name.localeCompare(b.context.name));
  const rendered = template({docData});
  return fs.writeFile(`${docPath}/scss.html`,rendered);
};

module.exports = parseSCSSdoc;