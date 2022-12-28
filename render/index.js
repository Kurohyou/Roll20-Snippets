const watchSheet = require('./watch');
const processSheet = require('./processSheet');

/**
 * Renders PUG and SCSS into HTML and CSS text
 * @param {string} source - The path to the directory containing your PUG and SCSS files
 * @param {string} destination - The path to the directory where you want your HTML and CSS files to be created
 * @param {object} [pugOptions] - Options for how the k-scaffold should parse the pug and options that should be passed to pugjs. Accepts all options specified at pugjs.org as well as:
 * @param {boolean} [pugOptions.suppressStack = true] - Whether the K-scaffold should suppress the full error stack from pug and only display the message portion of the error. The stack traces provided by pug do not refer to the actual chain of included pug files, and so are usually useless in troubleshooting an issue.
 * @param {object} [scssOptions = {}] - Options for how the k-scaffold should parse the SCSS and options that should be passed to SASS. Accepts all options specified at sass-lang.com.
 * @returns {Promise<array[]>} - Array containing all rendered HTML text in an array at index 0 and all rendered CSS text at index 1.
 */
const build = async ({source ='./',destination,testDestination,pugOptions={suppressStack:true},scssOptions={},watch=false}) => {
  const [html,css] = await processSheet({source,destination,testDestination,pugOptions,scssOptions});
  if(watch){
    return watchSheet({source,destination,testDestination,pugOptions,scssOptions});
  }else{
    return [html,css];
  }
};

module.exports = build;