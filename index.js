const build = require('./render');

module.exports = {
  pug:(o)=>build({...o,runSCSS:false}),
  pug:(o)=>build({...o,runPUG:false}),
  all:build
};