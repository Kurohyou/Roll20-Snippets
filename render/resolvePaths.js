const { resolve } = require('path');
const path = require('path');

const resolvePaths = (source,destination,entry) => {
  const resSource = path.resolve(source,entry.name);
  const resDest = destination ?
    path.resolve(destination,entry.name.replace(/\.pug$/,'.html').replace(/\.scss$/,'.css')) :
    undefined;
  return [resSource,resDest];
}

module.exports = resolvePaths;