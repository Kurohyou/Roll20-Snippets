const fs = require('fs/promises');

const kStatus = require('./kStatus');
const resolvePaths = require('./resolvePaths');
const renderSASS = require('./renderSASS');
const renderPug = require('./renderPUG');

const isSASS = async ({entry,source:resSource,destination:resDest,options,runSCSS}) => {
  if(runSCSS && entry.name.endsWith('.scss')){
    kStatus(` Processing ${entry.name} `);
    return renderSASS({source:resSource,destination:resDest,options});
  }
};

const isPUG = async ({entry,source:resSource,destination:resDest,testDestination,options,runPUG}) => {
  if(runPUG && entry.name.endsWith('.pug')){
    kStatus(` Processing ${entry.name} `);
    return renderPug({source:resSource,destination:resDest,testDestination,options});
  }

};

const processSheet = async ({source ='./',destination,testDestination,pugOptions={suppressStack:true},scssOptions={},runSCSS=true,runPUG=true }) => {
  const files = await fs.opendir(source);
  const pugPromises = [];
  const scssPromises = [];
  for await (entry of files){
    if(entry.isFile() && !entry.name.startsWith('_') && (entry.name.endsWith('.pug') || entry.name.endsWith('.scss'))){
      const [resSource,resDest] = resolvePaths(source,destination,entry);

      const newSASS = await isSASS({entry,source:resSource,destination:resDest,options:scssOptions,runSCSS});

      const newPUG = await isPUG({entry,source:resSource,destination:resDest,testDestination,options:pugOptions,runPUG});

      if(newSASS){
        scssPromises.push(newSASS);
      }
      if(newPUG){
        pugPromises.push(newPUG);
      }
    }
  }
  const pugOutput = await Promise.all(pugPromises);
  const scssOutput = await Promise.all(scssPromises);
  return [pugOutput,scssOutput];
};

module.exports = processSheet;