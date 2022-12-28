const k = require('./..');//Require the K-scaffold that we installed via NPM
const kOpts = {destination:'./build',testDestination:'./source/assets/js',source:'./source',pugOptions:{suppressStack:false}};
// We've set our output directory as roll20code, located directly in this same directory.

if(process.argv[2] !== 'run'){
  kOpts.watch = true;
}
k.all(kOpts);// Invoke the all method of the K-scaffold npm package to process all pug and scss files that are in the same directory as this file.