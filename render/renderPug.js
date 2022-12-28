const pug = require('pug');
const path = require('path');

const kErrorHead = require('./errorHead');
const getTemplate = require('./getTemplate');
const outputPug = require('./outputPug');

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

module.exports = renderPug;