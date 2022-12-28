const watch = require('node-watch');

const processSheet = require('./processSheet');

const kWatch = ({source ='./',destination,testDestination,pugOptions={suppressStack:true},scssOptions={}}) => {
  watch(source, 
    {
      recursive: true,
      filter(f, skip) {
        // Basic watch call adapted from node-watch docs
        // skip node_modules
        if (/\/node_modules/.test(f)) return skip;
        // skip .git folder
        if (/\.git/.test(f)) return skip;
        // Skip generated test framework
        if(/testFramework\.js|\.(?:test|mock)\.js/.test(f)) return skip;
        // only watch for valid sheet files (js, scss, pug)
        return /\.(js|pug|scss)$/i.test(f);
      }
    },
    async (evt,name)=>{
      console.log('node-watch name',name);
      const runSCSS = name.endsWith('.scss');
      const runPUG = /\.(?:js|pug)$/i.test(name);

      if( !runSCSS && !runPUG ) return;

      await processSheet({source,destination,testDestination,pugOptions,scssOptions,runSCSS,runPUG});
    });
};

module.exports = kWatch;